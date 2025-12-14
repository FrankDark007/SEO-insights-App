import { GoogleGenAI } from "@google/genai";
import { ContentStructureResult } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContentStructure = async (
  keyword: string,
  yourUrl: string | null,
  competitorCount: number = 5
): Promise<ContentStructureResult> => {
  try {
    const yourPageContext = yourUrl 
      ? `Your page to analyze: ${yourUrl}` 
      : "You don't have a page for this keyword yet - analyze competitors only and generate a content template.";

    const prompt = `You are an expert SEO content strategist. Perform a deep content structure analysis for the keyword: "${keyword}"

${yourPageContext}

Use Google Search to:
1. Find the top ${competitorCount} ranking pages for "${keyword}"
2. Analyze each page's content structure in detail
3. ${yourUrl ? `Compare against the user's page: ${yourUrl}` : "Generate an optimal content template based on what's ranking"}

For EACH page (yours and competitors), analyze:

HEADING STRUCTURE:
- All H1, H2, H3, H4 tags and their text
- Word count under each heading
- Whether headings contain the target keyword or variations

CONTENT SECTIONS:
- What topics each section covers
- Approximate word count per section
- Media elements (images, videos, tables, lists)
- Schema markup present

MEDIA ANALYSIS:
- Total images and whether they have alt text
- Embedded videos
- Tables and data visualizations
- Bulleted/numbered lists

SCHEMA MARKUP:
- FAQPage schema
- HowTo schema
- LocalBusiness schema
- Article/BlogPosting schema
- Review/AggregateRating schema

CONTENT GAPS (comparing your page to competitors):
- Sections competitors have that you're missing
- Topics they cover more thoroughly
- Media types they use that you don't
- Schema markup you're missing

Return ONLY valid JSON matching this structure:
{
  "keyword": "${keyword}",
  "analyzedAt": "ISO date string",
  "yourPage": ${yourUrl ? `{
    "url": "${yourUrl}",
    "rank": 0,
    "title": "Your page title",
    "metaDescription": "Your meta description",
    "wordCount": 1500,
    "readingTime": "6 min",
    "headings": [
      {
        "tag": "h1",
        "text": "Main Heading",
        "wordCount": 0,
        "position": 1,
        "hasKeyword": true
      },
      {
        "tag": "h2",
        "text": "Section Heading",
        "wordCount": 250,
        "position": 2,
        "hasKeyword": false
      }
    ],
    "sections": [
      {
        "heading": "Section Name",
        "headingTag": "h2",
        "wordCount": 300,
        "hasImages": true,
        "hasVideo": false,
        "hasList": true,
        "hasTable": false,
        "hasSchema": false,
        "keyTopics": ["topic1", "topic2"]
      }
    ],
    "media": {
      "totalImages": 5,
      "imagesWithAlt": 3,
      "videos": 0,
      "infographics": 0,
      "tables": 1,
      "lists": 4,
      "codeBlocks": 0
    },
    "schema": [
      { "type": "LocalBusiness", "present": true, "completeness": "full" },
      { "type": "FAQPage", "present": false, "completeness": "missing" }
    ],
    "internalLinks": 8,
    "externalLinks": 3,
    "keywordDensity": 1.2,
    "uniqueTopicsCovered": ["topic1", "topic2", "topic3"],
    "contentScore": 72
  }` : "null"},
  "competitors": [
    {
      "url": "https://competitor1.com/page",
      "rank": 1,
      "title": "Competitor Title",
      "metaDescription": "Their meta description",
      "wordCount": 2800,
      "readingTime": "11 min",
      "headings": [
        {
          "tag": "h1",
          "text": "Their H1",
          "wordCount": 0,
          "position": 1,
          "hasKeyword": true
        }
      ],
      "sections": [
        {
          "heading": "Their Section",
          "headingTag": "h2",
          "wordCount": 400,
          "hasImages": true,
          "hasVideo": true,
          "hasList": true,
          "hasTable": true,
          "hasSchema": true,
          "keyTopics": ["comprehensive topic coverage"]
        }
      ],
      "media": {
        "totalImages": 12,
        "imagesWithAlt": 12,
        "videos": 2,
        "infographics": 1,
        "tables": 3,
        "lists": 8,
        "codeBlocks": 0
      },
      "schema": [
        { "type": "FAQPage", "present": true, "completeness": "full" },
        { "type": "HowTo", "present": true, "completeness": "full" }
      ],
      "internalLinks": 15,
      "externalLinks": 5,
      "keywordDensity": 1.5,
      "uniqueTopicsCovered": ["extensive", "topic", "list"],
      "contentScore": 92
    }
  ],
  "gaps": [
    {
      "type": "missing_section",
      "severity": "critical",
      "description": "Missing 'Cost Factors' section that all top 5 competitors have",
      "competitorExample": "Competitor #1 has 400-word section breaking down pricing factors",
      "recommendation": "Add H2 section covering cost breakdown with table of price ranges",
      "estimatedImpact": "Could improve rankings 3-5 positions"
    },
    {
      "type": "missing_faq",
      "severity": "high",
      "description": "No FAQ section or FAQPage schema",
      "competitorExample": "Top 3 competitors all have 8-10 FAQs with schema markup",
      "recommendation": "Add FAQ section with 8-10 questions targeting People Also Ask queries",
      "estimatedImpact": "Eligible for FAQ rich results, +15% CTR potential"
    },
    {
      "type": "thin_content",
      "severity": "high",
      "description": "Your page has 1,500 words vs competitor average of 2,800",
      "competitorExample": "#1 ranking page has 3,200 words with comprehensive coverage",
      "recommendation": "Expand content by 1,300+ words focusing on missing topics",
      "estimatedImpact": "Longer content correlates with higher rankings for this keyword"
    },
    {
      "type": "missing_media",
      "severity": "medium",
      "description": "No video content while top 3 competitors have embedded videos",
      "competitorExample": "Competitor #2 has process walkthrough video with 50K views",
      "recommendation": "Add 2-3 minute explainer video showing your service process",
      "estimatedImpact": "Video can increase time on page by 80%"
    }
  ],
  "topicCoverage": [
    {
      "topic": "Cost/Pricing Information",
      "yourCoverage": "missing",
      "competitorsCovering": 5,
      "importance": "essential",
      "suggestedWordCount": 400
    },
    {
      "topic": "Step-by-Step Process",
      "yourCoverage": "partial",
      "competitorsCovering": 5,
      "importance": "essential",
      "suggestedWordCount": 500
    },
    {
      "topic": "Insurance Coverage",
      "yourCoverage": "missing",
      "competitorsCovering": 4,
      "importance": "recommended",
      "suggestedWordCount": 300
    },
    {
      "topic": "DIY vs Professional",
      "yourCoverage": "missing",
      "competitorsCovering": 3,
      "importance": "recommended",
      "suggestedWordCount": 350
    },
    {
      "topic": "Local Area Expertise",
      "yourCoverage": "full",
      "competitorsCovering": 2,
      "importance": "optional",
      "suggestedWordCount": 200
    }
  ],
  "avgCompetitorWordCount": 2800,
  "avgCompetitorSections": 12,
  "avgCompetitorImages": 10,
  "contentTemplate": {
    "suggestedTitle": "Water Damage Restoration Arlington VA | 24/7 Emergency Service | [Brand]",
    "suggestedMetaDescription": "Professional water damage restoration in Arlington VA. 24/7 emergency response, IICRC certified. Insurance accepted. Call now for fast service.",
    "recommendedWordCount": 3000,
    "outlineHeadings": [
      {
        "tag": "h1",
        "text": "Water Damage Restoration Arlington VA",
        "suggestedWordCount": 0,
        "keyPoints": ["Include primary keyword", "Location modifier"]
      },
      {
        "tag": "h2",
        "text": "24/7 Emergency Water Damage Response in Arlington",
        "suggestedWordCount": 250,
        "keyPoints": ["Response time", "Service area coverage", "Emergency contact"]
      },
      {
        "tag": "h2",
        "text": "Our Water Damage Restoration Process",
        "suggestedWordCount": 400,
        "keyPoints": ["Step 1: Assessment", "Step 2: Water extraction", "Step 3: Drying", "Step 4: Restoration"]
      },
      {
        "tag": "h2",
        "text": "Water Damage Restoration Cost in Arlington VA",
        "suggestedWordCount": 350,
        "keyPoints": ["Price ranges", "Factors affecting cost", "Insurance coverage", "Free estimates"]
      },
      {
        "tag": "h2",
        "text": "Types of Water Damage We Handle",
        "suggestedWordCount": 400,
        "keyPoints": ["Flood damage", "Burst pipes", "Sewage backup", "Storm damage", "Appliance leaks"]
      },
      {
        "tag": "h2",
        "text": "Why Choose [Brand] for Arlington Water Damage",
        "suggestedWordCount": 300,
        "keyPoints": ["Certifications", "Local experience", "Response time", "Reviews"]
      },
      {
        "tag": "h2",
        "text": "Arlington VA Water Damage FAQ",
        "suggestedWordCount": 500,
        "keyPoints": ["8-10 questions", "Insurance questions", "Timeline questions", "Cost questions"]
      }
    ],
    "requiredMedia": [
      "Hero image of restoration work",
      "Process infographic or diagram",
      "Before/after gallery (3-5 images)",
      "Team or equipment photo",
      "Video walkthrough (optional but recommended)"
    ],
    "requiredSchema": [
      "LocalBusiness",
      "FAQPage",
      "Service",
      "AggregateRating"
    ],
    "internalLinkTargets": [
      "/mold-remediation-arlington-va",
      "/emergency-services",
      "/service-areas",
      "/about-us",
      "/contact"
    ]
  },
  "quickWins": [
    {
      "action": "Add FAQ section with 8 questions and FAQPage schema",
      "effort": "low",
      "impact": "high"
    },
    {
      "action": "Add cost/pricing section with table",
      "effort": "low",
      "impact": "high"
    },
    {
      "action": "Add alt text to all images",
      "effort": "low",
      "impact": "medium"
    },
    {
      "action": "Expand process section from 200 to 500 words",
      "effort": "medium",
      "impact": "high"
    },
    {
      "action": "Add before/after image gallery",
      "effort": "medium",
      "impact": "medium"
    }
  ],
  "summary": {
    "yourScore": 72,
    "avgCompetitorScore": 88,
    "biggestGap": "Missing comprehensive cost/pricing section that all competitors have",
    "topPriority": "Add FAQ section with schema - lowest effort, highest impact quick win"
  }
}

IMPORTANT:
- Be thorough in analyzing actual content structure from search results
- Identify specific sections, not generic advice
- Quantify gaps (word counts, number of images, etc.)
- Provide actionable recommendations with effort/impact ratings
- The content template should be immediately usable for content creation`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return extractJSON(text) as ContentStructureResult;
  } catch (error) {
    console.error("Content Structure Analysis Error:", error);
    throw error;
  }
};