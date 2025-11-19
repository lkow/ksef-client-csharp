import { describe, expect, it } from "vitest";
import { LimitsClient } from "../limits-client.js";
import { RouteBuilder } from "../../http/route-builder.js";
import { FakeRestClient } from "./test-utils.js";

describe("LimitsClient", () => {
  it("fetches context limits", async () => {
    const fakeResponse = { onlineSession: { maxInvoices: 1, maxInvoiceSizeInMB: 2, maxInvoiceWithAttachmentSizeInMB: 3 } };
    const fakeRest = new FakeRestClient(fakeResponse);
    const client = new LimitsClient({ restClient: fakeRest, routeBuilder: new RouteBuilder() });

    const result = await client.getLimitsForCurrentContext("token-123");

    expect(result).toEqual(fakeResponse);
    expect(fakeRest.lastRequest?.path).toEqual("/api/v2/limits/context");
    expect(fakeRest.lastRequest?.method).toEqual("GET");
    expect(fakeRest.lastRequest?.accessToken).toEqual("token-123");
  });

  it("fetches rate limits", async () => {
    const fakeResponse = { other: { perMinute: 10, perSecond: 1, perHour: 100 } };
    const fakeRest = new FakeRestClient(fakeResponse);
    const client = new LimitsClient({ restClient: fakeRest, routeBuilder: new RouteBuilder() });

    const result = await client.getRateLimits("token-abc");

    expect(result).toEqual(fakeResponse);
    expect(fakeRest.lastRequest?.path).toEqual("/api/v2/rate-limits");
  });
});
