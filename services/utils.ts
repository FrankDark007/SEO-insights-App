export const normalizeUrl = (input: string): string => {
  if (!input) return '';
  let url = input.trim();
  
  // Remove trailing slash
  url = url.replace(/\/+$/, '');
  
  // Add https:// if no protocol specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  return url;
};

export const isValidDomain = (input: string): boolean => {
  const normalized = normalizeUrl(input);
  try {
    const url = new URL(normalized);
    // Check if it has a valid domain structure (at least one dot)
    return url.hostname.includes('.');
  } catch {
    return false;
  }
};

export const extractJSON = (text: string): any => {
  if (!text) throw new Error("No text to parse");
  
  // First, try direct parse (in case it's already clean JSON)
  try {
    return JSON.parse(text);
  } catch {
    // Continue to extraction methods
  }

  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  
  // Try parsing after markdown removal
  try {
    return JSON.parse(cleaned.trim());
  } catch {
    // Continue to more aggressive extraction
  }

  // Find JSON object or array in the text
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    let jsonStr = jsonMatch[1];
    
    // Fix common issues: trailing commas before } or ]
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unescaped newlines in strings
    jsonStr = jsonStr.replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
      return `: "${p1}\\n${p2}"`;
    });
    
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON extraction failed:", e);
      console.error("Attempted to parse:", jsonStr.substring(0, 500));
    }
  }

  throw new Error("Could not extract valid JSON from response");
};