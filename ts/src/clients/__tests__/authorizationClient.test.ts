import { describe, expect, it } from "vitest";
import { AuthorizationClient } from "../authorization-client.js";
import type { SignatureResponse } from "../../models/authorization/operation-tokens.js";
import { RouteBuilder } from "../../http/route-builder.js";
import { RestRequestWithBody } from "../../http/rest-request.js";
import { FakeRestClient } from "./test-utils.js";

const buildClient = (response: unknown = {} as SignatureResponse) => {
  const rest = new FakeRestClient(response);
  return {
    rest,
    client: new AuthorizationClient({ restClient: rest, routeBuilder: new RouteBuilder() }),
  };
};

describe("AuthorizationClient", () => {
  it("fetches auth challenge", async () => {
    const { client, rest } = buildClient({ challenge: "abc", timestamp: new Date("2024-01-01T00:00:00Z") });

    const result = await client.getAuthChallenge();

    expect(result.challenge).toEqual("abc");
    expect(rest.lastRequest?.path).toEqual("/api/v2/auth/challenge");
    expect(rest.lastRequest?.method).toEqual("POST");
  });

  it("submits signed xml with default verification flag", async () => {
    const fakeResponse: SignatureResponse = {
      authenticationToken: { token: "token", validUntil: new Date() },
      referenceNumber: "ref",
    };
    const { client, rest } = buildClient(fakeResponse);

    const result = await client.submitXadesAuthRequest("<xml/>");

    expect(result).toEqual(fakeResponse);
    expect(rest.lastRequest).toBeInstanceOf(RestRequestWithBody);
    expect(rest.lastRequest?.path).toContain("verifyCertificateChain=false");
    expect((rest.lastRequest as RestRequestWithBody<string>).body).toEqual("<xml/>");
    expect(rest.lastRequest?.method).toEqual("POST");
  });

  it("submits signed xml with certificate verification enabled", async () => {
    const { client, rest } = buildClient({});

    await client.submitXadesAuthRequest("<xml/>", true);

    expect(rest.lastRequest?.path).toEqual("/api/v2/auth/xades-signature?verifyCertificateChain=true");
    expect(rest.lastRequest).toBeInstanceOf(RestRequestWithBody);
    expect((rest.lastRequest as RestRequestWithBody<string>).contentType).toEqual("application/xml");
  });

  it("rejects invalid xml payload", async () => {
    const { client } = buildClient();

    await expect(client.submitXadesAuthRequest("   ")).rejects.toThrow("signedXml cannot be empty");
  });

  it("requests auth status with token", async () => {
    const { client, rest } = buildClient({ status: { code: "IN_PROGRESS" } });

    await client.getAuthStatus("ref/123", "auth-token");

    expect(rest.lastRequest?.path).toEqual("/api/v2/auth/ref%2F123");
    expect(rest.lastRequest?.method).toEqual("GET");
    expect(rest.lastRequest?.accessToken).toEqual("auth-token");
  });

  it("redeems token and refreshes token", async () => {
    const { client, rest } = buildClient({});

    await client.getAccessToken("auth-token");
    expect(rest.lastRequest?.path).toEqual("/api/v2/auth/token/redeem");
    expect(rest.lastRequest?.accessToken).toEqual("auth-token");

    await client.refreshAccessToken("refresh-token");
    expect(rest.lastRequest?.path).toEqual("/api/v2/auth/token/refresh");
    expect(rest.lastRequest?.accessToken).toEqual("refresh-token");
  });
});
