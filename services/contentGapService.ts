import { GoogleGenAI } from "@google/genai";
import { ContentGapResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContentGap = async (
  yourDomain: string,
  competitorDomains: string[],
  services: string[],
  cities: string[]
): Promise<ContentGapResult> => {
  try {
    const prompt = `
Analyze content coverage across services and cities for competitive gap analysis.
Your Domain: ${yourDomain}
Competitors: ${competitorDomains.join(', ')}
Services: ${services.join(', ')}
Cities: ${cities.join(', ')}

Perform a deep analysis using Google Search Grounding to determine which domains have dedicated pages for each Service + City combination.

**Task 1: Coverage Check**
For each combination of service + city, determine:
- Does ${yourDomain} have a dedicated page? (e.g., /service-city/ or /locations/city/)
- Does each competitor have a dedicated page?

**Task 2: Classify Each Cell**
- "own": You have page, no competitors do
- "competitive": You and competitors both have pages
- "gap": Competitors have pages, you don't
- "opportunity": Nobody has dedicated coverage

**Task 3: Estimate Search Volume**
Estimate relative search volume (High/Medium/Low) based on city size and service popularity.

**Task 4: Calculate Priority Scores**
Score each gap/opportunity 0-100 based on:
- Search volume (40%)
- Competitor presence (30%)
- City size/affluence (20%)
- Profitability (10%)

**Task 5: Recommendations**
Provide specific recommendations for top gaps.

**Task 6: Identify Strengths**
Identify where you have coverage but competitors don't.

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "matrix": [
    // Array of arrays representing rows (Cities). Each cell corresponds to a Service column.
    [
      {
        "city": "City A",
        "service": "Service 1",
        "youHave": true,
        "yourUrl": "https://${yourDomain}/service-1-city-a",
        "competitorsCovering": [
          { "domain": "competitor1.com", "url": "https://competitor1.com/city-a/service-1" }
        ],
        "status": "competitive",
        "priorityScore": 85
      }
      // ... more cells for this row
    ]
    // ... more rows
  ],
  "summary": {
    "totalPossible": 150,
    "yourCoverage": 23,
    "yourPercent": 15,
    "competitorAvgCoverage": 45,
    "gaps": 34,
    "opportunities": 68
  },
  "priorityGaps": [
    {
      "city": "City B",
      "service": "Service 2",
      "competitorsCovering": ["competitor1.com"],
      "searchVolumeEstimate": "high",
      "priorityScore": 92,
      "recommendedAction": "Create dedicated landing page immediately"
    }
  ],
  "opportunities": [
    {
       "city": "City C",
       "service": "Service 3",
       "competitorsCovering": [],
       "searchVolumeEstimate": "medium",
       "priorityScore": 75,
       "recommendedAction": "First mover advantage - Build page"
    }
  ],
  "yourStrengths": [
    {
       "city": "City A",
       "service": "Service 1",
       "competitorsMissing": ["competitor2.com"],
       "action": "Add more internal links to solidify ranking"
    }
  ],
  "competitorCoverage": [
    {
      "domain": "competitor1.com",
      "coverage": [{ "city": "City A", "service": "Service 1", "url": "..." }]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText) as ContentGapResult;

  } catch (error) {
    console.error("Content Gap Matrix Error:", error);
    throw error;
  }
};