import { GoogleGenAI } from "@google/genai";
import { SerpFeatureAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSerpFeatures = async (
  keywords: string[],
  location: string
): Promise<SerpFeatureAnalysis> => {
  try {
    const prompt = `
Analyze SERP features for these keywords from ${location}:
Keywords:
${keywords.join('\n')}

**Task 1: Search Each Keyword**
For each keyword, search Google and identify which SERP features are present:
- Featured Snippet (paragraph, list, or table)
- People Also Ask (PAA) box
- Local Pack (map with 3 businesses)
- Image Pack
- Video Carousel
- Knowledge Panel

**Task 2: Featured Snippet Analysis**
For keywords with Featured Snippets:
- Who currently owns the snippet?
- What type (paragraph, list, table)?
- What page could you optimize to capture it?

**Task 3: People Also Ask Extraction**
Collect ALL unique PAA questions across all keywords.
For each question:
- Note which keywords trigger it
- Who currently answers it
- Which of your pages could target it

**Task 4: Local Pack Analysis**
For keywords showing Local Pack:
- List the 3 businesses shown
- Their ratings and review counts
- Note if the target business appears (assume business name is "Your Business" for now, or match if obvious)

**Task 5: Image Pack & Video Analysis**
- Identify keywords with Image Packs and Video Carousels.
- Assess top sources.

**Task 6: Generate Capture Strategy**
Provide actionable strategies for capturing Snippets, PAA, Local Pack, Images, and Videos.

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "overview": [
    { "feature": "Featured Snippet", "keywordsWithFeature": 5, "totalKeywords": 10, "youOwn": 0, "competitorsOwn": 5, "opportunity": "5 targets" },
    { "feature": "People Also Ask", "keywordsWithFeature": 8, "totalKeywords": 10, "youOwn": 0, "competitorsOwn": 8, "opportunity": "8 targets" },
    { "feature": "Local Pack", "keywordsWithFeature": 6, "totalKeywords": 10, "youOwn": 0, "competitorsOwn": 6, "opportunity": "Must improve GBP" },
    { "feature": "Image Pack", "keywordsWithFeature": 2, "totalKeywords": 10, "youOwn": 0, "competitorsOwn": 2, "opportunity": "Add alt text" },
    { "feature": "Video Carousel", "keywordsWithFeature": 1, "totalKeywords": 10, "youOwn": 0, "competitorsOwn": 1, "opportunity": "Create YouTube content" }
  ],
  "keywordAnalysis": [
    {
      "keyword": "water damage cost",
      "featuresPresent": ["Featured Snippet", "PAA"],
      "featuredSnippet": { "owner": "homeadvisor.com", "type": "table", "content": "Price ranges..." },
      "paaQuestions": ["How much does it cost?", "Is it covered?"],
      "imagePackPresent": false,
      "videoCarouselPresent": false
    }
  ],
  "featuredSnippetOpportunities": [
    {
      "keyword": "water damage cost",
      "currentOwner": "homeadvisor.com",
      "snippetType": "table",
      "contentNeeded": "Price comparison table",
      "priority": "high",
      "targetPage": "/pricing"
    }
  ],
  "paaQuestions": [
    { "question": "How much does it cost?", "frequency": 5, "currentSource": "angi.com", "targetPage": "/faq" }
  ],
  "localPackAnalysis": [
    {
      "keyword": "water damage restoration",
      "businesses": [
        { "position": 1, "name": "ServPro", "rating": 4.5, "reviews": 100 },
        { "position": 2, "name": "Local Co", "rating": 4.8, "reviews": 50 },
        { "position": 3, "name": "Other Co", "rating": 4.2, "reviews": 20 }
      ],
      "youAppear": false
    }
  ],
  "imageOpportunities": [
    { "keyword": "flooded basement", "topSources": ["istock.com"], "yourImagesIndexed": false, "recommendation": "Add original photos" }
  ],
  "videoOpportunities": [
    { "keyword": "how to dry drywall", "topChannels": ["This Old House"], "localCompetitorPresent": false, "recommendation": "Create how-to video" }
  ],
  "captureStrategy": {
    "featuredSnippets": [
      { "keyword": "water damage cost", "type": "table", "formatNeeded": "HTML Table", "pageToOptimize": "/cost", "contentTemplate": "<h2>...</h2><table>...</table>" }
    ],
    "paa": ["Add FAQ schema", "Answer clearly"],
    "localPack": ["Get more reviews", "Add photos"],
    "images": ["Use descriptive filenames"],
    "videos": ["Optimize YouTube titles"]
  }
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
    return JSON.parse(cleanText) as SerpFeatureAnalysis;

  } catch (error) {
    console.error("SERP Feature Analysis Error:", error);
    throw error;
  }
};