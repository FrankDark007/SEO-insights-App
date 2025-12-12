import { GoogleGenAI } from "@google/genai";
import { AlertCheckResult, StoredAlertData, CompetitorSnapshot, Alert } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const STORAGE_KEY = "seo_insight_alert_data";

const DEFAULT_DATA: StoredAlertData = {
  competitors: [],
  alerts: [],
  preferences: {
    monitorNewPages: true,
    monitorTitles: true,
    monitorMeta: true,
    monitorBacklinks: true,
    monitorReviews: true,
    monitorGBP: true,
    monitorSchema: true,
  },
  lastFullCheck: new Date().toISOString(),
};

export const getStoredAlertData = (): StoredAlertData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_DATA;
};

export const saveAlertData = (data: StoredAlertData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addCompetitor = (domain: string) => {
  const data = getStoredAlertData();
  if (!data.competitors.find((c) => c.domain === domain)) {
    data.competitors.push({ domain, active: true, snapshots: [] });
    saveAlertData(data);
  }
};

export const removeCompetitor = (domain: string) => {
  const data = getStoredAlertData();
  data.competitors = data.competitors.filter((c) => c.domain !== domain);
  saveAlertData(data);
};

export const markAlertAddressed = (alertId: string) => {
  const data = getStoredAlertData();
  const alert = data.alerts.find((a) => a.id === alertId);
  if (alert) {
    alert.addressed = true;
    saveAlertData(data);
  }
};

export const checkCompetitor = async (
  domain: string,
  previousSnapshot: CompetitorSnapshot | null
): Promise<AlertCheckResult> => {
  try {
    const prompt = `
Check competitor website for changes.
Competitor: ${domain}
Previous Snapshot Date: ${previousSnapshot ? previousSnapshot.takenAt : "None (Baseline Check)"}
Previous State:
${previousSnapshot ? JSON.stringify(previousSnapshot, null, 2) : "No previous snapshot available. Establish baseline."}

**Task 1: Current Page Inventory**
Search/crawl ${domain} and identify:
- All main service pages
- Key location pages (cities/service areas)
- Landing pages

For each page found, capture:
- URL
- Title tag
- Meta description
- H1 heading
- Schema types present (e.g., LocalBusiness, Service, FAQ)

**Task 2: Compare to Previous**
If a previous snapshot exists, identify changes:
- New pages
- Removed pages
- Title changes
- Meta description changes
- Schema changes

**Task 3: GBP Check**
Search for "${domain}" Google Business Profile:
- Current review count
- Current rating
- Most recent post date (if visible)

**Task 4: Estimate Backlink Changes**
Estimate if there's significant recent backlink activity (e.g., news mentions, new directories).

**Task 5: Generate Alerts**
For each change detected (or baseline establishment), create an alert with:
- Change type (new_page, title_change, review_change, etc.)
- Severity (high/medium/low)
- Details (old vs new)
- Recommended response

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "domain": "${domain}",
  "checkedAt": "${new Date().toISOString()}",
  "alerts": [
    {
      "id": "generated_uuid",
      "type": "new_page", // or baseline, title_change, etc.
      "severity": "high",
      "competitor": "${domain}",
      "details": {
        "url": "https://...",
        "newValue": "...",
        "oldValue": "..."
      },
      "detectedAt": "${new Date().toISOString()}",
      "recommendedResponse": "...",
      "addressed": false
    }
  ],
  "currentSnapshot": {
    "domain": "${domain}",
    "takenAt": "${new Date().toISOString()}",
    "pages": [
      {
        "url": "...",
        "title": "...",
        "metaDescription": "...",
        "h1": "...",
        "schemaTypes": ["..."]
      }
    ],
    "gbpData": {
      "reviewCount": 0,
      "rating": 0,
      "lastPostDate": "..."
    },
    "estimatedBacklinks": 0
  }
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
    const result = JSON.parse(cleanText) as AlertCheckResult;

    // Ensure IDs are unique if AI generated duplicates or placeholders
    result.alerts.forEach((a) => {
        a.id = `${domain}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    });

    return result;
  } catch (error) {
    console.error(`Error checking competitor ${domain}:`, error);
    throw error;
  }
};

export const runFullCheck = async (): Promise<Alert[]> => {
    const data = getStoredAlertData();
    const newAlerts: Alert[] = [];

    for (const comp of data.competitors) {
        if (!comp.active) continue;

        // Get last snapshot
        const lastSnapshot = comp.snapshots.length > 0 ? comp.snapshots[comp.snapshots.length - 1] : null;
        
        try {
            const result = await checkCompetitor(comp.domain, lastSnapshot);
            
            // Filter alerts based on preferences
            const filteredAlerts = result.alerts.filter(a => {
                if (a.type === 'new_page' && !data.preferences.monitorNewPages) return false;
                if (a.type === 'title_change' && !data.preferences.monitorTitles) return false;
                if (a.type === 'meta_change' && !data.preferences.monitorMeta) return false;
                if (a.type === 'new_backlink' && !data.preferences.monitorBacklinks) return false;
                if ((a.type === 'review_change' || a.type === 'rating_change') && !data.preferences.monitorReviews) return false;
                if (a.type === 'gbp_post' && !data.preferences.monitorGBP) return false;
                if (a.type === 'schema_change' && !data.preferences.monitorSchema) return false;
                return true;
            });

            newAlerts.push(...filteredAlerts);
            data.alerts.unshift(...filteredAlerts);
            
            // Save snapshot (keep last 2)
            comp.snapshots.push(result.currentSnapshot);
            if (comp.snapshots.length > 2) comp.snapshots.shift();

        } catch (e) {
            console.error(`Failed check for ${comp.domain}`, e);
        }
    }

    data.lastFullCheck = new Date().toISOString();
    saveAlertData(data);
    return newAlerts;
};