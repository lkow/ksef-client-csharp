export function withQuery(path: string, query: Record<string, string | undefined> | undefined, baseUrl?: string): string {
  const base = baseUrl ? baseUrl.replace(/\/+$/, "") : undefined;
  const normalizedPath = /^(https?:)?\/\//i.test(path)
    ? path
    : base
      ? `${base}/${path.replace(/^\/+/, "")}`
      : path;
  const absolute = normalizedPath;
  if (!query || Object.keys(query).length === 0) {
    return absolute;
  }

  const queryParams = Object.entries(query).map(([key, value]) =>
    `${encodeURIComponent(key)}=${encodeURIComponent(value ?? "")}`,
  );
  const separator = absolute.includes("?") ? "&" : "?";
  return `${absolute}${separator}${queryParams.join("&")}`;
}
