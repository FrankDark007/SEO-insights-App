import { GoogleGenAI } from "@google/genai";
import { BacklinkGapResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findBacklinkGap = async (
  yourDomain: string,
  competitorDomains: string[]
): Promise<BacklinkGapResult> => {
  try {
    const prompt = `
Analyze backlink profiles and find link gap opportunities.
Your Domain: ${yourDomain}
Competitor Domains: ${competitorDomains.join(', ')}

Perform a deep analysis using Google Search Grounding to identify backlink profiles.

**Task 1: Domain Metrics**
For each domain (including yours), estimate:
- Number of referring domains
- Total backlinks
- Domain authority score (0-100)

**Task 2: Identify Gap Opportunities**
Search for and identify domains that link to competitors but NOT to ${yourDomain}.
For each opportunity found, determine:
- Linking domain name
- Domain authority estimate
- Which competitors it links to
- Link type (directory, editorial, resource, partnership, news, forum)
- Acquisition difficulty:
  - Easy: Directories, listings, citations (just submit)
  - Medium: Requires outreach but achievable
  - Hard: Editorial, requires significant effort/newsworthiness
- The actual URL where the link appears (if findable)

**Task 3: Categorize Link Profiles**
For each domain, estimate the breakdown by link type percentage (directory, editorial, resource, partnership, forum, other).

**Task 4: Identify Quick Wins**
Filter for Easy acquisition opportunities:
- Local business directories
- Industry directories (IICRC, restoration associations)
- Chamber of commerce sites
- Review platforms
- Local citation sites

**Task 5: Identify High-Value Targets**
Filter for high-DA (50+) opportunities worth pursuing:
- Local news sites
- Industry publications
- Resource pages
- Insurance company resource pages

**Task 6: Find Common Sources**
Identify domains linking to 2 or more competitors — these are highest priority.

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "overview": [
    { "domain": "${yourDomain}", "referringDomains": 100, "totalBacklinks": 500, "domainAuthority": 30, "isYou": true },
    { "domain": "competitor1.com", "referringDomains": 150, "totalBacklinks": 800, "domainAuthority": 45, "isYou": false }
    // ... others
  ],
  "gapOpportunities": [
    {
      "linkingDomain": "example-directory.com",
      "domainAuthority": 40,
      "linksTo": ["competitor1.com"],
      "linkType": "directory",
      "acquisitionDifficulty": "easy",
      "linkUrl": "https://example-directory.com/category/restoration",
      "anchorTextUsed": "Best Restoration"
    }
    // ... include at least 10 diverse opportunities
  ],
  "linkTypeBreakdown": [
    { 
       "domain": "${yourDomain}", 
       "directory": 40, 
       "editorial": 20, 
       "resource": 10, 
       "partnership": 10, 
       "forum": 10, 
       "other": 10 
    }
    // ... for competitors
  ],
  "quickWins": [
     // Subset of gapOpportunities that are 'easy'
  ],
  "highValueTargets": [
     // Subset of gapOpportunities that are High DA
  ],
  "commonSources": [
    {
       "domain": "common-source.com",
       "domainAuthority": 60,
       "competitorCount": 2,
       "youHave": false,
       "priority": "critical"
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
    return JSON.parse(cleanText) as BacklinkGapResult;

  } catch (error) {
    console.error("Backlink Gap Error:", error);
    throw error;
  }
};