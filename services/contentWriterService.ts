import { GoogleGenAI } from "@google/genai";
import { GeneratedContent, ContentRequest, SavedContent } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const LIBRARY_STORAGE_KEY = "seo_insight_content_library";

export const getLibrary = (): SavedContent[] => {
  const data = localStorage.getItem(LIBRARY_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveToLibrary = (content: GeneratedContent, request: ContentRequest) => {
  const library = getLibrary();
  const newItem: SavedContent = {
    id: content.id,
    title: content.title,
    keyword: request.keyword,
    type: request.contentType,
    location: request.location || '',
    createdAt: new Date().toISOString(),
    wordCount: content.analysis.wordCount,
    status: 'draft',
    data: content
  };
  
  // Update if exists, else add
  const index = library.findIndex(item => item.id === content.id);
  if (index >= 0) {
    library[index] = newItem;
  } else {
    library.unshift(newItem);
  }
  
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
};

export const deleteFromLibrary = (id: string) => {
  const library = getLibrary();
  const updated = library.filter(item => item.id !== id);
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(updated));
};

export const generateContent = async (request: ContentRequest): Promise<GeneratedContent> => {
  try {
    const prompt = `
Generate SEO-optimized content for a water damage restoration company.

**Content Parameters:**
- Target Keyword: ${request.keyword}
- Content Type: ${request.contentType}
- Target Location: ${request.location || 'General'}
- Word Count Target: ${request.wordCount}
- Tone: ${request.tone}
- Business Name: ${request.businessName}
- Phone Number: ${request.phoneNumber}

${request.briefData ? `**Content Brief Data:**\n${JSON.stringify(request.briefData, null, 2)}` : ''}

**Content Requirements:**
1. **Title/H1**: Include primary keyword and location. Make it compelling.
2. **Introduction**: Hook with urgency, establish expertise, include keyword, mention location, soft CTA.
3. **Why Choose Us**: 4-5 differentiators, IICRC cert, local experience, insurance expertise.
4. **Service/Process**: Numbered steps, technical credibility, timeline.
5. **Local Section**: Neighborhoods, landmarks, local causes, response time.
6. **FAQ Section**: 5+ questions (H3), include cost, insurance, timeline.
7. **Call to Action**: Urgent, phone number prominent.

**Formatting Requirements:**
- Use H2 for main sections, H3 for subsections.
- Use bullet points and bold key terms.
- Include [INTERNAL LINK: page-name] placeholders.
- Natural keyword placement.

**Output Format:**
Return a valid JSON object matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "title": "Page Title H1",
  "content": "Full markdown content string...",
  "sections": [
    { "id": "intro", "name": "Introduction", "content": "Markdown for intro..." },
    { "id": "why-us", "name": "Why Choose Us", "content": "Markdown for section..." },
    { "id": "process", "name": "Our Process", "content": "Markdown..." },
    { "id": "local", "name": "Local Service Area", "content": "Markdown..." },
    { "id": "faq", "name": "FAQ", "content": "Markdown..." },
    { "id": "cta", "name": "Call to Action", "content": "Markdown..." }
  ],
  "analysis": {
    "wordCount": 0,
    "primaryKeywordCount": 0,
    "secondaryKeywordCount": 0,
    "h2Count": 0,
    "h3Count": 0,
    "internalLinkOpportunities": ["link 1", "link 2"],
    "faqCount": 0,
    "readingLevel": 0,
    "localMentions": 0
  },
  "seoChecklist": [
    { "item": "Primary keyword in H1", "passed": true }
  ],
  "metaData": {
    "titleTag": "...",
    "titleLength": 0,
    "metaDescription": "...",
    "metaLength": 0,
    "urlSlug": "..."
  },
  "schema": {
    "localBusiness": {},
    "service": {},
    "faq": {},
    "breadcrumb": {}
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");

    const result = extractJSON(text) as GeneratedContent;
    
    // Add ID and timestamp
    result.id = Math.random().toString(36).substr(2, 9);
    result.createdAt = new Date().toISOString();

    return result;

  } catch (error) {
    console.error("Content Generation Error:", error);
    throw error;
  }
};