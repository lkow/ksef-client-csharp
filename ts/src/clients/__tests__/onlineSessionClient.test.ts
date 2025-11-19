import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../../http/route-builder.js";
import { OnlineSessionClient } from "../online-session-client.js";
import { FakeRestClient } from "./test-utils.js";

describe("OnlineSessionClient", () => {
  it("opens an online session", async () => {
    const rest = new FakeRestClient({ referenceNumber: "ref", validUntil: "2024-01-01T00:00:00Z" });
    const client = new OnlineSessionClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.openOnlineSessionAsync({ formCode: { code: "FA1" }, encryption: { key: "k", iv: "v" } }, "token");

    expect(rest.lastRequest?.path).toBe("/api/v2/sessions/online");
    expect(rest.lastRequest?.accessToken).toBe("token");
  });

  it("validates reference when closing", async () => {
    const client = new OnlineSessionClient({ restClient: new FakeRestClient(), routeBuilder: new RouteBuilder() });
    expect(() => client.closeOnlineSessionAsync("", "token")).toThrow(/Session reference number/);
  });
});
