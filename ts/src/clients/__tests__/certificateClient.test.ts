import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../../http/route-builder.js";
import { CertificateClient } from "../certificate-client.js";
import { FakeRestClient } from "./test-utils.js";

describe("CertificateClient", () => {
  it("requests metadata with pagination", async () => {
    const rest = new FakeRestClient({ certificates: [], hasMore: false });
    const client = new CertificateClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.getCertificateMetadataListAsync("token", undefined, 25, 5);

    expect(rest.lastRequest?.path).toContain("/api/v2/certificates/query");
    expect(rest.lastRequest?.path).toContain("pageOffset=5");
    expect(rest.lastRequest?.path).toContain("pageSize=25");
  });

  it("validates serial number when revoking", async () => {
    const client = new CertificateClient({ restClient: new FakeRestClient(), routeBuilder: new RouteBuilder() });
    expect(() => client.revokeCertificateAsync({ revokeReason: "" }, "", "token")).toThrow(/serial number/);
  });
});
