export interface ApiExceptionDetail {
  exceptionCode: number;
  exceptionDescription?: string;
  details?: string[];
}

export interface ApiExceptionContent {
  exceptionDetailList?: ApiExceptionDetail[];
  serviceCode?: string;
  timestamp?: string;
  serviceName?: string;
  referenceNumber?: string;
  serviceCtx?: string;
}

export interface ApiErrorResponse {
  exception?: ApiExceptionContent;
}

export function buildApiErrorMessage(
  error: ApiErrorResponse | undefined,
  fallback: () => string,
): string {
  if (error?.exception?.exceptionDetailList?.length) {
    const parts = error.exception.exceptionDetailList
      .map((detail) => {
        const head = [detail.exceptionCode?.toString() ?? ""].filter(Boolean);
        if (detail.exceptionDescription) {
          const normalized = detail.exceptionDescription.trim();
          head.push(normalized.endsWith(".") ? normalized : `${normalized}.`);
        }
        const detailText = detail.details?.filter((item) => item && item.trim().length > 0).join(" - ");
        if (detailText) {
          head.push(`- ${detailText}`);
        }
        return head.join(" ").trim();
      })
      .filter((segment) => segment.length > 0);

    if (parts.length > 0) {
      return parts.join("; ");
    }
  }

  const meta: string[] = [];
  const exception = error?.exception;
  if (exception?.serviceName) meta.push(`service=${exception.serviceName}`);
  if (exception?.serviceCode) meta.push(`serviceCode=${exception.serviceCode}`);
  if (exception?.referenceNumber) meta.push(`ref=${exception.referenceNumber}`);
  if (exception?.timestamp) meta.push(`ts=${exception.timestamp}`);
  if (exception?.serviceCtx) meta.push(`ctx=${exception.serviceCtx}`);
  if (meta.length > 0) {
    return meta.join(", ");
  }

  return fallback();
}
