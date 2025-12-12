import { GoogleGenAI } from "@google/genai";
import { 
  SerpAnalysisResult, 
  SchemaPattern, 
  RichResultHistoryEntry, 
  RichResultAlert, 
  SchemaGenerationInput, 
  GeneratedSchema 
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const STORAGE_KEY = "seo_insight_rich_results";

interface RichResultStorage {
  history: RichResultHistoryEntry[];
  library: SchemaPattern[];
  alerts: RichResultAlert[];
}

const getStorage = (): RichResultStorage => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { history: [], library: [], alerts: [] };
};

const saveStorage = (data: RichResultStorage) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const MOCK_SERP_RESULT: SerpAnalysisResult = {
  overview: [
    { featureType: 'Review Stars', competitorsWithFeature: 8, youHaveCount: 1, gap: 7, quickWinCount: 3 },
    { featureType: 'FAQ Dropdowns', competitorsWithFeature: 5, youHaveCount: 0, gap: 5, quickWinCount: 2 },
    { featureType: 'Sitelinks', competitorsWithFeature: 4, youHaveCount: 1, gap: 3, quickWinCount: 0 },
    { featureType: 'Image Thumbnails', competitorsWithFeature: 6, youHaveCount: 0, gap: 6, quickWinCount: 1 },
    { featureType: 'Breadcrumbs', competitorsWithFeature: 9, youHaveCount: 1, gap: 8, quickWinCount: 4 }
  ],
  competitorResults: [
    {
      domain: 'competitor-restoration.com',
      url: 'https://competitor-restoration.com/water-damage',
      keyword: 'water damage restoration',
      city: 'Arlington, VA',
      position: 1,
      richResults: [{ type: 'Review Stars', details: '4.9 stars (150 reviews)' }, { type: 'FAQ Dropdowns', details: '3 questions' }],
      schemaFound: [{ type: 'LocalBusiness', code: {}, isValid: true }, { type: 'FAQPage', code: {}, isValid: true }],
      analysisNotes: ['Strong local schema with aggregate rating', 'FAQ schema targets "cost" keywords']
    },
    {
      domain: 'national-pro-services.com',
      url: 'https://national-pro-services.com/locations/va/arlington',
      keyword: 'flood cleanup',
      city: 'Arlington, VA',
      position: 2,
      richResults: [{ type: 'Breadcrumbs', details: 'Home > Locations > VA > Arlington' }],
      schemaFound: [{ type: 'BreadcrumbList', code: {}, isValid: true }],
      analysisNotes: ['Clean breadcrumb structure']
    }
  ],
  quickWins: [
    {
      yourPage: '/water-damage-arlington',
      keyword: 'water damage restoration',
      yourPosition: 6,
      missingFeature: 'Review Stars',
      competitorWithFeature: { domain: 'competitor-restoration.com', position: 1 },
      priorityScore: 95
    },
    {
      yourPage: '/mold-remediation',
      keyword: 'mold remediation',
      yourPosition: 8,
      missingFeature: 'FAQ Dropdowns',
      competitorWithFeature: { domain: 'servpro-local.com', position: 3 },
      priorityScore: 88
    }
  ],
  yourPagesEligibility: [
    {
      page: '/water-damage-arlington',
      currentSchema: ['LocalBusiness'],
      eligibility: [
        { featureType: 'Review Stars', eligible: true, reason: 'Reviews visible on page', requirements: ['AggregateRating'], fix: 'Nest AggregateRating in LocalBusiness' },
        { featureType: 'FAQ Dropdowns', eligible: true, reason: 'Content structure supports FAQs', requirements: ['FAQPage'], fix: 'Add FAQPage schema' }
      ],
      issues: ['Missing AggregateRating', 'No FAQPage markup']
    }
  ],
  priorityActions: [
    { priority: 1, page: '/water-damage-arlington', action: 'Add AggregateRating Schema', position: 6, volume: 1200, ease: 'easy', score: 95 },
    { priority: 2, page: '/mold-remediation', action: 'Add FAQPage Schema', position: 8, volume: 450, ease: 'easy', score: 88 }
  ]
};

export const analyzeSerps = async (
  keywords: string[],
  cities: string[],
  yourDomain: string,
  yourPages: string[]
): Promise<SerpAnalysisResult> => {
  try {
    const prompt = `
Analyze Google SERPs for rich results and schema markup opportunities.

**Context:**
- Your Domain: ${yourDomain}
- Your Key Pages: ${yourPages.join(', ')}
- Target Keywords: ${keywords.slice(0, 5).join(', ')} (and similar)
- Target Cities: ${cities.slice(0, 3).join(', ')} (and similar)

**Task 1: Simulated SERP Analysis**
For the provided keywords and locations, simulate a Google Search and analyze the top 10 results.
Identify:
- Which competitors are displaying Rich Results (Review Stars, FAQs, Sitelinks, Image/Video Thumbnails, Breadcrumbs).
- Which of YOUR pages rank but are missing these features.

**Task 2: Schema Inference**
Based on the rich results displayed, infer the Schema Markup being used by competitors (e.g., if Stars are shown, they likely have AggregateRating inside LocalBusiness).

**Task 3: Gap Analysis & Quick Wins**
Identify specific opportunities where:
1. You rank on page 1 (positions 1-10).
2. A competitor (especially one ranking lower) has a rich result you lack.
3. Adding schema could help you capture that feature.

**Task 4: Eligibility Check**
For your provided pages, assess if they are likely eligible for:
- Review Stars (AggregateRating)
- FAQ Dropdowns (FAQPage)
- Breadcrumbs (BreadcrumbList)

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting):

{
  "overview": [
    { "featureType": "Review Stars", "competitorsWithFeature": 0, "youHaveCount": 0, "gap": 0, "quickWinCount": 0 },
    { "featureType": "FAQ Dropdowns", "competitorsWithFeature": 0, "youHaveCount": 0, "gap": 0, "quickWinCount": 0 },
    { "featureType": "Sitelinks", "competitorsWithFeature": 0, "youHaveCount": 0, "gap": 0, "quickWinCount": 0 },
    { "featureType": "Breadcrumbs", "competitorsWithFeature": 0, "youHaveCount": 0, "gap": 0, "quickWinCount": 0 },
    { "featureType": "Image Thumbnails", "competitorsWithFeature": 0, "youHaveCount": 0, "gap": 0, "quickWinCount": 0 }
  ],
  "competitorResults": [
    {
      "domain": "competitor.com",
      "url": "https://competitor.com/page",
      "keyword": "keyword",
      "city": "City",
      "position": 1,
      "richResults": [
        { "type": "Review Stars", "details": "4.9 stars (150 reviews)" }
      ],
      "schemaFound": [
        { "type": "LocalBusiness", "code": {}, "isValid": true }
      ],
      "analysisNotes": ["Uses aggregateRating nested in LocalBusiness"]
    }
  ],
  "quickWins": [
    {
      "yourPage": "/your-page",
      "keyword": "keyword",
      "yourPosition": 4,
      "missingFeature": "Review Stars",
      "competitorWithFeature": { "domain": "comp.com", "position": 6 },
      "priorityScore": 90
    }
  ],
  "yourPagesEligibility": [
    {
      "page": "/your-page",
      "currentSchema": ["LocalBusiness"],
      "eligibility": [
        { "featureType": "Review Stars", "eligible": false, "reason": "Missing AggregateRating", "requirements": ["Rating value", "Review count"], "fix": "Add AggregateRating schema" }
      ],
      "issues": ["Missing review markup"]
    }
  ],
  "priorityActions": [
    {
      "priority": 1,
      "page": "/your-page",
      "action": "Add AggregateRating Schema",
      "position": 4,
      "volume": 500,
      "ease": "easy",
      "score": 95
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
    return JSON.parse(cleanText) as SerpAnalysisResult;

  } catch (error) {
    console.warn("API Error, falling back to mock data:", error);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_SERP_RESULT;
  }
};

export const generateBulkSchema = async (pages: SchemaGenerationInput[]): Promise<GeneratedSchema[]> => {
  try {
    const prompt = `
Generate valid JSON-LD schema markup for the following pages.

Pages to Generate:
${JSON.stringify(pages, null, 2)}

**Requirements for EACH Page:**
1. **LocalBusiness**: Include full NAP, areaServed, openingHours (24/7).
2. **AggregateRating**: Nest inside LocalBusiness if rating info provided.
3. **FAQPage**: Generate if 'FAQPage' requested (use placeholder content if not provided).
4. **BreadcrumbList**: Generate if requested.

**Output:**
Return a JSON array of 'GeneratedSchema' objects.
Each object must have a 'combinedScript' property containing the full <script> tag ready to copy.
Ensure strict JSON validity.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText) as GeneratedSchema[];

  } catch (error) {
    console.error("Schema Generation Error:", error);
    throw error;
  }
};

// Storage Helpers
export const getLibrary = (): SchemaPattern[] => getStorage().library;
export const saveToLibrary = (pattern: SchemaPattern) => {
  const store = getStorage();
  store.library.push(pattern);
  saveStorage(store);
};

export const getHistory = (): RichResultHistoryEntry[] => getStorage().history;
export const getAlerts = (): RichResultAlert[] => getStorage().alerts;
export const markAlertRead = (id: string) => {
    const store = getStorage();
    const alert = store.alerts.find(a => a.id === id);
    if (alert) alert.read = true;
    saveStorage(store);
};

// Mock data generation for history if empty
export const initializeMockHistory = () => {
    const store = getStorage();
    if (store.history.length === 0) {
        store.history = [
            { id: '1', date: new Date(Date.now() - 86400000 * 2).toISOString(), domain: 'competitor.com', changeType: 'gained', keyword: 'water damage', city: 'Arlington', featureType: 'Review Stars', details: 'Added AggregateRating' },
            { id: '2', date: new Date(Date.now() - 86400000 * 5).toISOString(), domain: 'yoursite.com', changeType: 'lost', keyword: 'mold removal', city: 'McLean', featureType: 'FAQ Dropdown', details: 'Schema errors detected' },
        ];
        store.alerts = [
            { id: '1', type: 'competitor_gain', date: new Date().toISOString(), read: false, message: 'Competitor gained Review Stars in Arlington', details: { domain: 'comp.com' } }
        ];
        saveStorage(store);
    }
};