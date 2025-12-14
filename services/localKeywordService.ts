import { GoogleGenAI } from "@google/genai";
import { LocalKeywordIntel } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLocalKeywords = async (
  serviceType: string,
  cities: string[]
): Promise<LocalKeywordIntel> => {
  try {
    const prompt = `
Analyze local search behavior differences for "${serviceType}" across these cities:
${cities.join(', ')}

Context: This is for a service business. Different cities have different demographics, property types, and search behaviors.

**Task 1: City Profiles**
For each city, research and provide:
- Population estimate
- Average home value
- Demographic characteristics affecting search behavior
- Primary search pattern observation (e.g., "Brand-focused", "Price-sensitive")
- Opportunity Score (0-100)

**Task 2: Keyword Variation Analysis**
For core keywords (service name, emergency service, etc.):
- How does the PHRASING differ by city?
- What MODIFIERS are used in each city? (e.g., "best", "cheap", "near me", "luxury")

**Task 3: Search Intent Distribution**
Estimate the percentage breakdown of search intent per city:
- Emergency (immediate need)
- Research (gathering information)
- Cost/Price (comparing prices)
- Brand (looking for specific company)

**Task 4: City-Specific Keywords**
For each city, identify top keyword opportunities, unique modifiers, and volume/competition estimates.

**Task 5: Property Type Implications**
Estimate dominant property types (Single Family, Townhouse, Condo, Commercial) percentages for each city and how it affects search.

**Task 6: Seasonal Patterns**
Identify seasonal search trends by city (monthly interest 0-100).

**Task 7: Emerging Trends**
What keywords are RISING in search interest?

**Task 8: Content Strategy Recommendations**
For each city, provide specific content strategy (positioning, modifiers, titles).

**Task 9: Cross-City Gaps**
Identify keywords where competitors rank in some cities but not others.

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "cityOverview": [
    {
      "city": "City Name",
      "state": "State",
      "population": 0,
      "avgHomeValue": 0,
      "primarySearchPattern": "...",
      "opportunityScore": 85,
      "demographicNotes": "..."
    }
  ],
  "keywordVariationMatrix": [
    {
      "baseKeyword": "water damage",
      "variations": [
        { "city": "City A", "variation": "...", "volume": "high" }
      ]
    }
  ],
  "intentByCity": [
    { "city": "City A", "emergency": 30, "research": 30, "costPrice": 20, "brand": 20 }
  ],
  "cityKeywords": [
    {
      "city": "City A",
      "keywords": [
        { "keyword": "...", "volumeEstimate": "high", "competition": "medium", "opportunity": "high" }
      ],
      "uniqueModifiers": ["...", "..."],
      "contentAngle": "..."
    }
  ],
  "propertyTypeDistribution": [
    { "city": "City A", "singleFamily": 60, "townhouse": 20, "condo": 10, "commercial": 10 }
  ],
  "seasonalTrends": [
    {
      "city": "City A",
      "monthlyTrend": [{ "month": "Jan", "interest": 50 }, ...],
      "peakMonth": "July",
      "insight": "..."
    }
  ],
  "emergingKeywords": [
    {
      "keyword": "...",
      "cities": ["City A"],
      "trend": "rising",
      "growthPercent": 25,
      "recommendedAction": "..."
    }
  ],
  "competitorGapsByCity": [
    {
      "city": "City A",
      "keywordGap": "...",
      "competitorRankingElsewhere": "...",
      "opportunity": "..."
    }
  ],
  "contentStrategy": [
    {
      "city": "City A",
      "positioningAngle": "...",
      "modifiersToUse": ["..."],
      "propertyFocus": "...",
      "pricingLanguage": "...",
      "emergencyEmphasis": "high",
      "uniqueSellingPoints": ["..."],
      "recommendedPageTitle": "...",
      "recommendedH1": "..."
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

    return extractJSON(text) as LocalKeywordIntel;

  } catch (error) {
    console.error("Local Keyword Intel Error:", error);
    throw error;
  }
};