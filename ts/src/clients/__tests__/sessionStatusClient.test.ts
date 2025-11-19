import { describe, expect, it } from "vitest";
import { SessionStatusClient } from "../session-status-client.js";
import { RouteBuilder } from "../../http/route-builder.js";
import { FakeRestClient } from "./test-utils.js";

describe("SessionStatusClient", () => {
  it("builds session query with filter and pagination", async () => {
    const rest = new FakeRestClient({ sessions: [] });
    const client = new SessionStatusClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    const filter = {
      referenceNumber: "  ref-123  ",
      dateCreatedFrom: new Date(Date.UTC(2024, 0, 1, 10, 30, 15)),
      statuses: ["Succeeded", "Failed"],
    } as const;

    await client.getSessions("Online", "  token  ", {
      pageSize: 200,
      continuationToken: "\\u0042",
      filter,
    });

    expect(rest.lastRequest?.path).toBe(
      "/api/v2/sessions?sessionType=Online&pageSize=200&referenceNumber=ref-123&dateCreatedFrom=2024-01-01T10%3A30%3A15Z&statuses=Succeeded%2CFailed",
    );
    expect(rest.lastRequest?.headers["x-continuation-token"]).toBe("B");
  });

  it("fetches session invoices with pagination", async () => {
    const rest = new FakeRestClient({ invoices: [] });
    const client = new SessionStatusClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.getSessionInvoices("sess-1", "token", { pageSize: 10, continuationToken: "\\u0041" });

    expect(rest.lastRequest?.path).toBe("/api/v2/sessions/sess-1/invoices?pageSize=10");
    expect(rest.lastRequest?.headers["x-continuation-token"]).toBe("A");
  });

  it("requests UPO content as text", async () => {
    const rest = new FakeRestClient("<upo/>");
    const client = new SessionStatusClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.getSessionInvoiceUpoByReferenceNumber("sess", "inv", "token");
    expect(rest.lastResponseType).toBe("text");

    await client.getUpo("https://example.com/upo.xml");
    expect(rest.lastRequest?.path).toBe("https://example.com/upo.xml");
    expect(rest.lastResponseType).toBe("text");
  });
});
