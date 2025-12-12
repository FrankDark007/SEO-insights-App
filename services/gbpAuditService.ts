import { GoogleGenAI } from "@google/genai";
import { GBPAuditResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runGBPAudit = async (
  businessName: string,
  keyword: string,
  location: string
): Promise<GBPAuditResult> => {
  try {
    const prompt = `
You are a Local SEO Expert specializing in Google Business Profile (GBP) optimization.

**Task:**
Analyze the Google Map Pack and Google Business Profiles for this search:
- Search Query: "${keyword} ${location}"
- Target Business (You): "${businessName}"

**Steps:**

1. **Map Pack Analysis**:
   - Use Google Search to identify the top 3 businesses in the Local Map Pack for the search query.
   - Also find the "Target Business" in the results if visible.
   - For each, extract: Name, Star Rating, Review Count, Primary Category, Response Rate (estimate if visible, otherwise null).

2. **Profile Comparison**:
   - Compare "Target Business" vs Top 3 Competitors on:
     - Categories (Primary & Secondary)
     - Estimated Photo Count
     - Service List Completeness (estimate count)
     - Q&A Count
     - Posts frequency (estimate)
     - Description completeness (character count estimate)

3. **Review Analysis**:
   - Compare Total Reviews, Average Rating.
   - Estimate "Review Velocity" (reviews per month based on recent dates).
   - Estimate Response Rate/Time.

4. **Keyword Optimization**:
   - Check if keywords ("${keyword}", "emergency", "24 hour", "${location}") appear in:
     - Business Name
     - Description
     - Services List
     - Recent Posts

5. **Action Plan**:
   - Generate specific, prioritized action items to close the gap.

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "mapPackSnapshot": [
    {
      "rank": 1,
      "businessName": "Competitor 1",
      "rating": 4.9,
      "reviewCount": 150,
      "responseRate": 95,
      "primaryCategory": "Water Damage Restoration Service",
      "isYou": false
    },
    ... (Top 3 plus You if found)
  ],
  "yourPosition": 4, // or null if not found
  "categoryComparison": {
    "you": { "primary": "...", "secondary": ["..."] },
    "competitors": [{ "primary": "...", "secondary": ["..."] }],
    "recommended": ["Mold Remediation", "Building Restoration"]
  },
  "profileCompleteness": [
    { "metric": "Photos", "you": 10, "competitorAvg": 45, "leader": 60, "max": 100, "unit": "count" },
    { "metric": "Description", "you": 300, "competitorAvg": 700, "leader": 750, "max": 750, "unit": "chars" },
    { "metric": "Services Listed", "you": 5, "competitorAvg": 15, "leader": 20, "max": 20, "unit": "count" },
    { "metric": "Q&A Answered", "you": 0, "competitorAvg": 5, "leader": 10, "max": 10, "unit": "count" }
  ],
  "reviewAnalysis": {
    "totalReviews": { "you": 20, "avg": 100, "gap": -80 },
    "avgRating": { "you": 4.5, "avg": 4.9, "gap": -0.4 },
    "velocity": { "you": 1, "avg": 5, "gap": -4 },
    "responseRate": { "you": 50, "avg": 90, "gap": -40 }
  },
  "reviewHistory": [
    // Estimate last 6 months based on available data
    { "month": "Month 1", "you": 1, "competitorAvg": 4 },
    { "month": "Month 2", "you": 0, "competitorAvg": 5 }
    ... (6 entries)
  ],
  "keywordPresence": [
    { "keyword": "${keyword}", "inName": false, "inDescription": true, "inServices": true, "inPosts": false },
    { "keyword": "emergency", "inName": false, "inDescription": false, "inServices": true, "inPosts": false },
    { "keyword": "24 hour", "inName": false, "inDescription": true, "inServices": false, "inPosts": false },
    { "keyword": "${location}", "inName": true, "inDescription": true, "inServices": true, "inPosts": true }
  ],
  "actionItems": [
    { "priority": "high", "action": "Add secondary category 'Mold Remediation'", "reason": "All top 3 competitors have it", "impact": "High visibility boost" }
  ],
  "quickWins": ["Reply to last 3 reviews", "Add 5 photos of equipment"]
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
    return JSON.parse(cleanText) as GBPAuditResult;

  } catch (error) {
    console.error("GBP Audit Error:", error);
    throw error;
  }
};