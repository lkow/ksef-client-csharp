import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../../http/route-builder.js";
import type { AuthenticationChallengeResponse } from "../../models/authorization/authentication-challenge.js";
import { type InvoiceQueryFilters } from "../../models/invoices/invoice-query-filters.js";
import { createKsefClient } from "../ksef-client.js";
import { FakeRestClient } from "./test-utils.js";

describe("KsefClient", () => {
  it("delegates to underlying clients using provided route builder", async () => {
    const fakeResponse: AuthenticationChallengeResponse = {
      authToken: "token",
      challenge: "challenge",
      timestamp: new Date().toISOString(),
    };
    const rest = new FakeRestClient(fakeResponse);
    const client = createKsefClient({
      restClient: rest,
      routeBuilder: new RouteBuilder({ apiPrefix: "custom", defaultVersion: "v9" }),
    });

    await client.getAuthChallenge();

    expect(rest.lastRequest?.path).toBe("/custom/v9/auth/challenge");
  });

  it("reuses shared transport across different operations", async () => {
    const rest = new FakeRestClient({});
    const client = createKsefClient({ restClient: rest, routeBuilder: new RouteBuilder() });
    const filters: InvoiceQueryFilters = { invoiceNumber: "123" };

    await client.queryInvoiceMetadataAsync(filters, "token", 0, 50);

    expect(rest.lastRequest?.path).toBe("/api/v2/invoices/query/metadata?sortOrder=Asc&pageSize=50");
    expect(rest.lastRequest?.accessToken).toBe("token");
  });
});
