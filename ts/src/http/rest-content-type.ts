export enum RestContentType {
  Json = "application/json",
  Xml = "application/xml",
}

export const RestContentTypeExtensions = {
  DefaultContentType: RestContentType.Json,
  isDefaultType(contentType?: string | RestContentType): boolean {
    if (!contentType) return true;
    const normalized = RestContentTypeExtensions.getBaseMime(
      typeof contentType === "string" ? contentType : contentType.valueOf(),
    );
    return normalized.toLowerCase() === RestContentType.Json;
  },
  toMime(contentType: RestContentType): string {
    return contentType;
  },
  toRestContentType(mime: string): RestContentType {
    const baseMime = RestContentTypeExtensions.getBaseMime(mime).toLowerCase();
    if (baseMime === RestContentType.Json) return RestContentType.Json;
    if (baseMime === RestContentType.Xml) return RestContentType.Xml;
    throw new Error(`Unsupported mime type: '${mime}'`);
  },
  tryToRestContentType(mime: string | undefined | null): RestContentType | undefined {
    if (!mime) return undefined;
    const baseMime = RestContentTypeExtensions.getBaseMime(mime).toLowerCase();
    if (baseMime === RestContentType.Json) return RestContentType.Json;
    if (baseMime === RestContentType.Xml) return RestContentType.Xml;
    return undefined;
  },
  getBaseMime(mime?: string | RestContentType): string {
    if (!mime) return RestContentType.Json;
    const raw = typeof mime === "string" ? mime : mime.valueOf();
    const trimmed = raw.trim();
    const semicolonIndex = trimmed.indexOf(";");
    return (semicolonIndex >= 0 ? trimmed.slice(0, semicolonIndex) : trimmed).trim();
  },
};
