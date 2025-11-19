export function hasBody(response: Response, method: string): boolean {
  if (method.toUpperCase() === "HEAD") {
    return false;
  }

  if ((response.status >= 100 && response.status < 200) || response.status === 204 || response.status === 304) {
    return false;
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength != null) {
    return Number.parseInt(contentLength, 10) > 0;
  }

  return true;
}
