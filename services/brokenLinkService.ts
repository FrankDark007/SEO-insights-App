import { GoogleGenAI } from "@google/genai";
import { BrokenLinkAuditResult } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runBrokenLinkAudit = async (
  domain: string,
  competitors: string[] = [],
  citationPlatforms: string[] = []
): Promise<BrokenLinkAuditResult> => {
  try {
    const competitorList = competitors.length > 0 
      ? `Competitors to check for broken link opportunities: ${competitors.join(", ")}` 
      : "";
    
    const citationList = citationPlatforms.length > 0
      ? `Citation platforms to audit: ${citationPlatforms.join(", ")}`
      : "Check common citation platforms: Google Business Profile, Yelp, BBB, Angi, HomeAdvisor, Thumbtack, Facebook";

    const prompt = `You are an expert SEO analyst specializing in technical SEO and link building. Perform a comprehensive broken link audit for: ${domain}

${competitorList}
${citationList}

Use Google Search to research and identify:

1. BROKEN INTERNAL LINKS
- Pages on ${domain} that return 404 errors
- Internal links pointing to non-existent pages
- Links with typos or incorrect URLs

2. BROKEN EXTERNAL LINKS
- Outbound links from ${domain} to external sites that are broken
- Links to pages that have moved or been deleted

3. REDIRECT CHAINS
- URLs that redirect multiple times before reaching destination
- Redirect loops
- Temporary redirects (302) that should be permanent (301)

4. ORPHAN PAGES
- Pages with no internal links pointing to them
- Valuable content that's not connected to site navigation

5. LINK BUILDING OPPORTUNITIES (from competitors)
- Broken pages on competitor sites that have backlinks
- Topics where competitors have dead content you could create
- Resource pages linking to broken URLs in your industry

6. CITATION ISSUES
- Business listings with broken website links
- Inconsistent URLs across citation platforms
- Missing website links on important directories

Return ONLY valid JSON matching this structure:
{
  "scanDate": "ISO date string",
  "domain": "${domain}",
  "summary": {
    "totalLinksChecked": 150,
    "brokenInternalLinks": 5,
    "brokenExternalLinks": 8,
    "redirectChains": 3,
    "orphanPages": 2,
    "linkBuildingOpportunities": 6,
    "citationIssues": 4,
    "healthScore": 78
  },
  "brokenLinks": [
    {
      "url": "https://example.com/broken-page",
      "sourceUrl": "https://${domain}/services",
      "anchorText": "Learn more about our services",
      "statusCode": 404,
      "type": "internal",
      "severity": "critical",
      "lastWorking": "2024-06-15",
      "suggestedFix": "Update link to point to /water-damage-services or remove the link"
    }
  ],
  "redirectChains": [
    {
      "originalUrl": "https://${domain}/old-page",
      "hops": ["https://${domain}/old-page", "https://${domain}/temp-page", "https://${domain}/final-page"],
      "finalUrl": "https://${domain}/final-page",
      "totalHops": 3,
      "issue": "3-hop redirect chain wastes crawl budget and link equity",
      "fix": "Update original URL to redirect directly to final destination"
    }
  ],
  "orphanPages": [
    {
      "url": "https://${domain}/hidden-service-page",
      "title": "Emergency Flood Response Service",
      "hasContent": true,
      "lastCrawled": "2024-08-01",
      "recommendation": "Add internal links from main services page and footer navigation"
    }
  ],
  "linkBuildingOpportunities": [
    {
      "competitorUrl": "https://competitor.com/old-resource",
      "brokenUrl": "https://competitor.com/water-damage-guide",
      "originalTopic": "Complete guide to water damage restoration",
      "linkingPages": 15,
      "domainAuthority": 45,
      "yourReplacementUrl": null,
      "suggestedContent": "Create comprehensive water damage restoration guide to capture these links",
      "outreachTemplate": "Hi [Name],\\n\\nI noticed your page [URL] links to a resource about water damage restoration that's no longer available. I recently published a comprehensive guide on this topic that might be a good replacement: [Your URL]\\n\\nWould you consider updating the link?\\n\\nBest regards",
      "priority": "high"
    }
  ],
  "citationIssues": [
    {
      "platform": "Yelp",
      "profileUrl": "https://yelp.com/biz/your-business",
      "issue": "wrong_url",
      "currentValue": "http://oldwebsite.com",
      "expectedValue": "https://${domain}",
      "impact": "high",
      "howToFix": "Log into Yelp Business and update website URL in business information"
    }
  ],
  "priorityActions": {
    "immediate": [
      "Fix 5 broken internal links on main service pages - causing 404 errors for users",
      "Update Yelp and BBB listings with correct website URL"
    ],
    "thisWeek": [
      "Resolve 3 redirect chains to improve crawl efficiency",
      "Add internal links to 2 orphan pages with valuable content"
    ],
    "thisMonth": [
      "Create replacement content for competitor broken link opportunity (15 potential backlinks)",
      "Audit and fix all 8 broken external links"
    ]
  }
}

Be thorough and realistic. For a typical local service business website, expect to find:
- 3-10 broken internal links
- 5-15 broken external links
- 1-5 redirect chains
- 1-3 orphan pages
- 3-8 link building opportunities from competitors
- 2-6 citation issues

Focus on actionable findings that will improve SEO and user experience.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return extractJSON(text) as BrokenLinkAuditResult;
  } catch (error) {
    console.error("Broken Link Audit Error:", error);
    throw error;
  }
};