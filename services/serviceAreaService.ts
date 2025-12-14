import { GoogleGenAI } from "@google/genai";
import { LocationPagePlan } from "../types";
import { extractJSON } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateServiceAreaPlan = async (
  serviceAreas: string[],
  serviceType: string,
  businessName: string,
  phoneNumber: string
): Promise<LocationPagePlan[]> => {
  try {
    const prompt = `
You are a world-class local SEO expert. Generate a detailed location page content plan for a list of target cities.

**Business Details:**
- Business Name: ${businessName}
- Primary Service: ${serviceType}
- Phone Number: ${phoneNumber}
- Target Locations: ${serviceAreas.join(', ')}

**Task:**
For EACH location provided in the list, generate a strategic SEO plan containing:

1. **URL Structure**: Suggest a clean slug (e.g., /water-damage-restoration-arlington-va/).
2. **Title Tag**: Optimize for "Service + City + State" | Brand | Emergency CTA (max 60 chars).
3. **Meta Description**: Persuasive copy including city, service, phone, and CTA (max 155 chars).
4. **H1 Heading**: Natural phrase combining primary keyword and city.
5. **H2 Sections**: 5 distinct section headers tailored to the city context.
   - Specific service section
   - "Why choose us in [City]"
   - Process/Expectations
   - Service area coverage (mention neighborhoods)
   - FAQ for [City]
6. **Local Keywords**: 10 variations including "near me", neighborhood names, and emergency terms.
7. **Internal Link Targets**: Suggest 3-4 other nearby cities from the provided list to link to for cluster authority.
8. **Local Proof Points**: Specific landmarks, zip codes, and neighborhood names actual locals would recognize.
9. **Schema Markup**: A complete, valid JSON-LD object for 'LocalBusiness' (or 'EmergencyService'/'HomeAndConstructionBusiness').
   - Include: @type, name, telephone, url (placeholder), areaServed (City), geo (approximate lat/long if possible, or omit), openingHours (24/7), priceRange ($$).
10. **Word Count Target**: Estimated word count needed to rank based on typical local competition (e.g., 800-1200).

**Output Format:**
Return ONLY a valid JSON array of objects. Do not include markdown formatting like \`\`\`json. The structure must match exactly:

[
  {
    "city": "Arlington",
    "state": "VA",
    "urlSlug": "...",
    "titleTag": "...",
    "metaDescription": "...",
    "h1": "...",
    "h2Sections": ["...", "..."],
    "localKeywords": ["...", "..."],
    "internalLinks": ["...", "..."],
    "schema": { ... },
    "wordCountTarget": 1000,
    "localProofPoints": ["...", "..."],
    "nearbyAreas": ["...", "..."]
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");

    return extractJSON(text) as LocationPagePlan[];
  } catch (error) {
    console.error("Service Area Plan Generation Error:", error);
    throw error;
  }
};