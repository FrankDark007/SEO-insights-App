import { GoogleGenAI } from "@google/genai";
import { ContentBrief } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContentBrief = async (
  keyword: string,
  location: string = '',
  contentType: string,
  existingUrl: string = ''
): Promise<ContentBrief> => {
  try {
    const prompt = `
You are an expert SEO content strategist. Analyze the current Google search results for the target keyword and generate a comprehensive content brief.

**Inputs:**
- Target Keyword: ${keyword}
- Location Context: ${location || 'National'}
- Content Type: ${contentType}
${existingUrl ? `- Current Page to Improve: ${existingUrl}` : ''}

**Task:**
1. Analyze the implied TOP organic results for "${keyword} ${location}".
2. Extract common patterns (word counts, headers, schemas).
3. Determine search intent (Informational, Commercial, Transactional, Local).
4. Identify gaps in current content vs top competitors.

**Generate the following JSON response exactly:**

{
  "keyword": "${keyword}",
  "searchIntent": "...", 
  "difficultyScore": 0, // 1-10
  "recommendedWordCount": 0,
  "estimatedWriteTime": "X hours",
  "serpAnalysis": [
    // 5 items representing top competitors
    {
      "rank": 1,
      "url": "example.com/...",
      "title": "...",
      "wordCount": 0,
      "h2Count": 0,
      "hasFaq": false,
      "hasSchema": false
    }
  ],
  "requiredH2s": ["Topic A", "Topic B"], // Topics appearing in 3+ top results
  "recommendedH2s": ["Topic C", "Topic D"], // Differentiators
  "questionsToAnswer": ["PAA Question 1", "Common Question 2"],
  "keywordsToInclude": [
    { "keyword": "...", "whereToUse": "Title/H1/Body", "priority": "required" }
  ],
  "contentRequirements": [
    "Include 3 images",
    "Add FAQ schema"
  ],
  "competitorGaps": ["Competitors miss X", "None cover Y"],
  "suggestedOutline": [
    {
      "tag": "h1",
      "text": "...",
      "notes": "...",
      "bulletPoints": ["..."]
    },
    {
      "tag": "h2",
      "text": "...",
      "bulletPoints": ["..."]
    }
  ]
}

**Rules:**
- Output raw JSON only.
- No markdown formatting (\`\`\`json).
- Ensure valid JSON syntax.
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

    return extractJSON(text) as ContentBrief;

  } catch (error) {
    console.error("Content Brief Generation Error:", error);
    throw error;
  }
};