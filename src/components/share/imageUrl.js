export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://10.0.60.126:7000";
    return `${baseUrl}/${path}`;
  }
};

export function getVideoAndThumbnail(url) {
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}
