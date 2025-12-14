import { GoogleGenAI } from "@google/genai";
import { LinkAttributeAuditResult } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const auditLinkAttributes = async (
  domain: string
): Promise<LinkAttributeAuditResult> => {
  try {
    const prompt = `You are an expert SEO link auditor. Perform a comprehensive backlink attribute audit for: ${domain}

Use Google Search to research:
1. Backlinks pointing to ${domain}
2. Link attributes and anchor text patterns
3. Referring domain quality signals
4. Any known toxic or spammy links
5. Industry benchmarks for healthy link profiles

AUDIT COMPONENTS:

1. BACKLINK INVENTORY
For each significant backlink found, analyze:
- Source URL and domain
- Anchor text and anchor type classification
- Link attributes (rel="nofollow", rel="ugc", rel="sponsored", or dofollow)
- Link placement (in-content, sidebar, footer, comment, etc.)
- Context snippet around the link
- Domain/page authority estimates
- Spam score indicators
- Topical relevance to water damage restoration
- Quality score (0-100)
- Issues identified
- Recommendation (keep/monitor/disavow/fix)

2. ANCHOR TEXT ANALYSIS
- Distribution by type (exact match, partial match, branded, naked URL, generic)
- Over-optimization signals
- Healthy vs problematic ratios
- Specific recommendations

3. LINK PLACEMENT ANALYSIS
- Distribution by placement type
- In-content ratio (should be >50%)
- Quality correlation by placement

4. TOXIC LINK REPORT
- Identify potentially harmful links
- Spam signals detected
- Generate disavow file content
- Risk level assessment

5. LINK VELOCITY
- Monthly new/lost link trends
- Unusual patterns

6. HEALTH SCORE
- Overall score with component breakdown
- Benchmarking against healthy profiles

Return ONLY valid JSON matching this structure:
{
  "auditedAt": "ISO date string",
  "domain": "${domain}",
  "totalBacklinks": 450,
  "totalReferringDomains": 85,
  "backlinks": [
    {
      "sourceUrl": "https://example.com/water-damage-tips",
      "sourceDomain": "example.com",
      "targetUrl": "https://${domain}/services",
      "anchorText": "water damage restoration",
      "anchorType": "exact-match",
      "attributes": {
        "rel": ["dofollow"],
        "isDofollow": true,
        "isNofollow": false,
        "isUGC": false,
        "isSponsored": false
      },
      "placement": "in-content",
      "contextSnippet": "...when dealing with flooding, contact a professional water damage restoration company immediately...",
      "domainAuthority": 45,
      "pageAuthority": 32,
      "spamScore": 5,
      "topicalRelevance": "high",
      "linkAge": "8 months",
      "isLive": true,
      "trafficEstimate": 500,
      "qualityScore": 82,
      "issues": [],
      "recommendation": "keep"
    },
    {
      "sourceUrl": "https://spammysite.com/links",
      "sourceDomain": "spammysite.com",
      "targetUrl": "https://${domain}",
      "anchorText": "cheap water damage",
      "anchorType": "partial-match",
      "attributes": {
        "rel": ["nofollow"],
        "isDofollow": false,
        "isNofollow": true,
        "isUGC": false,
        "isSponsored": false
      },
      "placement": "footer",
      "contextSnippet": "Links: cheap water damage | cheap plumber | cheap electrician",
      "domainAuthority": 8,
      "pageAuthority": 5,
      "spamScore": 85,
      "topicalRelevance": "low",
      "linkAge": "2 months",
      "isLive": true,
      "trafficEstimate": 0,
      "qualityScore": 12,
      "issues": ["High spam score", "Footer link farm", "Low relevance", "Suspicious anchor"],
      "recommendation": "disavow"
    }
  ],
  "anchorAnalysis": {
    "distribution": [
      {
        "type": "branded",
        "count": 45,
        "percentage": 35,
        "examples": ["Flood Doctor", "FloodDoctorVA", "Flood Doctor VA"],
        "status": "healthy"
      },
      {
        "type": "exact-match",
        "count": 28,
        "percentage": 22,
        "examples": ["water damage restoration", "water damage restoration arlington"],
        "status": "warning"
      },
      {
        "type": "partial-match",
        "count": 18,
        "percentage": 14,
        "examples": ["restoration services", "water damage company"],
        "status": "healthy"
      },
      {
        "type": "naked-url",
        "count": 20,
        "percentage": 16,
        "examples": ["flooddoctorva.com", "https://flooddoctorva.com"],
        "status": "healthy"
      },
      {
        "type": "generic",
        "count": 12,
        "percentage": 9,
        "examples": ["click here", "learn more", "visit website"],
        "status": "healthy"
      },
      {
        "type": "image",
        "count": 5,
        "percentage": 4,
        "examples": ["[image]", "[logo]"],
        "status": "healthy"
      }
    ],
    "overOptimized": false,
    "brandedRatio": 35,
    "exactMatchRatio": 22,
    "recommendations": [
      "Exact match anchor ratio (22%) is slightly high - aim to keep below 20%",
      "Consider building more branded and natural anchors",
      "Diversify with more partial match and generic anchors"
    ]
  },
  "placementAnalysis": {
    "distribution": [
      {
        "placement": "in-content",
        "count": 65,
        "percentage": 51,
        "avgQuality": 72
      },
      {
        "placement": "directory",
        "count": 25,
        "percentage": 20,
        "avgQuality": 58
      },
      {
        "placement": "footer",
        "count": 15,
        "percentage": 12,
        "avgQuality": 35
      },
      {
        "placement": "sidebar",
        "count": 10,
        "percentage": 8,
        "avgQuality": 45
      },
      {
        "placement": "comment",
        "count": 8,
        "percentage": 6,
        "avgQuality": 22
      },
      {
        "placement": "author-bio",
        "count": 5,
        "percentage": 4,
        "avgQuality": 65
      }
    ],
    "inContentRatio": 51,
    "recommendations": [
      "In-content ratio (51%) is acceptable but could be improved",
      "Focus future link building on editorial/in-content placements",
      "Consider removing or disavowing low-quality footer links"
    ]
  },
  "toxicReport": {
    "totalToxicLinks": 12,
    "toxicDomains": [
      {
        "domain": "spammylinks.com",
        "linkCount": 3,
        "spamScore": 92,
        "toxicSignals": ["Link farm", "Unnatural anchor text pattern", "No real content"],
        "recommendation": "Add to disavow file immediately"
      },
      {
        "domain": "cheapdirectory.net",
        "linkCount": 2,
        "spamScore": 78,
        "toxicSignals": ["Paid link directory", "Excessive outbound links"],
        "recommendation": "Disavow domain"
      }
    ],
    "disavowFileContent": "# Disavow file for ${domain}\\n# Generated by Link Attribute Auditor\\n# Date: [current date]\\n\\n# Spam/Link Farm Sites\\ndomain:spammylinks.com\\ndomain:cheapdirectory.net\\ndomain:linkfarm123.com\\n\\n# Individual toxic URLs\\nhttps://example.com/spammy-page",
    "riskLevel": "medium"
  },
  "linkVelocity": [
    { "month": "2024-07", "newLinks": 12, "lostLinks": 3, "netGain": 9 },
    { "month": "2024-08", "newLinks": 15, "lostLinks": 5, "netGain": 10 },
    { "month": "2024-09", "newLinks": 8, "lostLinks": 4, "netGain": 4 },
    { "month": "2024-10", "newLinks": 18, "lostLinks": 2, "netGain": 16 },
    { "month": "2024-11", "newLinks": 11, "lostLinks": 6, "netGain": 5 },
    { "month": "2024-12", "newLinks": 14, "lostLinks": 3, "netGain": 11 }
  ],
  "healthScore": {
    "overall": 68,
    "components": [
      {
        "name": "Anchor Diversity",
        "score": 72,
        "weight": 20,
        "status": "warning",
        "description": "Exact match anchors slightly over-represented"
      },
      {
        "name": "Link Quality",
        "score": 65,
        "weight": 25,
        "status": "warning",
        "description": "Average referring domain authority is moderate"
      },
      {
        "name": "Toxic Links",
        "score": 78,
        "weight": 20,
        "status": "good",
        "description": "Relatively few toxic links detected"
      },
      {
        "name": "Placement Quality",
        "score": 62,
        "weight": 15,
        "status": "warning",
        "description": "In-content ratio could be higher"
      },
      {
        "name": "Link Velocity",
        "score": 85,
        "weight": 10,
        "status": "good",
        "description": "Steady, natural link acquisition pattern"
      },
      {
        "name": "Topical Relevance",
        "score": 70,
        "weight": 10,
        "status": "good",
        "description": "Most links from relevant sources"
      }
    ]
  },
  "attributeBreakdown": {
    "dofollow": 72,
    "nofollow": 23,
    "ugc": 3,
    "sponsored": 2
  },
  "domainAuthorityDistribution": [
    { "range": "0-10", "count": 15, "percentage": 12 },
    { "range": "11-20", "count": 22, "percentage": 17 },
    { "range": "21-30", "count": 28, "percentage": 22 },
    { "range": "31-40", "count": 25, "percentage": 20 },
    { "range": "41-50", "count": 18, "percentage": 14 },
    { "range": "51-60", "count": 12, "percentage": 9 },
    { "range": "61-70", "count": 5, "percentage": 4 },
    { "range": "71+", "count": 3, "percentage": 2 }
  ],
  "topIssues": [
    {
      "issue": "High spam score links",
      "severity": "high",
      "affectedLinks": 12,
      "recommendation": "Add identified toxic domains to disavow file"
    },
    {
      "issue": "Exact match anchor over-optimization",
      "severity": "medium",
      "affectedLinks": 28,
      "recommendation": "Focus new link building on branded and natural anchors"
    },
    {
      "issue": "Low in-content link ratio",
      "severity": "medium",
      "affectedLinks": 63,
      "recommendation": "Prioritize editorial placements for future links"
    },
    {
      "issue": "Footer link farm patterns",
      "severity": "medium",
      "affectedLinks": 8,
      "recommendation": "Request removal or disavow footer link farm sites"
    }
  ],
  "actionItems": [
    {
      "priority": 1,
      "action": "Submit disavow file to Google Search Console",
      "impact": "Removes toxic link signals from your profile",
      "effort": "low",
      "linksAffected": 12
    },
    {
      "priority": 2,
      "action": "Contact webmasters to remove low-quality footer links",
      "impact": "Improves link placement distribution",
      "effort": "medium",
      "linksAffected": 8
    },
    {
      "priority": 3,
      "action": "Build 10-15 branded anchor links from local sources",
      "impact": "Improves anchor diversity ratio",
      "effort": "medium",
      "linksAffected": 0
    },
    {
      "priority": 4,
      "action": "Pursue guest posting for in-content editorial links",
      "impact": "Increases in-content link percentage",
      "effort": "high",
      "linksAffected": 0
    }
  ],
  "summary": {
    "healthStatus": "needs-attention",
    "biggestIssue": "12 toxic/spammy links need to be disavowed",
    "topPriority": "Submit disavow file to protect against algorithmic penalties",
    "quickWin": "Disavow toxic domains - low effort, immediate protection"
  }
}

IMPORTANT:
- Be thorough in identifying link quality signals
- Classify anchors accurately (exact match = contains primary keyword exactly)
- Identify real toxic link patterns (not just low DA)
- Provide actionable disavow file content
- Score components should sum to reasonable overall score
- Focus on realistic issues for a local service business`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return extractJSON(text) as LinkAttributeAuditResult;
  } catch (error) {
    console.error("Link Attribute Audit Error:", error);
    throw error;
  }
};
