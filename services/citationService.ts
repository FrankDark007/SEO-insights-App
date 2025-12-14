import { GoogleGenAI } from "@google/genai";
import { BusinessNAP, CitationAuditResult } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const auditCitations = async (
  businessInfo: BusinessNAP
): Promise<CitationAuditResult> => {
  try {
    const prompt = `
Audit business citations and NAP consistency across directories.
Business Information:
Name: ${businessInfo.name}
Address: ${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state} ${businessInfo.zip}
Phone: ${businessInfo.phone}
Website: ${businessInfo.website}

**Task 1: Search for Existing Citations**
Search for this business across these citation sources and check if listing exists.
Search aggressively using variations of the name and phone number if exact match not found initially.

Sources to check:
- Google Business Profile
- Yelp
- Facebook
- BBB
- Apple Maps
- Bing Places
- Angi
- HomeAdvisor
- Thumbtack
- Houzz
- Yellow Pages
- Superpages
- Citysearch
- Manta
- Brownbook
- Hotfrog
- Local Chamber of Commerce sites

**Task 2: Verify NAP Accuracy**
For each citation found, check if:
- Business name matches exactly
- Address matches (including formatting)
- Phone number matches
- Website URL matches

Note any discrepancies with exact values found.

**Task 3: Identify Missing Citations**
List important directories where the business is NOT listed. Prioritize by Domain Authority and Industry Relevance.

**Task 4: Catalog Variations**
Document all variations found:
- Name variations (e.g. LLC, The, spacing)
- Address variations (St vs Street, zip inclusion)
- Phone format variations

**Task 5: Generate Issues List**
For each mismatch, create an issue with impact analysis.

**Task 6: Calculate Health Scores**
- Accuracy: % of citations with correct NAP
- Coverage: % of priority directories with listings
- Consistency: % uniformity in NAP formatting
- Overall Health: Weighted average

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "healthScore": 85,
  "accuracy": 90,
  "coverage": 70,
  "consistency": 80,
  "summary": {
    "verified": 10,
    "hasIssues": 2,
    "missing": 5
  },
  "citations": [
    {
      "source": "Yelp",
      "sourceUrl": "yelp.com",
      "category": "primary",
      "domainAuthority": 94,
      "status": "has_issues",
      "nameMatch": true,
      "addressMatch": false,
      "phoneMatch": true,
      "websiteMatch": true,
      "foundName": "${businessInfo.name}",
      "foundAddress": "Wrong Address St",
      "foundPhone": "${businessInfo.phone}",
      "foundWebsite": "${businessInfo.website}",
      "listingUrl": "https://yelp.com/biz/...",
      "lastChecked": "${new Date().toISOString()}"
    }
  ],
  "issues": [
    {
      "source": "Yelp",
      "field": "address",
      "current": "Wrong Address St",
      "shouldBe": "${businessInfo.address}",
      "impact": "High - Confuses customers and lowers trust",
      "fixUrl": "https://biz.yelp.com/"
    }
  ],
  "missingCitations": [
    {
      "source": "BBB",
      "domainAuthority": 93,
      "priority": "critical",
      "category": "Trust",
      "buildUrl": "https://www.bbb.org/apply",
      "estimatedTime": "15 mins"
    }
  ],
  "variations": {
    "names": [{ "value": "${businessInfo.name}", "count": 5, "isPreferred": true }],
    "addresses": [{ "value": "${businessInfo.address}", "count": 4, "isPreferred": true }],
    "phones": [{ "value": "${businessInfo.phone}", "count": 6, "isPreferred": true }]
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

    return extractJSON(text) as CitationAuditResult;

  } catch (error) {
    console.error("Citation Audit Error:", error);
    throw error;
  }
};