import { GoogleGenAI } from "@google/genai";
import { AuthorityLinkResult } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAuthorityLinks = async (
  yourDomain: string,
  competitors: string[]
): Promise<AuthorityLinkResult> => {
  try {
    const competitorList = competitors.map((c, i) => `${i + 1}. ${c}`).join("\n");

    const prompt = `You are an expert SEO link building strategist. Perform a comprehensive backlink analysis to identify authority link opportunities.

YOUR DOMAIN: ${yourDomain}

COMPETITOR DOMAINS TO ANALYZE:
${competitorList}

Use Google Search to research:
1. Backlink profiles for each domain
2. High-authority sites linking to competitors but not to ${yourDomain}
3. Industry-relevant directories, publications, and resource pages
4. Local business citations and partnerships
5. Guest posting opportunities in the restoration/home services niche

ANALYSIS TO PERFORM:

1. YOUR LINK PROFILE
- Estimate total backlinks and referring domains
- Identify current domain authority
- Analyze anchor text distribution
- Note top linking domains

2. COMPETITOR LINK PROFILES
- Total backlinks and referring domains for each
- Domain authority comparison
- Link velocity (new links per month)
- Top authoritative links they have

3. LINK GAP ANALYSIS
- Domains linking to 2+ competitors but not you
- High DA sites you're missing
- Industry-specific opportunities
- Local/regional link sources

4. OUTREACH TARGETS
- Prioritized list of domains to target
- Contact information where available
- Suggested outreach angle for each
- Estimated success probability

5. LINK BUILDING STRATEGIES
- Guest posting opportunities
- Resource page link building
- Local citation building
- Digital PR opportunities
- Partnership/sponsorship links

Return ONLY valid JSON matching this structure:
{
  "analyzedAt": "ISO date string",
  "yourDomain": "${yourDomain}",
  "yourProfile": {
    "totalBacklinks": 450,
    "referringDomains": 85,
    "domainAuthority": 28,
    "dofollowRatio": 72,
    "avgLinkAuthority": 25,
    "topAnchors": [
      { "text": "flood doctor", "count": 45 },
      { "text": "water damage restoration", "count": 28 },
      { "text": "click here", "count": 15 }
    ]
  },
  "competitors": [
    {
      "domain": "servpro.com",
      "totalBacklinks": 125000,
      "referringDomains": 8500,
      "dofollowRatio": 68,
      "avgDomainAuthority": 45,
      "topAnchors": [
        { "text": "SERVPRO", "percentage": 35, "count": 2975 },
        { "text": "water damage restoration", "percentage": 12, "count": 1020 }
      ],
      "linkVelocity": 250,
      "newLinksLast30Days": 312,
      "lostLinksLast30Days": 45,
      "topLinkingDomains": [
        {
          "url": "https://www.bbb.org/servpro",
          "domain": "bbb.org",
          "domainAuthority": 91,
          "pageAuthority": 45,
          "spamScore": 1,
          "linkType": "dofollow",
          "anchorText": "SERVPRO",
          "anchorType": "branded",
          "contextRelevance": "high",
          "placement": "directory",
          "targetPage": "https://servpro.com",
          "firstSeen": "2019-03-15",
          "isLive": true,
          "trafficEstimate": 5000
        }
      ]
    }
  ],
  "linkGaps": [
    {
      "domain": "angi.com",
      "domainAuthority": 89,
      "linksToCompetitors": [
        { "competitor": "servpro.com", "count": 3 },
        { "competitor": "servicemaster.com", "count": 2 }
      ],
      "linksToYou": 0,
      "opportunity": "high",
      "suggestedApproach": "Claim and optimize your Angi business profile with complete information, photos, and request reviews from past customers",
      "contactInfo": {
        "email": null,
        "contactPage": "https://www.angi.com/for-businesses"
      }
    },
    {
      "domain": "homeadvisor.com",
      "domainAuthority": 87,
      "linksToCompetitors": [
        { "competitor": "servpro.com", "count": 2 },
        { "competitor": "puroclean.com", "count": 2 }
      ],
      "linksToYou": 0,
      "opportunity": "high",
      "suggestedApproach": "Sign up for HomeAdvisor Pro to get listed and receive qualified leads",
      "contactInfo": {
        "email": null,
        "contactPage": "https://pro.homeadvisor.com"
      }
    },
    {
      "domain": "washingtonpost.com",
      "domainAuthority": 95,
      "linksToCompetitors": [
        { "competitor": "servpro.com", "count": 1 }
      ],
      "linksToYou": 0,
      "opportunity": "medium",
      "suggestedApproach": "Pitch local disaster response stories or home maintenance expert quotes to local section editors",
      "contactInfo": {
        "email": "local@washpost.com",
        "contactPage": "https://www.washingtonpost.com/contact-us"
      }
    }
  ],
  "outreachTargets": [
    {
      "priority": 1,
      "domain": "northernvirginiamag.com",
      "domainAuthority": 52,
      "contactEmail": "editor@northernvirginiamag.com",
      "contactPage": "https://northernvirginiamag.com/contact",
      "linkingToCompetitors": ["servpro.com"],
      "suggestedAngle": "Pitch a home maintenance guide or disaster preparedness article for NoVA homeowners",
      "outreachTemplate": "Subject: Expert Source for Water Damage Prevention Article\\n\\nHi [Editor Name],\\n\\nI noticed Northern Virginia Magazine covers home improvement topics. As a local IICRC-certified water damage restoration expert serving Arlington, Fairfax, and Alexandria for [X] years, I'd love to contribute insights on preventing water damage during storm season.\\n\\nI could provide:\\n- Common causes of water damage in NoVA homes\\n- Prevention checklist for homeowners\\n- What to do in the first 24 hours after water damage\\n\\nWould this be valuable for your readers?\\n\\nBest,\\n[Name]",
      "estimatedSuccessRate": 35,
      "potentialValue": "high"
    },
    {
      "priority": 2,
      "domain": "arlingtonchamber.org",
      "domainAuthority": 45,
      "contactEmail": "membership@arlingtonchamber.org",
      "contactPage": "https://arlingtonchamber.org/join",
      "linkingToCompetitors": [],
      "suggestedAngle": "Join chamber of commerce for member directory listing and networking events",
      "outreachTemplate": "Membership application with business profile",
      "estimatedSuccessRate": 90,
      "potentialValue": "medium"
    },
    {
      "priority": 3,
      "domain": "restorationindustry.org",
      "domainAuthority": 48,
      "contactEmail": "info@restorationindustry.org",
      "contactPage": "https://restorationindustry.org/membership",
      "linkingToCompetitors": ["servpro.com", "servicemaster.com"],
      "suggestedAngle": "RIA membership includes member directory listing",
      "outreachTemplate": "Apply for RIA membership to get listed in contractor directory",
      "estimatedSuccessRate": 85,
      "potentialValue": "high"
    }
  ],
  "strategies": [
    {
      "strategyType": "local-citation",
      "description": "Build consistent NAP citations across local directories",
      "targets": ["yelp.com", "yellowpages.com", "manta.com", "superpages.com", "citysearch.com"],
      "estimatedEffort": "low",
      "estimatedImpact": "medium",
      "timeframe": "2-4 weeks",
      "steps": [
        "Audit existing citations for NAP consistency",
        "Claim unclaimed listings on major directories",
        "Update all listings with consistent business information",
        "Add photos, hours, and service descriptions",
        "Request reviews from satisfied customers"
      ]
    },
    {
      "strategyType": "guest-post",
      "description": "Contribute expert content to home improvement and local publications",
      "targets": ["northernvirginiamag.com", "washingtonian.com", "dcist.com"],
      "estimatedEffort": "medium",
      "estimatedImpact": "high",
      "timeframe": "1-3 months",
      "steps": [
        "Research editorial guidelines for each publication",
        "Develop 3-5 topic pitches relevant to local homeowners",
        "Send personalized pitch emails to editors",
        "Write high-quality 800-1200 word articles",
        "Include natural mention of your expertise/business"
      ]
    },
    {
      "strategyType": "resource-page",
      "description": "Get listed on emergency services and home repair resource pages",
      "targets": ["fairfaxcounty.gov emergency resources", "arlington.gov home services", "local realtor resource pages"],
      "estimatedEffort": "medium",
      "estimatedImpact": "high",
      "timeframe": "1-2 months",
      "steps": [
        "Search for '[city] emergency services resources' and '[city] homeowner resources'",
        "Identify pages listing restoration or emergency contractors",
        "Contact page owners with request to be added",
        "Provide business credentials and insurance info",
        "Follow up after 1-2 weeks if no response"
      ]
    },
    {
      "strategyType": "partnership",
      "description": "Build referral partnerships with complementary businesses",
      "targets": ["plumbers", "insurance agents", "real estate agents", "property managers"],
      "estimatedEffort": "medium",
      "estimatedImpact": "high",
      "timeframe": "ongoing",
      "steps": [
        "Identify top local plumbers, agents, and property managers",
        "Reach out to propose mutual referral arrangement",
        "Create co-branded content or resource guides",
        "Request link from partner websites' vendor/partner pages",
        "Reciprocate with links where appropriate"
      ]
    },
    {
      "strategyType": "digital-pr",
      "description": "Earn media coverage through newsworthy stories and expert commentary",
      "targets": ["local news stations", "Washington Post local", "Patch.com", "WTOP"],
      "estimatedEffort": "high",
      "estimatedImpact": "high",
      "timeframe": "3-6 months",
      "steps": [
        "Set up HARO (Help A Reporter Out) alerts for relevant queries",
        "Monitor local news for disaster/weather stories to comment on",
        "Create press releases for company milestones or community involvement",
        "Build relationships with local journalists covering home/business",
        "Offer expert commentary during storm season"
      ]
    }
  ],
  "quickStats": {
    "totalGapDomains": 45,
    "highValueOpportunities": 12,
    "avgCompetitorDA": 65,
    "yourDAGap": 37,
    "estimatedLinksNeeded": 150
  },
  "summary": {
    "biggestOpportunity": "Missing from major directories (Angi, HomeAdvisor, BBB) that all top competitors have",
    "topPriority": "Claim and optimize profiles on Angi, HomeAdvisor, and BBB for immediate high-DA links",
    "competitorAdvantage": "SERVPRO has 100x more referring domains primarily from franchise network and national PR",
    "recommendedFocus": "Focus on local authority links (chambers, local publications, government resources) where you can compete without franchise resources"
  }
}

IMPORTANT:
- Focus on realistic, achievable link opportunities for a local service business
- Prioritize high-DA, relevant links over quantity
- Include actual contact information where discoverable
- Provide actionable outreach templates
- Consider the restoration/water damage industry specifically
- Emphasize local link building opportunities for NoVA/DC/MD area`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return extractJSON(text) as AuthorityLinkResult;
  } catch (error) {
    console.error("Authority Link Analysis Error:", error);
    throw error;
  }
};