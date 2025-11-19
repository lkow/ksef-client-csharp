import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../../http/route-builder.js";
import { BatchSessionClient } from "../batch-session-client.js";
import { FakeRestClient } from "./test-utils.js";

const sampleResponse = {
  referenceNumber: "batch-ref",
  partUploadRequests: [
    { ordinalNumber: 1, method: "put", url: "https://upload/1", headers: { "content-type": "application/octet-stream" } },
  ],
};

describe("BatchSessionClient", () => {
  it("opens and closes a batch session", async () => {
    const rest = new FakeRestClient(sampleResponse);
    const client = new BatchSessionClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.openBatchSessionAsync(
      { formCode: { code: "FA" }, batchFile: { fileHash: "h", fileSize: 1, fileParts: [] }, encryption: { key: "k", iv: "v" } },
      "token",
    );

    expect(rest.lastRequest?.path).toBe("/api/v2/sessions/batch");

    await client.closeBatchSessionAsync("batch-ref", "token");
    expect(rest.lastRequest?.path).toBe("/api/v2/sessions/batch/batch-ref/close");
  });

  it("throws when no parts are provided", async () => {
    const client = new BatchSessionClient({ restClient: new FakeRestClient(sampleResponse), routeBuilder: new RouteBuilder() });
    await expect(client.sendBatchPartsAsync(sampleResponse as never, [], undefined)).rejects.toThrow(/Brak plików/);
  });
});
