import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../../http/route-builder.js";
import { TestDataClient } from "../test-data-client.js";
import { FakeRestClient } from "./test-utils.js";

describe("TestDataClient", () => {
  it("calls restore rate limits with delete", async () => {
    const rest = new FakeRestClient();
    const client = new TestDataClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.restoreRateLimitsAsync("token");

    expect(rest.lastRequest?.path).toBe("/api/v2/testdata/rate-limits");
    expect(rest.lastRequest?.method).toBe("DELETE");
  });

  it("sends change session limits with token", async () => {
    const rest = new FakeRestClient();
    const client = new TestDataClient({ restClient: rest, routeBuilder: new RouteBuilder() });

    await client.changeSessionLimitsInCurrentContextAsync({ sessionLimitPerDay: 1 }, "token");

    expect(rest.lastRequest?.accessToken).toBe("token");
    expect(rest.lastRequest?.path).toBe("/api/v2/testdata/limits/context/session");
  });
});
