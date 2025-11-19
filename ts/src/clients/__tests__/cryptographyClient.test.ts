import { describe, expect, it } from "vitest";
import { CryptographyClient } from "../cryptography-client.js";
import { FakeRestClient } from "./test-utils.js";
import { RouteBuilder } from "../../http/route-builder.js";

const routeBuilder = new RouteBuilder("/api/v2");

describe("CryptographyClient", () => {
  it("calls public certificates endpoint", async () => {
    const rest = new FakeRestClient([]);
    const client = new CryptographyClient(rest, routeBuilder);

    const response = await client.getPublicCertificates();

    expect(response).toEqual([]);
    expect(rest.lastRequest?.path).toBe("/api/v2/security/public-key-certificates");
    expect(rest.lastRequest?.method).toBe("GET");
  });
});
