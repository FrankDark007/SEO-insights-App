import { GoogleGenAI } from "@google/genai";
import { KeywordRadarResult, CitySubdomain } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const scanKeywordOpportunities = async (
  baseServices: string[],
  cities: CitySubdomain[],
  mainDomain: string
): Promise<KeywordRadarResult> => {
  try {
    const cityList = cities.map(c => `${c.city}, ${c.state} (${c.subdomain})`).join("\n");
    const serviceList = baseServices.join(", ");

    const prompt = `You are an expert local SEO analyst specializing in multi-location businesses. Analyze keyword opportunities for a water damage restoration company.

BUSINESS INFO:
Main Domain: ${mainDomain}
Services: ${serviceList}

CITY SUBDOMAINS:
${cityList}

TASK: Use Google Search to research keyword opportunities for each city. For each city, analyze:

1. Emergency/high-intent keywords (e.g., "emergency water damage [city]", "24 hour flood cleanup [city]")
2. Service-specific keywords (e.g., "basement flooding [city]", "mold remediation [city]")
3. Insurance/cost keywords (e.g., "water damage restoration cost [city]")
4. Long-tail location keywords (e.g., "water damage [neighborhood] [city]")

For each keyword, determine:
- Estimated monthly search volume
- Whether volume is rising, stable, or declining vs last year
- Keyword difficulty (based on who's ranking)
- Who currently ranks #1-3
- Whether this business likely has a page targeting this keyword
- Seasonal patterns

IMPORTANT: Focus on keywords with commercial intent where the business could realistically rank.

Return ONLY valid JSON matching this structure:
{
  "scanDate": "ISO date string",
  "cities": [
    {
      "city": "Arlington",
      "subdomain": "arlington.flooddoctorva.com",
      "totalKeywords": 25,
      "ranking": 8,
      "notRanking": 17,
      "avgPosition": 12.5,
      "totalVolume": 2500,
      "capturedVolume": 800,
      "missedVolume": 1700,
      "topOpportunity": "emergency water damage arlington va",
      "score": 65
    }
  ],
  "allKeywords": [
    {
      "keyword": "water damage restoration arlington va",
      "city": "Arlington",
      "monthlyVolume": 320,
      "volumeTrend": "rising",
      "trendPercent": 15,
      "difficulty": "medium",
      "yourRank": 7,
      "topCompetitor": "servpro.com",
      "competitorRank": 1,
      "hasPage": true,
      "recommendedUrl": "/water-damage-restoration-arlington-va",
      "priority": "high",
      "seasonality": "Peak: Mar-May, Sep-Nov",
      "lastUpdated": "ISO date"
    },
    {
      "keyword": "basement flooding alexandria va",
      "city": "Alexandria",
      "monthlyVolume": 180,
      "volumeTrend": "stable",
      "trendPercent": 2,
      "difficulty": "low",
      "yourRank": null,
      "topCompetitor": "puroclean.com",
      "competitorRank": 1,
      "hasPage": false,
      "recommendedUrl": "/basement-flooding-alexandria-va",
      "priority": "critical",
      "seasonality": "Peak: Mar-Apr",
      "lastUpdated": "ISO date"
    }
  ],
  "pageRecommendations": [
    {
      "keyword": "basement flooding alexandria va",
      "city": "Alexandria",
      "suggestedTitle": "Basement Flooding Cleanup Alexandria VA | 24/7 Emergency Service",
      "suggestedUrl": "/basement-flooding-alexandria-va",
      "estimatedVolume": 180,
      "difficulty": "low",
      "reason": "No existing page, low competition, 180 monthly searches",
      "competitorUrls": ["puroclean.com/alexandria/basement-flooding", "servpro.com/locations/va/alexandria"],
      "priority": "critical",
      "projectedTraffic": 45
    }
  ],
  "clusters": [
    {
      "name": "Emergency Services",
      "keywords": ["emergency water damage", "24 hour flood cleanup", "emergency flood service"],
      "totalVolume": 1500,
      "avgDifficulty": "medium",
      "coverage": 60
    },
    {
      "name": "Mold Remediation",
      "keywords": ["mold removal", "mold remediation", "black mold removal"],
      "totalVolume": 2200,
      "avgDifficulty": "medium",
      "coverage": 40
    }
  ],
  "summary": {
    "totalCities": 5,
    "totalKeywordsTracked": 125,
    "totalMonthlyVolume": 15000,
    "capturedVolume": 6000,
    "missedOpportunityVolume": 9000,
    "pagesNeeded": 18,
    "topRisingKeywords": ["emergency water damage arlington", "flood cleanup fairfax", "burst pipe repair mclean"],
    "seasonalAlerts": ["Spring flooding season approaching - optimize emergency pages", "Hurricane season prep content needed"]
  },
  "quickWins": [
    {
      "keyword": "water damage restoration fairfax",
      "city": "Fairfax",
      "currentRank": 6,
      "volume": 280,
      "action": "Add FAQ section and update content to move from #6 to top 3"
    },
    {
      "keyword": "mold remediation arlington",
      "city": "Arlington",
      "currentRank": 8,
      "volume": 220,
      "action": "Build 2-3 internal links from related pages"
    }
  ]
}

Include at least:
- 15-25 keywords per city
- 5-10 page recommendations prioritized by impact
- 4-6 keyword clusters
- 3-5 quick wins (pages ranking #4-10 that could easily improve)

Focus on actionable insights that will drive traffic growth.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return extractJSON(text) as KeywordRadarResult;
  } catch (error) {
    console.error("Keyword Radar Error:", error);
    throw error;
  }
};