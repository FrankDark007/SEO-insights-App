import { GoogleGenAI } from "@google/genai";
import { ReviewAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCompetitorReviews = async (
  businessName: string,
  location: string
): Promise<ReviewAnalysis> => {
  try {
    const prompt = `
Analyze the Google reviews for this business:
Business: "${businessName}"
Location: "${location}"

Search for their Google Business Profile and analyze their reviews using Google Search.

**Task 1: Overview Metrics**
- Total review count
- Average rating
- Distribution (5-star %, 4-star %, etc.)
- Estimate reviews per month (velocity)

**Task 2: Sentiment Analysis**
- Categorize overall sentiment breakdown (Positive, Neutral, Negative).
- **Positive Themes**: What do customers consistently compliment? Extract specific quotes.
- **Negative Themes**: What do customers consistently criticize? Extract specific quotes.
- For each negative theme, suggest how a competitor could exploit this weakness ("yourOpportunity").

**Task 3: Service-Specific Analysis**
For water damage related services (e.g., extraction, drying, mold, insurance help):
- Count positive vs negative mentions.
- Calculate net sentiment (positive - negative).

**Task 4: Customer Language Mining**
Extract frequently used terms/phrases from reviews:
- Emergency-related terms
- Service-specific terms
- Location terms
- Context for each term

**Task 5: Marketing Opportunities**
Based on their weaknesses, generate 5 marketing messages a competitor could use to position against them.

**Task 6: Response Pattern Analysis**
- What percentage of reviews get responses? (Estimate)
- Are responses templated or personalized?
- How quickly do they respond?

**Output:**
Return VALID JSON matching the following structure exactly. Do not use Markdown formatting (\`\`\`json).

{
  "overview": {
    "totalReviews": 0,
    "averageRating": 0.0,
    "fiveStarPercent": 0,
    "oneStarPercent": 0,
    "velocity": 0
  },
  "sentimentBreakdown": {
    "positive": 0,
    "neutral": 0,
    "negative": 0
  },
  "positiveThemes": [
    { "theme": "...", "frequency": 0, "exampleQuote": "..." }
  ],
  "negativeThemes": [
    { "theme": "...", "frequency": 0, "exampleQuote": "...", "yourOpportunity": "..." }
  ],
  "serviceMentions": [
    { "service": "...", "positive": 0, "negative": 0, "netSentiment": 0 }
  ],
  "customerKeywords": [
    { "term": "...", "frequency": 0, "context": "..." }
  ],
  "marketingAmmo": [
    "..."
  ],
  "responseAnalysis": {
    "responseRate": 0, // 0-100
    "avgResponseTime": "...",
    "quality": "personalized" // or "template" or "mixed"
  }
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
    return JSON.parse(cleanText) as ReviewAnalysis;

  } catch (error) {
    console.error("Review Analyzer Error:", error);
    throw error;
  }
};