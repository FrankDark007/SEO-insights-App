import { GoogleGenAI } from "@google/genai";
import { CompetitorIntelligenceResult } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCompetitors = async (
  yourDomain: string,
  competitors: string[],
  targetKeywords: string[],
  location: string
): Promise<CompetitorIntelligenceResult> => {
  try {
    const competitorList = competitors.join(", ");
    const keywordList = targetKeywords.join(", ");

    const prompt = `You are an elite competitive intelligence analyst specializing in local SEO for service businesses. Perform a comprehensive reverse engineering analysis.

YOUR CLIENT:
Domain: ${yourDomain}
Location: ${location}
Industry: Water damage restoration / disaster recovery

COMPETITORS TO ANALYZE:
${competitorList}

TARGET KEYWORDS TO TRACK:
${keywordList}

Use Google Search to gather real, current data about each competitor. For each competitor, research:

1. RANKING POSITIONS
- Current rankings for each target keyword in ${location}
- Recent ranking changes (gains/losses)
- Which pages are ranking

2. CONTENT ANALYSIS
- Page structure (headings, word count, sections)
- Content freshness (last updated)
- Topics covered vs missing
- Schema markup used
- FAQ sections, videos, images

3. BACKLINK PROFILE
- Estimated domain authority
- Types of sites linking to them
- Recent backlinks gained
- Authority sites they link OUT to (citations to .gov, .edu, industry sites)

4. RECENT CHANGES
- New pages published
- Content updates made
- New features added (chat widgets, scheduling tools)
- Technical improvements
- Design changes

5. CORRELATION ANALYSIS
- What specific tactics correlate with their ranking success?
- What do the top 3 rankers have that lower rankers don't?
- What patterns emerge across successful competitors?

6. ACTION ITEMS
- Generate specific, actionable tasks for ${yourDomain}
- Prioritize by impact and effort
- Include step-by-step implementation

Return ONLY valid JSON matching this structure:
{
  "scanDate": "ISO date string",
  "yourDomain": "${yourDomain}",
  "competitors": [
    {
      "domain": "servpro.com",
      "name": "SERVPRO",
      "overallScore": 85,
      "keywordsTracked": 20,
      "avgPosition": 4.2,
      "totalTraffic": 15000,
      "recentChanges": 3,
      "trend": "improving"
    }
  ],
  "recentChanges": [
    {
      "competitor": "servpro.com",
      "changeType": "content_update",
      "description": "Added comprehensive FAQ section with 12 questions to their Arlington page",
      "url": "https://servpro.com/arlington-va/water-damage",
      "detectedDate": "2024-12-10",
      "impact": "high",
      "relatedKeyword": "water damage restoration arlington va",
      "rankingEffect": "Moved from #4 to #2",
      "yourAction": "Add FAQ section with 10+ questions covering cost, timeline, insurance, process"
    }
  ],
  "keywordBattles": [
    {
      "keyword": "water damage restoration arlington va",
      "monthlyVolume": 320,
      "yourRank": 7,
      "competitors": [
        { "domain": "servpro.com", "rank": 1, "change": 2, "url": "https://..." },
        { "domain": "puroclean.com", "rank": 2, "change": 0, "url": "https://..." }
      ],
      "leader": "servpro.com",
      "gap": 6,
      "opportunity": "Leader has FAQ schema and 2000+ words. You have neither.",
      "difficulty": "medium"
    }
  ],
  "contentComparisons": [
    {
      "keyword": "water damage restoration arlington va",
      "yourUrl": "https://arlington.flooddoctorva.com/water-damage",
      "topCompetitorUrl": "https://servpro.com/arlington/water-damage",
      "metrics": [
        { "metric": "Word Count", "yours": 850, "theirs": 2100, "winner": "them", "importance": "critical" },
        { "metric": "H2 Headings", "yours": 4, "theirs": 8, "winner": "them", "importance": "high" },
        { "metric": "Images", "yours": 3, "theirs": 7, "winner": "them", "importance": "medium" },
        { "metric": "FAQ Questions", "yours": 0, "theirs": 12, "winner": "them", "importance": "critical" },
        { "metric": "Schema Types", "yours": 1, "theirs": 4, "winner": "them", "importance": "high" },
        { "metric": "Internal Links", "yours": 5, "theirs": 14, "winner": "them", "importance": "high" },
        { "metric": "External Authority Links", "yours": 0, "theirs": 3, "winner": "them", "importance": "medium" }
      ],
      "structureAnalysis": [
        { "element": "Process Steps Section", "yourCount": 0, "theirCount": 1, "recommendation": "Add detailed step-by-step process section" },
        { "element": "Service Area List", "yourCount": 0, "theirCount": 1, "recommendation": "Add neighborhoods/zip codes served" },
        { "element": "Trust Badges", "yourCount": 1, "theirCount": 5, "recommendation": "Add IICRC, BBB, insurance certifications" }
      ],
      "missingTopics": ["Insurance claim process", "Drying timeline expectations", "Emergency response time", "Equipment used"],
      "missingSchema": ["FAQPage", "HowTo", "Review aggregate"]
    }
  ],
  "backlinkIntelligence": [
    {
      "competitor": "servpro.com",
      "totalBacklinks": 45000,
      "referringDomains": 2300,
      "avgDomainAuthority": 42,
      "topSources": [
        {
          "domain": "insurance.com",
          "authority": 75,
          "linkType": "editorial",
          "acquirable": true,
          "howToGet": "Submit expert quotes for their water damage articles"
        }
      ],
      "recentGains": [
        {
          "source": "arlington-va.gov",
          "date": "2024-12-05",
          "anchorText": "water damage restoration services",
          "targetPage": "/arlington/emergency-services"
        }
      ],
      "authorityOutboundLinks": [
        { "domain": "iicrc.org", "type": "Industry certification", "yourEquivalent": null },
        { "domain": "epa.gov", "type": "Mold guidelines", "yourEquivalent": null },
        { "domain": "fema.gov", "type": "Flood resources", "yourEquivalent": null }
      ]
    }
  ],
  "actionItems": [
    {
      "id": "action-001",
      "priority": "critical",
      "category": "content",
      "title": "Add FAQ Section to Arlington Page",
      "description": "Top 3 competitors all have FAQ sections with 8-15 questions. This correlates with FAQ rich snippets in search results.",
      "basedOn": "SERVPRO moved from #4 to #2 after adding FAQ section",
      "expectedImpact": "Featured snippet eligibility + 2-3 position improvement",
      "effort": "quick",
      "deadline": "This week",
      "steps": [
        "Research top 20 questions from PAA for target keywords",
        "Write detailed answers (100-200 words each)",
        "Add FAQPage schema markup",
        "Include internal links within answers",
        "Add to page above footer"
      ],
      "completed": false
    },
    {
      "id": "action-002",
      "priority": "critical",
      "category": "content",
      "title": "Expand Page Content to 2000+ Words",
      "description": "Your Arlington page has 850 words. Top 3 competitors average 1,950 words.",
      "basedOn": "Content length correlation: pages with 1500+ words rank 3.2 positions higher on average",
      "expectedImpact": "Significant ranking improvement for primary keywords",
      "effort": "moderate",
      "deadline": "This week",
      "steps": [
        "Add 'Our Water Damage Process' section (6 steps, 400 words)",
        "Add 'Areas We Serve' section with neighborhoods (200 words)",
        "Add 'Why Choose Us' with differentiators (300 words)",
        "Add 'Insurance & Payment' section (250 words)",
        "Expand existing sections with more detail"
      ],
      "completed": false
    },
    {
      "id": "action-003",
      "priority": "high",
      "category": "schema",
      "title": "Add Missing Schema Markup",
      "description": "Competitors have 3-4 schema types. You have only LocalBusiness.",
      "basedOn": "Top rankers use FAQPage, HowTo, Service, and Review schema",
      "expectedImpact": "Rich snippet eligibility, improved CTR",
      "effort": "moderate",
      "deadline": "Next week",
      "steps": [
        "Add FAQPage schema for FAQ section",
        "Add HowTo schema for process steps",
        "Add AggregateRating schema with review data",
        "Add Service schema for each service type",
        "Test with Google Rich Results Test"
      ],
      "completed": false
    },
    {
      "id": "action-004",
      "priority": "high",
      "category": "backlinks",
      "title": "Add Authority Outbound Links",
      "description": "Top competitors link to IICRC, EPA, FEMA. You link to zero authority sources.",
      "basedOn": "Pages with authority outbound links rank 2.1 positions higher",
      "expectedImpact": "Trust signal improvement, topical relevance boost",
      "effort": "quick",
      "deadline": "This week",
      "steps": [
        "Link to IICRC S500 standard (drying procedures)",
        "Link to EPA mold guidelines",
        "Link to FEMA flood resources",
        "Link to Virginia DPOR (your license verification)",
        "Use descriptive anchor text"
      ],
      "completed": false
    }
  ],
  "weeklyDigest": {
    "biggestThreats": [
      "SERVPRO gained 3 positions on 'water damage arlington' after content update",
      "PuroClean launched new service area page targeting McLean"
    ],
    "quickWins": [
      "Add FAQ schema - no competitor in position 4-10 has this",
      "Link to IICRC.org - easy trust signal competitors all have"
    ],
    "competitorWins": [
      "SERVPRO: FAQ section addition → #4 to #2",
      "ServiceMaster: New video → increased time on page"
    ],
    "yourWins": [
      "You rank #1 for 'sewage cleanup fairfax va'",
      "Your Google reviews increased by 3 this week"
    ],
    "trendingSummary": "Competitors are heavily investing in FAQ content and schema markup. SERVPRO is the most aggressive, with 3 major updates this month. Your biggest gap is content depth and structured data."
  },
  "correlationInsights": [
    {
      "insight": "FAQ sections correlate with +3.2 average position improvement",
      "evidence": "All top 3 rankers have FAQ sections. Those without average position 7.4",
      "recommendation": "Add FAQ with 10+ questions to all city pages"
    },
    {
      "insight": "Pages linking to authority sources (.gov, .org) rank 2.1 positions higher",
      "evidence": "Analyzed 50 pages: those with 2+ authority outbound links average #4, those without average #6.1",
      "recommendation": "Add links to IICRC, EPA, FEMA on all service pages"
    },
    {
      "insight": "Content length threshold: 1500 words appears to be minimum for top 5",
      "evidence": "No page under 1400 words ranks in top 5 for primary keywords",
      "recommendation": "Expand all city pages to 1800-2200 words"
    }
  ]
}

Be thorough and specific. Include real competitor domains and realistic data based on your research. Generate at least:
- 5-8 recent competitor changes
- Analysis for top 10 keywords
- 3-5 detailed content comparisons
- 8-12 prioritized action items
- 3-5 correlation insights

Focus on actionable intelligence that will help ${yourDomain} outrank these competitors.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return extractJSON(text) as CompetitorIntelligenceResult;
  } catch (error) {
    console.error("Competitor Intelligence Error:", error);
    throw error;
  }
};