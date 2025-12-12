import { GoogleGenAI } from "@google/genai";
import { WeatherCheckResult, TriggerConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const CONFIG_STORAGE_KEY = "seo_insight_weather_triggers";

const DEFAULT_TRIGGERS: TriggerConfig[] = [
  { id: '1', type: 'Pipe Freeze', condition: 'Temp < 32°F for 8+ hrs', riskLevel: 'high', enabled: true },
  { id: '2', type: 'Hard Freeze', condition: 'Temp < 20°F', riskLevel: 'critical', enabled: true },
  { id: '3', type: 'Heavy Rain', condition: '>1.5" in 24hrs', riskLevel: 'medium', enabled: true },
  { id: '4', type: 'Flash Flood', condition: 'Flash flood warning', riskLevel: 'critical', enabled: true },
  { id: '5', type: 'Hurricane', condition: 'Hurricane watch/warning', riskLevel: 'critical', enabled: true },
  { id: '6', type: 'Spring Thaw', condition: 'Freeze then >40°F rapid', riskLevel: 'high', enabled: true },
];

export const getTriggerConfiguration = (): TriggerConfig[] => {
  const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_TRIGGERS;
};

export const saveTriggerConfiguration = (config: TriggerConfig[]) => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

export const checkWeatherConditions = async (cities: string[]): Promise<WeatherCheckResult> => {
  try {
    const prompt = `
Monitor weather conditions and generate water damage risk alerts for a restoration company.
Service Area Cities:
${cities.join(', ')}

**Task 1: Current Conditions**
Search for current weather in each city:
- Temperature (actual and feels like)
- Current conditions (clear, rain, snow, etc.)
- Humidity
- Wind speed
- Any active weather warnings

**Task 2: 7-Day Forecast**
For each city, get the 7-day forecast:
- Daily high/low temperatures
- Conditions
- Precipitation chance and amount
- Any forecast warnings

**Task 3: Risk Assessment**
Analyze conditions against these water damage triggers:
- FREEZE RISK: Temperature below 32°F for 8+ hours = HIGH risk (pipe freeze). Temp below 20°F = CRITICAL (hard freeze).
- FLOODING RISK: Rainfall >1.5" in 24h = MEDIUM. >3" = HIGH. Flash flood warning = CRITICAL.
- THAW RISK: Temp rising from below freezing to above 40°F rapidly = HIGH. Snow melt >6" = MEDIUM.
- STORM RISK: High winds, hurricane warning, severe thunderstorms.

**Task 4: Generate Alerts**
For each active or upcoming risk event, create an alert object.
For each alert, generate campaign templates (Ads, Email, GBP, Social, Banner, SMS).

**Output JSON Format:**
Return valid JSON matching this structure exactly (no markdown formatting like \`\`\`json):

{
  "currentConditions": [
    {
      "city": "City Name",
      "state": "State",
      "temperature": 72,
      "feelsLike": 70,
      "conditions": "Clear",
      "humidity": 45,
      "windSpeed": 5,
      "riskLevel": "low", // low, medium, high, critical
      "activeTriggers": []
    }
  ],
  "forecast": [
    {
      "city": "City Name",
      "daily": [
        {
          "date": "2023-10-27",
          "high": 65,
          "low": 45,
          "conditions": "Cloudy",
          "precipChance": 20,
          "precipAmount": 0,
          "riskLevel": "low",
          "riskType": "none"
        }
        // ... 7 days
      ]
    }
  ],
  "activeAlerts": [
    {
      "id": "unique-id",
      "type": "freeze", // freeze, hard_freeze, rain, flood, hurricane, thaw, snow_melt, storm
      "severity": "high", // medium, high, critical
      "title": "Freeze Warning",
      "affectedCities": ["City A", "City B"],
      "startTime": "...",
      "endTime": "...",
      "description": "...",
      "recommendedActions": ["Action 1", "Action 2"],
      "campaignTemplates": {
        "googleAds": { "headlines": ["...", "..."], "descriptions": ["...", "..."] },
        "email": { "subjectLines": ["...", "..."], "bodyHtml": "..." },
        "gbpPost": "...",
        "socialPosts": [{ "platform": "Facebook", "text": "..." }],
        "homepageBanner": "...",
        "smsTemplate": "..."
      },
      "acknowledged": false
    }
  ],
  "upcomingRisks": [
    {
      "date": "2023-10-28",
      "cities": ["City A"],
      "riskType": "Heavy Rain",
      "riskLevel": "medium",
      "description": "..."
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
    const result = JSON.parse(cleanText) as WeatherCheckResult;
    
    // Assign IDs if missing
    result.activeAlerts.forEach(alert => {
        if (!alert.id) alert.id = Math.random().toString(36).substr(2, 9);
        if (alert.acknowledged === undefined) alert.acknowledged = false;
    });

    return result;

  } catch (error) {
    console.error("Weather Check Error:", error);
    throw error;
  }
};