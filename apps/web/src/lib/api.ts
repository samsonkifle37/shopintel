const defaultBase = import.meta.env.VITE_API_BASE_URL?.trim() || "";

export function apiUrl(path: string) {
  if (!defaultBase) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${defaultBase}${normalizedPath}`;
}
