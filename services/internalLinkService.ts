import { GoogleGenAI } from "@google/genai";
import { InternalLinkAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInternalLinks = async (
  domain: string,
  sitemapUrl?: string
): Promise<InternalLinkAnalysis> => {
  try {
    const prompt = `
Analyze internal linking structure for ${domain}.
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : 'No sitemap provided — discover pages via search.'}

**Task 1: Page Discovery**
Identify all indexable pages on ${domain}:
- Service pages
- Location pages
- Blog posts
- Other content pages

**Task 2: Link Mapping**
For each discovered page, estimate:
- Which internal pages likely link TO this page (based on typical navigation and content structure)
- Which internal pages this page links OUT to
- Click depth from homepage (Homepage = 0)

**Task 3: Find Orphan Pages**
Identify pages that likely have zero or very few internal links pointing to them.
For each orphan, suggest 2-3 pages that SHOULD link to it and appropriate anchor text.

**Task 4: Identify Link Opportunities**
Find pages that SHOULD link to each other but probably don't:
- Service pages → related location pages
- Blog posts → relevant service pages
- Location pages → nearby location pages
- Service pages → related service pages

**Task 5: Anchor Text Analysis**
For key service/location pages, analyze likely anchor text distribution.
- Flag over-optimization (same anchor >70%)
- Flag generic anchors ("click here", "read more")

**Task 6: Depth Analysis**
Calculate click depth for each page.
- Depth 1: Linked from Homepage
- Depth 2: Linked from Depth 1
- Flag pages at depth 4+ as needing shortcuts.

**Task 7: Silo Analysis**
Identify topic clusters/silos (e.g., Water Damage, Mold, Fire).
For each silo, check:
- Is hub page well-linked?
- Do spoke pages link back to hub?
- Are there cross-links between related spokes?

**Task 8: Generate Action Plan**
Create prioritized list of specific internal linking actions.

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "overview": {
    "totalPages": 0,
    "orphanPages": 0,
    "thinLinkPages": 0,
    "wellLinkedPages": 0,
    "avgLinksPerPage": 0,
    "maxDepth": 0
  },
  "pages": [
    {
      "url": "/water-damage",
      "title": "Water Damage Restoration",
      "internalLinksIn": 15,
      "internalLinksOut": 5,
      "depth": 1,
      "pageType": "service"
    }
  ],
  "orphans": [
    {
      "url": "/mold-testing-fairfax",
      "title": "Mold Testing Fairfax",
      "pageType": "location",
      "suggestedLinkSources": [
        { "sourceUrl": "/mold-services", "reason": "Parent service page", "suggestedAnchor": "Fairfax mold testing" }
      ]
    }
  ],
  "opportunities": [
    {
      "sourceUrl": "/blog/prevent-mold",
      "sourceTitle": "How to Prevent Mold",
      "targetUrl": "/mold-remediation",
      "targetTitle": "Mold Remediation Service",
      "suggestedAnchor": "professional mold remediation",
      "reason": "Topical relevance",
      "priority": "high"
    }
  ],
  "anchorAnalysis": [
    {
      "targetUrl": "/water-damage",
      "internalLinkCount": 15,
      "anchors": [ { "text": "water damage", "count": 10 } ],
      "issues": ["Over-optimized"],
      "recommendation": "Use more variations"
    }
  ],
  "depthDistribution": [
    { "depth": 1, "pageCount": 5, "pages": ["/services", "/about"] }
  ],
  "siloHealth": [
    {
      "siloName": "Water Damage",
      "hubPage": "/water-damage",
      "spokePages": ["/water-extraction", "/drying"],
      "crossLinkCount": 5,
      "health": "good",
      "recommendations": []
    }
  ],
  "actionPlan": [
    {
      "priority": 1,
      "type": "orphan_fix",
      "action": "Link to orphan page",
      "sourceUrl": "/services",
      "targetUrl": "/orphan-page",
      "anchor": "keyword"
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
    return JSON.parse(cleanText) as InternalLinkAnalysis;

  } catch (error) {
    console.error("Internal Link Analysis Error:", error);
    throw error;
  }
};