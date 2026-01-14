export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://10.10.7.48:7000";
    // const baseUrl = "https://api.yogawithjen.life";
    return `${baseUrl}/${path}`;
  }
};


export function getVideoAndThumbnail(url) {
  if (!url) return ''; // handle undefined/null cases
  
  // Convert to string and trim whitespace
  let cleanUrl = String(url).trim();
  
  if (!cleanUrl) return '';
  
  // Remove ALL protocol prefixes first (handles any number of duplicates)
  // This regex matches one or more occurrences of http:// or https:// at the start
  cleanUrl = cleanUrl.replace(/^(https?:\/\/)+/i, '');
  
  // Now add a single https:// prefix
  // This makes the function idempotent - calling it multiple times gives same result
  cleanUrl = `https://${cleanUrl}`;
  
  return cleanUrl;
}
