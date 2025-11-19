import { describe, expect, it } from "vitest";
import { ActiveSessionsClient } from "../active-sessions-client.js";
import { RouteBuilder } from "../../http/route-builder.js";
import { FakeRestClient } from "./test-utils.js";

describe("ActiveSessionsClient", () => {
  it("queries active sessions with pagination and continuation token", async () => {
    const fakeResponse = { continuationToken: "ct", items: [] };
    const fakeRest = new FakeRestClient(fakeResponse);
    const client = new ActiveSessionsClient({ restClient: fakeRest, routeBuilder: new RouteBuilder() });

    const result = await client.getActiveSessions("  bearer-token  ", { pageSize: 25, continuationToken: "\\u0041" });

    expect(result).toEqual(fakeResponse);
    expect(fakeRest.lastRequest?.path).toBe("/api/v2/auth/sessions?pageSize=25");
    expect(fakeRest.lastRequest?.headers["x-continuation-token"]).toBe("A");
    expect(fakeRest.lastRequest?.accessToken).toBe("bearer-token");
  });

  it("revokes a session", async () => {
    const fakeRest = new FakeRestClient();
    const client = new ActiveSessionsClient({ restClient: fakeRest, routeBuilder: new RouteBuilder() });

    await client.revokeSession("  ABC/123  ", "token");

    expect(fakeRest.lastRequest?.path).toBe("/api/v2/auth/sessions/ABC%2F123");
    expect(fakeRest.lastRequest?.method).toBe("DELETE");
  });
});
