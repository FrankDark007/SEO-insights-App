import { GoogleGenAI } from "@google/genai";
import { SEOHealthMonitorResult } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface MonitorConfig {
  domain: string;
  competitors: string[];
  targetKeywords: string[];
  alertThresholds: {
    rankingDropAlert: number;
    trafficDropAlert: number;
    newCompetitorAlert: boolean;
  };
}

export const runSEOHealthMonitor = async (
  config: MonitorConfig
): Promise<SEOHealthMonitorResult> => {
  try {
    const competitorList = config.competitors.join(", ");
    const keywordList = config.targetKeywords.join(", ");

    const prompt = `You are an expert SEO monitoring system. Perform a comprehensive health check for: ${config.domain}

MONITORING CONFIGURATION:
- Domain: ${config.domain}
- Competitors: ${competitorList}
- Target Keywords: ${keywordList}
- Alert on ranking drops greater than: ${config.alertThresholds.rankingDropAlert} positions
- Alert on traffic drops greater than: ${config.alertThresholds.trafficDropAlert}%
- Alert on new competitor activity: ${config.alertThresholds.newCompetitorAlert}

Use Google Search to research:
1. Current rankings for all target keywords
2. Competitor rankings and recent changes
3. Any recent content or technical changes detected
4. Backlink profile changes
5. Industry news or algorithm updates that may affect rankings

GENERATE A COMPREHENSIVE HEALTH REPORT INCLUDING:

1. ALERTS
Generate realistic alerts based on what you find:
- Ranking changes (gains and drops)
- New competitor movements
- Content opportunities
- Technical issues detected
- Backlink changes

2. RANKING SNAPSHOTS
For each target keyword:
- Current rank
- Previous rank (estimate 7 days ago)
- Change and trend
- Competitor positions

3. TRAFFIC METRICS (estimates based on rankings)
- Estimated organic sessions
- Top performing pages
- Top keywords by clicks

4. BACKLINK HEALTH
- Estimated totals
- Recent gains/losses
- Toxic link warnings

5. TECHNICAL HEALTH
- Core Web Vitals estimates
- Common issues for local service sites
- Indexation status

6. COMPETITOR MOVEMENTS
For each competitor:
- Recent changes detected
- Keywords they're gaining/losing
- Threat level assessment

7. ACTION CHECKLIST
Prioritized list of actions based on all findings:
- Critical items first
- Include specific steps
- Estimated impact and effort

8. WEEKLY DIGEST
Summary of the week's SEO performance

Return ONLY valid JSON matching this structure:
{
  "monitoredAt": "ISO date string",
  "domain": "${config.domain}",
  "overallHealthScore": 72,
  "healthTrend": "stable",
  "alerts": [
    {
      "id": "alert-001",
      "timestamp": "ISO date string",
      "type": "ranking_drop",
      "severity": "warning",
      "title": "Ranking drop for 'water damage restoration arlington va'",
      "description": "Your ranking dropped from position 5 to position 8 for this high-value keyword",
      "metric": "Keyword Ranking",
      "previousValue": 5,
      "currentValue": 8,
      "change": "-3 positions",
      "affectedKeywords": ["water damage restoration arlington va"],
      "affectedPages": ["https://${config.domain}/arlington-va"],
      "recommendedAction": "Review page content and check if competitors have updated their pages. Consider adding FAQ schema and expanding content.",
      "actionUrl": "https://${config.domain}/arlington-va",
      "isRead": false,
      "isActioned": false
    },
    {
      "id": "alert-002",
      "timestamp": "ISO date string",
      "type": "competitor_action",
      "severity": "info",
      "title": "SERVPRO published new content targeting your keywords",
      "description": "Competitor added a new page targeting 'emergency water damage fairfax'",
      "metric": "Competitor Content",
      "previousValue": "N/A",
      "currentValue": "New page published",
      "change": "New threat",
      "affectedKeywords": ["emergency water damage fairfax"],
      "recommendedAction": "Review competitor's new content and consider creating or improving your Fairfax landing page",
      "isRead": false,
      "isActioned": false
    },
    {
      "id": "alert-003",
      "timestamp": "ISO date string",
      "type": "opportunity",
      "severity": "success",
      "title": "New ranking opportunity detected",
      "description": "You're ranking #11 for 'basement flooding alexandria va' - close to page 1",
      "metric": "Ranking Opportunity",
      "previousValue": 15,
      "currentValue": 11,
      "change": "+4 positions",
      "affectedKeywords": ["basement flooding alexandria va"],
      "recommendedAction": "This keyword is within striking distance of page 1. Add internal links and expand content to push into top 10.",
      "isRead": false,
      "isActioned": false
    },
    {
      "id": "alert-004",
      "timestamp": "ISO date string",
      "type": "new_backlink",
      "severity": "success",
      "title": "New high-authority backlink acquired",
      "description": "Earned a dofollow link from arlingtonchamber.org (DA 45)",
      "metric": "Backlinks",
      "previousValue": 84,
      "currentValue": 85,
      "change": "+1 quality link",
      "recommendedAction": "Great acquisition! Consider reaching out to other local chambers for similar opportunities.",
      "isRead": false,
      "isActioned": false
    }
  ],
  "rankings": [
    {
      "keyword": "water damage restoration arlington va",
      "currentRank": 8,
      "previousRank": 5,
      "change": -3,
      "trend": "down",
      "url": "https://${config.domain}/arlington-va",
      "searchVolume": 320,
      "competitors": [
        { "domain": "servpro.com", "rank": 1, "change": 0 },
        { "domain": "servicemaster.com", "rank": 3, "change": 1 },
        { "domain": "puroclean.com", "rank": 6, "change": -2 }
      ]
    },
    {
      "keyword": "flood cleanup fairfax va",
      "currentRank": 4,
      "previousRank": 4,
      "change": 0,
      "trend": "stable",
      "url": "https://${config.domain}/fairfax-va",
      "searchVolume": 210,
      "competitors": [
        { "domain": "servpro.com", "rank": 1, "change": 0 },
        { "domain": "belfor.com", "rank": 2, "change": 0 },
        { "domain": "servicemaster.com", "rank": 5, "change": -1 }
      ]
    },
    {
      "keyword": "emergency water removal near me",
      "currentRank": 12,
      "previousRank": 15,
      "change": 3,
      "trend": "up",
      "url": "https://${config.domain}/emergency-services",
      "searchVolume": 480,
      "competitors": [
        { "domain": "servpro.com", "rank": 1, "change": 0 },
        { "domain": "servicemaster.com", "rank": 2, "change": 0 }
      ]
    },
    {
      "keyword": "mold remediation mclean va",
      "currentRank": 6,
      "previousRank": 8,
      "change": 2,
      "trend": "up",
      "url": "https://${config.domain}/mold-remediation",
      "searchVolume": 140,
      "competitors": [
        { "domain": "servpro.com", "rank": 2, "change": 0 },
        { "domain": "puroclean.com", "rank": 4, "change": -1 }
      ]
    }
  ],
  "traffic": {
    "period": "Last 7 days",
    "organicSessions": 1250,
    "previousPeriod": 1180,
    "change": 70,
    "changePercent": 5.9,
    "topPages": [
      { "url": "/", "sessions": 320, "change": 15 },
      { "url": "/arlington-va", "sessions": 180, "change": -25 },
      { "url": "/fairfax-va", "sessions": 145, "change": 20 },
      { "url": "/emergency-services", "sessions": 120, "change": 35 }
    ],
    "topKeywords": [
      { "keyword": "flood doctor", "clicks": 85, "impressions": 450, "ctr": 18.9, "position": 1.2 },
      { "keyword": "water damage restoration arlington", "clicks": 42, "impressions": 380, "ctr": 11.1, "position": 7.5 },
      { "keyword": "flood cleanup fairfax", "clicks": 38, "impressions": 290, "ctr": 13.1, "position": 4.2 }
    ]
  },
  "backlinks": {
    "totalBacklinks": 450,
    "newLast7Days": 5,
    "lostLast7Days": 2,
    "toxicLinks": 12,
    "avgDomainAuthority": 28,
    "topNewLinks": [
      { "domain": "arlingtonchamber.org", "da": 45, "anchor": "Flood Doctor", "date": "2024-12-10" },
      { "domain": "novahomerepair.com", "da": 32, "anchor": "water damage experts", "date": "2024-12-08" }
    ],
    "recentlyLost": [
      { "domain": "oldsite.com", "da": 15, "reason": "Page removed", "date": "2024-12-09" }
    ]
  },
  "technical": {
    "overallScore": 78,
    "issues": [
      { "category": "Performance", "severity": "warning", "count": 3, "description": "3 pages have LCP > 2.5s" },
      { "category": "Mobile", "severity": "info", "count": 5, "description": "5 pages have tap targets too close" },
      { "category": "Schema", "severity": "warning", "count": 8, "description": "8 service pages missing LocalBusiness schema" }
    ],
    "coreWebVitals": {
      "lcp": { "value": 2.3, "status": "needs-improvement" },
      "fid": { "value": 45, "status": "good" },
      "cls": { "value": 0.08, "status": "good" }
    },
    "indexationStatus": {
      "indexed": 45,
      "notIndexed": 3,
      "pending": 2
    },
    "crawlErrors": 2
  },
  "competitors": [
    {
      "domain": "servpro.com",
      "changes": [
        { "type": "new_content", "description": "Published new Fairfax emergency services page", "impact": "high", "date": "2024-12-11" },
        { "type": "ranking_change", "description": "Gained position for 'water damage restoration arlington va'", "impact": "high", "date": "2024-12-10" }
      ],
      "threatLevel": "high",
      "keywordsGained": ["water damage restoration arlington va"],
      "keywordsLost": []
    },
    {
      "domain": "servicemaster.com",
      "changes": [
        { "type": "new_backlinks", "description": "Acquired 3 new local citations", "impact": "medium", "date": "2024-12-09" }
      ],
      "threatLevel": "medium",
      "keywordsGained": [],
      "keywordsLost": ["emergency flood cleanup fairfax"]
    },
    {
      "domain": "puroclean.com",
      "changes": [],
      "threatLevel": "low",
      "keywordsGained": [],
      "keywordsLost": ["mold remediation mclean va"]
    }
  ],
  "actionChecklist": [
    {
      "id": "action-001",
      "priority": "critical",
      "category": "content",
      "title": "Recover Arlington VA ranking",
      "description": "Ranking dropped 3 positions for high-value keyword. Needs immediate attention.",
      "estimatedImpact": "Could recover 25+ monthly visits",
      "estimatedEffort": "4-6 hours",
      "dueDate": "2024-12-15",
      "relatedAlerts": ["alert-001"],
      "steps": [
        "Analyze SERVPRO's Arlington page that outranks you",
        "Add FAQ section with 8-10 questions",
        "Implement FAQPage schema markup",
        "Add before/after image gallery",
        "Expand content from 1,200 to 2,000+ words",
        "Add internal links from homepage and service pages"
      ],
      "isCompleted": false
    },
    {
      "id": "action-002",
      "priority": "high",
      "category": "content",
      "title": "Push Alexandria keyword to page 1",
      "description": "Currently #11 for 'basement flooding alexandria va' - close to breaking into top 10",
      "estimatedImpact": "New keyword on page 1 = 30+ monthly visits",
      "estimatedEffort": "3-4 hours",
      "dueDate": "2024-12-18",
      "relatedAlerts": ["alert-003"],
      "steps": [
        "Add 3-5 internal links to Alexandria page",
        "Expand basement flooding section with more detail",
        "Add customer testimonial from Alexandria job",
        "Create supporting blog post about basement flooding causes"
      ],
      "isCompleted": false
    },
    {
      "id": "action-003",
      "priority": "high",
      "category": "technical",
      "title": "Add LocalBusiness schema to service pages",
      "description": "8 service pages missing structured data that helps with local rankings",
      "estimatedImpact": "Improved rich snippet eligibility",
      "estimatedEffort": "2-3 hours",
      "dueDate": "2024-12-16",
      "relatedAlerts": [],
      "steps": [
        "Generate LocalBusiness JSON-LD for each city page",
        "Include NAP, hours, service area, and reviews",
        "Test with Google Rich Results Test",
        "Submit updated pages to Search Console"
      ],
      "isCompleted": false
    },
    {
      "id": "action-004",
      "priority": "medium",
      "category": "links",
      "title": "Submit disavow file for toxic links",
      "description": "12 toxic backlinks identified that could be hurting rankings",
      "estimatedImpact": "Removes negative link signals",
      "estimatedEffort": "30 minutes",
      "dueDate": "2024-12-17",
      "relatedAlerts": [],
      "steps": [
        "Export toxic link list from Link Auditor",
        "Format as disavow file",
        "Submit to Google Search Console",
        "Document submission date"
      ],
      "isCompleted": false
    },
    {
      "id": "action-005",
      "priority": "medium",
      "category": "competitor-response",
      "title": "Counter SERVPRO's new Fairfax content",
      "description": "Competitor published new page targeting your Fairfax market",
      "estimatedImpact": "Protect Fairfax market share",
      "estimatedEffort": "5-6 hours",
      "dueDate": "2024-12-20",
      "relatedAlerts": ["alert-002"],
      "steps": [
        "Analyze SERVPRO's new Fairfax page structure",
        "Identify content gaps in your Fairfax page",
        "Add unique local content (landmarks, neighborhoods)",
        "Build 2-3 local backlinks to Fairfax page",
        "Create Fairfax-specific testimonial video"
      ],
      "isCompleted": false
    },
    {
      "id": "action-006",
      "priority": "low",
      "category": "technical",
      "title": "Improve LCP on 3 slow pages",
      "description": "Core Web Vitals showing needs improvement for LCP",
      "estimatedImpact": "Better user experience and potential ranking boost",
      "estimatedEffort": "2-4 hours",
      "dueDate": "2024-12-22",
      "relatedAlerts": [],
      "steps": [
        "Identify largest contentful paint elements",
        "Optimize hero images (WebP, lazy loading)",
        "Preload critical fonts",
        "Review server response times"
      ],
      "isCompleted": false
    }
  ],
  "weeklyDigest": {
    "weekOf": "2024-12-09",
    "overallHealthChange": -2,
    "highlights": [
      "Gained 4 positions for 'emergency water removal near me'",
      "Acquired quality backlink from Arlington Chamber (DA 45)",
      "Organic traffic up 5.9% week-over-week",
      "Mold remediation keyword improved to position 6"
    ],
    "concerns": [
      "Lost 3 positions for primary Arlington keyword",
      "SERVPRO showing aggressive expansion in your market",
      "12 toxic backlinks need to be disavowed",
      "8 pages missing LocalBusiness schema"
    ],
    "opportunities": [
      "'Basement flooding alexandria va' is #11 - push to page 1",
      "Fairfax market needs content refresh to counter SERVPRO",
      "Local chamber memberships yielding quality links"
    ],
    "rankingsSummary": {
      "improved": 2,
      "declined": 1,
      "stable": 1,
      "newRankings": 0,
      "lostRankings": 0
    },
    "trafficSummary": {
      "totalSessions": 1250,
      "change": 5.9,
      "topGrowthPage": "/emergency-services (+35 sessions)",
      "topDeclinePage": "/arlington-va (-25 sessions)"
    },
    "backlinkSummary": {
      "gained": 5,
      "lost": 2,
      "netChange": 3
    },
    "competitorSummary": "SERVPRO is the primary threat this week with new content and ranking gains. ServiceMaster stable. PuroClean losing ground.",
    "topActions": []
  },
  "quickStats": {
    "rankingsUp": 2,
    "rankingsDown": 1,
    "newAlerts": 4,
    "criticalIssues": 1,
    "pendingActions": 6,
    "competitorThreats": 1
  }
}

IMPORTANT:
- Generate realistic, actionable alerts based on actual search data
- Prioritize actions by potential impact
- Include specific, detailed steps for each action item
- Make the weekly digest scannable and actionable
- Focus on the water damage restoration industry in NoVA/DC/MD
- Consider seasonal factors (winter = pipe bursts, spring = flooding)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return extractJSON(text) as SEOHealthMonitorResult;
  } catch (error) {
    console.error("SEO Health Monitor Error:", error);
    throw error;
  }
};