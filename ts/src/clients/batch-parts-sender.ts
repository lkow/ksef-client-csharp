import type { RestClientExecutor } from "../http/rest-client.js";
import { RestRequestWithBody } from "../http/rest-request.js";
import type { PackagePartSignatureInitResponseType } from "../models/sessions/batch-session.js";

export async function sendPackagePartsAsync<TInfo extends { ordinalNumber: number; data?: Uint8Array; dataStream?: BodyInit }>(
  restClient: RestClientExecutor,
  parts: readonly PackagePartSignatureInitResponseType[] | undefined,
  batchPartSendingInfos: readonly TInfo[] | undefined,
  contentFactory: (info: TInfo) => { body: BodyInit; contentType?: string; headers?: Record<string, string> },
  signal?: AbortSignal,
): Promise<void> {
  if (!restClient) {
    throw new Error("Rest client is required");
  }

  if (!parts) {
    throw new Error("Brak informacji o częściach paczki do wysłania.");
  }

  const errors: string[] = [];

  for (const part of parts) {
    const fileInfo = batchPartSendingInfos?.find((x) => x.ordinalNumber === part.ordinalNumber);
    if (!fileInfo) {
      errors.push(`Brak danych dla części paczki ${part.ordinalNumber}.`);
      continue;
    }

    if (!part.method?.trim()) {
      errors.push(`Brak metody HTTP dla części paczki ${part.ordinalNumber}.`);
      continue;
    }

    const { body, contentType, headers } = contentFactory(fileInfo);
    const request = RestRequestWithBody.new(part.url, part.method.toUpperCase() as typeof part.method, body);

    if (contentType) {
      request.withContentType(contentType);
    }

    if (part.headers) {
      for (const [name, value] of Object.entries(part.headers)) {
        request.addHeader(name, value);
      }
    }

    if (headers) {
      for (const [name, value] of Object.entries(headers)) {
        request.addHeader(name, value);
      }
    }

    try {
      await restClient.sendWithBody<void, BodyInit>(request, signal, "void");
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      errors.push(`Błąd wysyłki części paczki ${part.ordinalNumber}: ${reason}`);
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors.map((e) => new Error(e)), "Wystąpiły błędy podczas wysyłania części paczki.");
  }
}
