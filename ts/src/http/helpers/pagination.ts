export function appendPagination(
  path: string,
  pageOffset?: number | null,
  pageSize?: number | null,
): string {
  let result = path;
  if (pageSize != null && pageSize > 0) {
    result = appendQuery(result, "pageSize", pageSize.toString());
  }
  if (pageOffset != null && pageOffset > 0) {
    result = appendQuery(result, "pageOffset", pageOffset.toString());
  }
  return result;
}

function appendQuery(path: string, key: string, value: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}
