import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../../http/route-builder.js";
import { PeppolClient } from "../peppol-client.js";
import { FakeRestClient } from "./test-utils.js";

describe("PeppolClient", () => {
  it("builds query with pagination", async () => {
    const rest = new FakeRestClient({ hasMore: false, providers: [] });
    const client = new PeppolClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.queryPeppolProvidersAsync("token", 2, 10);

    expect(rest.lastRequest?.path).toContain("/api/v2/peppol/query");
    expect(rest.lastRequest?.path).toContain("pageOffset=2");
    expect(rest.lastRequest?.path).toContain("pageSize=10");
  });
});
