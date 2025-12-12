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
