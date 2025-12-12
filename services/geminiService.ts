import { GoogleGenAI } from "@google/genai";
import { AnalysisState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSeo = async (
  url: string,
  keywords: string,
  businessType: string,
  location: string
): Promise<Partial<AnalysisState>> => {
  try {
    const prompt = `
Act as a world-class LOCAL SEO strategist specializing in emergency home services. Generate a comprehensive SEO analysis for a water damage restoration company.

**CRITICAL OUTPUT RULES (FOLLOW EXACTLY):**
1. All section headers use ## (h2 level), numbered exactly: ## 1. , ## 2. , etc.
2. Subsections use ### (h3 level)
3. All tables must be valid Markdown with | delimiters and header separator rows
4. Checklist items use exactly: - [ ] **Task**: Details (hyphen, space, brackets, space)
5. The JSON block at the end MUST use \`\`\`json with the language tag
6. JSON values must be raw integers only — no strings, no annotations, no comments
7. Use the SAME domain name format in written analysis and JSON (e.g., "competitor.com")
8. ALL competitor data must come from actual search results — do not invent metrics
9. Never skip sections — output all 11 sections every time

---

**Business Profile:**
- Website: ${url}
- Core Keywords: ${keywords}
- Industry: ${businessType || "Water Damage Restoration"}
- Target Service Area: ${location || "National"}

---

## 1. Executive Summary

Provide a 3-4 sentence assessment including:
- Market difficulty in ${location || "this region"} (Easy/Moderate/Difficult/Very Difficult)
- Local Pack competitiveness (1-10 scale)
- Primary opportunity identified
- Biggest obstacle to ranking

---

## 2. Local Map Pack Analysis

Analyze the TOP 3 businesses in the Google Map Pack for "${keywords} ${location}":

| Rank | Business Name | Domain | GBP Categories | Review Count | Rating | Key Differentiator |
|------|---------------|--------|----------------|--------------|--------|-------------------|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

For each, note:
- Primary category used
- Whether they show 24/7 availability
- Service area approach (radius vs city list)

---

## 3. Keyword Strategy by Intent

### 3A. Emergency Keywords (Highest Value)

| Keyword | Est. Monthly Volume | Difficulty | Current Top Ranker |
|---------|---------------------|------------|--------------------|
| | | | |

Include variations of: "emergency water damage", "24 hour flood cleanup", "water damage near me", "emergency flood service"

### 3B. Service-Specific Keywords

| Keyword | Est. Monthly Volume | Difficulty | Current Top Ranker |
|---------|---------------------|------------|--------------------|
| | | | |

Include: basement flooding, sewage cleanup, mold remediation, burst pipe repair, water extraction, structural drying

### 3C. Insurance/Cost Research Keywords

| Keyword | Est. Monthly Volume | Difficulty | Current Top Ranker |
|---------|---------------------|------------|--------------------|
| | | | |

Include: "water damage restoration cost", "does insurance cover water damage", "water damage claim"

### 3D. Location Long-Tail Keywords

| Keyword | Est. Monthly Volume | Difficulty | Current Top Ranker |
|---------|---------------------|------------|--------------------|
| | | | |

Include city + service combinations specific to ${location}

### 3E. Top 5 Priority Keywords with Ranking URLs

| Priority Keyword | #1 Ranking URL | #2 Ranking URL | #3 Ranking URL |
|------------------|----------------|----------------|----------------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

---

## 4. Competitor Deep Dive

Analyze the TOP 3 organic competitors. Use the exact same domain names that will appear in the JSON output (Section 11).

### Competitor: [domain1.com]

**Content Analysis:**
- Main service page word count: 
- Total service pages: 
- Blog posts (estimated): 
- FAQ section present: Yes/No
- Before/after gallery: Yes/No

**Technical Signals:**
- Schema types detected: 
- Mobile experience: 
- Page speed estimate: 

**Local Signals:**
- Location/city pages count: 
- NAP in footer: Yes/No
- Certifications displayed: 

**Conversion Elements:**
- Primary CTA: 
- Phone prominence: 
- Trust badges: 
- 24/7 messaging: Yes/No

---

### Competitor: [domain2.com]

**Content Analysis:**
- Main service page word count: 
- Total service pages: 
- Blog posts (estimated): 
- FAQ section present: Yes/No
- Before/after gallery: Yes/No

**Technical Signals:**
- Schema types detected: 
- Mobile experience: 
- Page speed estimate: 

**Local Signals:**
- Location/city pages count: 
- NAP in footer: Yes/No
- Certifications displayed: 

**Conversion Elements:**
- Primary CTA: 
- Phone prominence: 
- Trust badges: 
- 24/7 messaging: Yes/No

---

### Competitor: [domain3.com]

**Content Analysis:**
- Main service page word count: 
- Total service pages: 
- Blog posts (estimated): 
- FAQ section present: Yes/No
- Before/after gallery: Yes/No

**Technical Signals:**
- Schema types detected: 
- Mobile experience: 
- Page speed estimate: 

**Local Signals:**
- Location/city pages count: 
- NAP in footer: Yes/No
- Certifications displayed: 

**Conversion Elements:**
- Primary CTA: 
- Phone prominence: 
- Trust badges: 
- 24/7 messaging: Yes/No

---

## 5. Content Gap Analysis

What pages do top competitors have that ${url} is missing?

| Missing Content Type | Competitor Example URL | Priority | Est. Traffic Impact |
|----------------------|------------------------|----------|---------------------|
| | | High/Med/Low | |

Check for and include:
- Individual service pages (water extraction, structural drying, dehumidification, content restoration)
- City/neighborhood landing pages for each service area
- Insurance information page ("Does homeowners insurance cover...")
- Emergency response page (response time guarantees)
- Commercial water damage page
- Residential water damage page
- Before/after gallery page
- FAQ page with schema markup
- Blog/resource section

---

## 6. Service Area Opportunity Map

Which cities/neighborhoods in ${location} are underserved?

| City/Neighborhood | Your Presence | Competitor 1 | Competitor 2 | Competitor 3 | Opportunity Score (1-10) |
|-------------------|---------------|--------------|--------------|--------------|--------------------------|
| | Yes/No | Yes/No | Yes/No | Yes/No | |

Identify at least 5 micro-markets where dedicated landing pages could win.

---

## 7. Backlink & Citation Strategy

### 7A. Local Link Building Targets

| Opportunity Type | Specific Target | Est. Authority | Acquisition Method |
|------------------|-----------------|----------------|-------------------|
| Chamber of Commerce | | | |
| Insurance Agents | | | |
| Property Managers | | | |
| Real Estate Offices | | | |
| Local News/Media | | | |
| Industry Directory | IICRC, RIA | | |
| Local Blogs | | | |

### 7B. Citation Audit Priorities

| Platform | Competitor 1 Present | Competitor 2 Present | Competitor 3 Present | Your Action |
|----------|---------------------|---------------------|---------------------|-------------|
| Google Business Profile | | | | |
| Yelp | | | | |
| Angi (Angie's List) | | | | |
| BBB | | | | |
| HomeAdvisor | | | | |
| Thumbtack | | | | |
| Nextdoor | | | | |

---

## 8. Review & Reputation Strategy

Based on Map Pack analysis:

**Competitive Benchmarks:**
- Average review count in Map Pack: 
- Reviews needed to compete: 
- Target velocity: X reviews/month
- Current leader review count: 

**Platform Priority Order:**
1. Google Business Profile (most important)
2. 
3. 
4. 

**Themes to Emphasize (from competitor positive reviews):**
- 
- 
- 

**Competitor Weaknesses to Exploit:**
- 
- 

**Review Generation Tactics:**
1. Post-job follow-up sequence
2. 
3. 

---

## 9. Technical SEO Checklist

### On-Page Optimization

- [ ] **Title Tags**: Format as "[Service] in [City] | [Brand] | 24/7 Emergency"
- [ ] **Meta Descriptions**: Include phone number and "Call Now" CTA
- [ ] **H1 Tags**: One per page, primary keyword + location
- [ ] **LocalBusiness Schema**: Full NAP, service area, hours, services
- [ ] **Service Schema**: Individual schema for each service type
- [ ] **FAQ Schema**: Minimum 5 Q&As per service page
- [ ] **Review Schema**: Aggregate rating markup
- [ ] **Internal Linking**: Service pages → Location pages → Related services
- [ ] **Image Optimization**: Alt text with "[service] in [city]" format
- [ ] **Page Speed**: Target under 3 seconds on mobile
- [ ] **Mobile Click-to-Call**: Sticky header with phone button
- [ ] **SSL Certificate**: Verify HTTPS active sitewide

### Google Business Profile Optimization

- [ ] **Primary Category**: Water Damage Restoration Service
- [ ] **Secondary Categories**: Add all relevant (Mold Remediation, Fire Damage, etc.)
- [ ] **Services List**: Add every service with descriptions
- [ ] **Products**: Add service packages if applicable
- [ ] **Business Description**: Full 750 characters with keywords
- [ ] **Photos**: Minimum 20 (team, vehicles, before/after, equipment)
- [ ] **Posts**: Weekly updates (offers, tips, project highlights)
- [ ] **Q&A**: Seed 10+ common questions with answers
- [ ] **Messaging**: Enable and monitor
- [ ] **Booking**: Set up if applicable

### Off-Page & Local

- [ ] **NAP Consistency Audit**: Verify across all citations
- [ ] **Citation Building**: Submit to top 20 local directories
- [ ] **Service Area Pages**: Create dedicated page for each target city
- [ ] **Local Backlinks**: Target 2-3 quality links per month
- [ ] **Review Generation System**: Implement post-job request flow
- [ ] **Social Profiles**: Claim and optimize (Facebook, LinkedIn minimum)

---

## 10. 90-Day Priority Roadmap

### Week 1-2: Foundation (Quick Wins)

1. 
2. 
3. 
4. 
5. 

### Week 3-4: Technical & GBP

1. 
2. 
3. 
4. 

### Month 2: Content Build

1. 
2. 
3. 
4. 

### Month 3: Authority & Scale

1. 
2. 
3. 
4. 

---

## 11. Competitor Metrics Data

**CRITICAL INSTRUCTIONS FOR JSON OUTPUT:**
- Use the EXACT same domain names from Section 4
- All values MUST be integers (no decimals, no strings, no quotes around numbers)
- gbp_rating is stored as integer without decimal (47 means 4.7 stars, 49 means 4.9 stars)
- Do not add comments or annotations inside the JSON
- Do not skip any fields
\`\`\`json
[
  {
    "name": "competitor1.com",
    "domain_authority": 65,
    "backlink_strength": 55,
    "estimated_traffic": 70,
    "gbp_review_count": 120,
    "gbp_rating": 47,
    "local_pages_count": 8
  },
  {
    "name": "competitor2.com",
    "domain_authority": 58,
    "backlink_strength": 45,
    "estimated_traffic": 60,
    "gbp_review_count": 85,
    "gbp_rating": 46,
    "local_pages_count": 5
  },
  {
    "name": "competitor3.com",
    "domain_authority": 52,
    "backlink_strength": 40,
    "estimated_traffic": 55,
    "gbp_review_count": 62,
    "gbp_rating": 44,
    "local_pages_count": 3
  }
]
\`\`\`

---

**FINAL CONSTRAINTS:**
- Ground ALL data in actual search results from the Google Search tool
- Cite specific URLs when making claims about competitor pages
- Be specific to ${location || "the target area"} — use actual city names, neighborhoods, and landmarks
- Focus on actionable items a small business owner can implement themselves
- Prioritize emergency/24-7 keyword variations (critical for water damage industry)
- Note if any competitors are running Google Ads in the Map Pack
- Every table must have data — do not leave placeholder rows empty
- Output clean, valid Markdown that renders correctly
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return {
      data: text,
      groundingMetadata: groundingMetadata as any,
      isLoading: false,
      error: null,
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      isLoading: false,
      error: error.message || "An unexpected error occurred during analysis.",
      data: null,
      groundingMetadata: null
    };
  }
};