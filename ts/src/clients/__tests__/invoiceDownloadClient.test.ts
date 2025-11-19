import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../../http/route-builder.js";
import { InvoiceDownloadClient } from "../invoice-download-client.js";
import { FakeRestClient } from "./test-utils.js";

describe("InvoiceDownloadClient", () => {
  it("requests invoice XML with proper accept header", async () => {
    const rest = new FakeRestClient("<xml />");
    const client = new InvoiceDownloadClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.getInvoiceAsync("123", "token");

    expect(rest.lastRequest?.headers["Accept"]).toBe("application/xml");
    expect(rest.lastResponseType).toBe("text");
    expect(rest.lastRequest?.path).toBe("/api/v2/invoices/ksef/123");
  });

  it("includes pagination and sort on metadata query", async () => {
    const rest = new FakeRestClient({ hasMore: false, isTruncated: false, invoices: [] });
    const client = new InvoiceDownloadClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.queryInvoiceMetadataAsync({ subjectType: "Subject1" }, "token", 1, 5, "Desc");

    expect(rest.lastRequest?.path).toContain("/api/v2/invoices/query/metadata?sortOrder=Desc");
    expect(rest.lastRequest?.path).toContain("pageOffset=1");
    expect(rest.lastRequest?.path).toContain("pageSize=5");
  });
});
