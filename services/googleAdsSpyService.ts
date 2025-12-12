import { GoogleGenAI } from "@google/genai";
import { AdsSpyResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const spyOnAds = async (keyword: string): Promise<AdsSpyResult> => {
  try {
    const prompt = `
Analyze Google Ads appearing for this search query:
Search Query: "${keyword}"

**Task 1: Search and Capture Ads**
Search Google for "${keyword}" and identify all paid advertisements (Search Ads, LSAs).

**Task 2: Extract Ad Components**
For each ad, extract:
- Advertiser domain
- Position
- All headlines
- All description lines
- Display URL
- Final landing page URL
- Visible ad extensions (call, location, sitelinks, etc.)

**Task 3: Analyze Landing Pages**
For top advertisers, analyze their landing page:
- Page speed estimate (fast/medium/slow)
- Mobile experience quality (good/fair/poor)
- CTA visibility (above/below fold)
- Form fields count
- Trust signals

**Task 4: Build Swipe Files**
Compile unique headlines and descriptions with character counts.

**Task 5: Theme Analysis**
Identify common themes (e.g., 24/7, Free offers, Certifications) and calculate frequency.

**Task 6: Gap Analysis**
Identify angles NO competitors are using.

**Task 7: Generate Optimized Ads**
Generate 6 headline options and 3 description options based on analysis.

**Task 8: LSA Analysis**
If Local Service Ads appear, capture business names, ratings, review counts, response times, and badges.

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "overview": {
    "totalAds": 8,
    "uniqueAdvertisers": 5,
    "avgPosition": 2.3,
    "lsaPresent": true,
    "lsaCount": 3
  },
  "ads": [
    {
      "advertiser": "Example Corp",
      "domain": "example.com",
      "position": 1,
      "adType": "search",
      "headlines": ["Headline 1", "Headline 2"],
      "descriptions": ["Desc 1..."],
      "displayUrl": "example.com/service",
      "landingPage": "https://example.com/landing",
      "extensions": {
        "call": true,
        "location": true,
        "sitelinks": 4,
        "callouts": true,
        "structuredSnippets": false
      },
      "estimatedMonthlySpend": "$2,000 - $5,000"
    }
  ],
  "headlines": [
    { "text": "Headline 1", "usedBy": ["example.com"], "characterCount": 10 }
  ],
  "descriptions": [
    { "text": "Desc 1...", "usedBy": ["example.com"], "characterCount": 50 }
  ],
  "themes": [
    { "theme": "24/7", "frequency": 5, "totalAds": 8, "yourOpportunity": "Must match" }
  ],
  "missingAngles": [
    { "angle": "Locally Owned", "whyItMatters": "Trust factor" }
  ],
  "landingPages": [
    {
      "competitor": "example.com",
      "url": "https://example.com/landing",
      "pageSpeed": "fast",
      "mobileExperience": "good",
      "ctaVisibility": "above_fold",
      "formFields": 3,
      "trustSignalCount": 4,
      "trustSignals": ["BBB", "Reviews"]
    }
  ],
  "generatedAds": {
    "headlines": [{ "text": "New Headline", "chars": 12, "note": "Strong CTA" }],
    "descriptions": [{ "text": "New Desc...", "chars": 60 }],
    "differentiationStrategy": ["Use local terms"]
  },
  "lsaAnalysis": [
    {
      "businessName": "Local Pro",
      "rating": 4.8,
      "reviewCount": 150,
      "responseTime": "< 1 hour",
      "badges": ["Google Guaranteed"]
    }
  ]
}
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

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText) as AdsSpyResult;

  } catch (error) {
    console.error("Ads Spy Error:", error);
    throw error;
  }
};