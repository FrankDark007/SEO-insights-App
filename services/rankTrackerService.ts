import { GoogleGenAI } from "@google/genai";
import { RankingResult, StoredRankData, SerpResult } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const STORAGE_KEY = "seo_insight_rank_data";

export const getStoredRankingData = (): StoredRankData | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveRankingData = (data: StoredRankData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearRankingData = () => {
    localStorage.removeItem(STORAGE_KEY);
}

export const checkKeywordRank = async (
  keyword: string,
  location: string,
  domain: string
): Promise<RankingResult> => {
  try {
    const prompt = `
Search Google for the following keyword from the perspective of a user in ${location}:
Keyword: "${keyword}"
Find the ranking position of ${domain} in the organic results (not ads, not map pack).

Return JSON:
{
  "keyword": "${keyword}",
  "yourPosition": <number or null if not in top 20>,
  "topResults": [
    {
      "position": 1,
      "url": "full url",
      "domain": "root domain",
      "title": "page title"
    }
  ]
}

Instructions:
- Include top 10 organic results in topResults array.
- Mark which result matches ${domain} if found.
- If ${domain} is found in top 10, set "yourPosition" to that rank.
- If not found in top 10, check up to top 20 if possible, otherwise null.
- Output strictly valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");
    
    const result = extractJSON(text);

    // Normalize output
    const serp: SerpResult[] = (result.topResults || []).map((r: any) => ({
        position: r.position,
        url: r.url,
        domain: r.domain || new URL(r.url).hostname,
        title: r.title,
        isYou: (r.domain && r.domain.includes(domain)) || (r.url && r.url.includes(domain))
    }));

    // Double check position logic if AI missed it but it's in topResults
    let currentRank = result.yourPosition;
    if (!currentRank) {
        const found = serp.find(s => s.isYou);
        if (found) currentRank = found.position;
    }

    const topCompetitor = serp.length > 0 && serp[0].position === 1 && !serp[0].isYou 
        ? serp[0] 
        : (serp.length > 1 && serp[0].isYou ? serp[1] : null);

    return {
      keyword: keyword,
      currentRank: currentRank,
      previousRank: null, // To be filled by the controller function combining history
      change: null,
      topCompetitor: topCompetitor ? {
          domain: topCompetitor.domain,
          url: topCompetitor.url,
          title: topCompetitor.title
      } : null,
      serp: serp,
      checkedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`Error checking rank for ${keyword}:`, error);
    // Return empty result on error to keep flow going
    return {
        keyword,
        currentRank: null,
        previousRank: null,
        change: 0,
        topCompetitor: null,
        serp: [],
        checkedAt: new Date().toISOString()
    };
  }
};

export const updateRankings = async (
    keywords: string[],
    location: string,
    domain: string,
    onProgress?: (count: number, total: number) => void
): Promise<RankingResult[]> => {
    const existingData = getStoredRankingData();
    const historyMap = existingData ? existingData.history : {};
    
    const results: RankingResult[] = [];
    let completed = 0;

    for (const keyword of keywords) {
        // Sequential execution to be nice to rate limits and show progress
        const result = await checkKeywordRank(keyword, location, domain);
        
        // Calculate Change
        const keywordHistory = historyMap[keyword] || [];
        const lastEntry = keywordHistory.length > 0 ? keywordHistory[keywordHistory.length - 1] : null;
        
        if (lastEntry) {
            result.previousRank = lastEntry.position;
            if (result.currentRank && lastEntry.position) {
                result.change = lastEntry.position - result.currentRank; // Positive change means Rank decreased (improved) numerically, usually we want rank 10 -> 5 = +5 improvement. 
                // Let's standardise: Previous 10, Current 5. Change = 5 (Improved). 
                // Previous 5, Current 10. Change = -5 (Dropped).
                result.change = lastEntry.position - result.currentRank; 
            } else if (!result.currentRank && lastEntry.position) {
                // Dropped out of 100
                result.change = -100; // Arbitrary large drop indicator
            } else if (result.currentRank && !lastEntry.position) {
                // Entered top 100
                result.change = 100; // Arbitrary large gain indicator
            } else {
                result.change = 0;
            }
        } else {
            result.change = null; // New keyword
        }

        // Update History
        if (!historyMap[keyword]) historyMap[keyword] = [];
        historyMap[keyword].push({
            date: new Date().toISOString().split('T')[0],
            position: result.currentRank
        });
        
        // Keep only last 90 entries
        if (historyMap[keyword].length > 90) {
             historyMap[keyword] = historyMap[keyword].slice(-90);
        }

        results.push(result);
        completed++;
        if (onProgress) onProgress(completed, keywords.length);
    }

    // Save
    const newData: StoredRankData = {
        domain,
        location,
        keywords,
        history: historyMap,
        lastChecked: new Date().toISOString()
    };
    saveRankingData(newData);

    return results;
}