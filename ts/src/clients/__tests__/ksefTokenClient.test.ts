import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../../http/route-builder.js";
import { FakeRestClient } from "./test-utils.js";
import { KsefTokenClient } from "../ksef-token-client.js";
import type { QueryKsefTokensResponse } from "../../models/authorization/ksef-token.js";

const buildClient = (response: unknown = {}): { client: KsefTokenClient; rest: FakeRestClient } => {
  const rest = new FakeRestClient(response);
  return {
    rest,
    client: new KsefTokenClient({ restClient: rest, routeBuilder: new RouteBuilder() }),
  };
};

describe("KsefTokenClient", () => {
  it("generates token with payload", async () => {
    const { client, rest } = buildClient({ referenceNumber: "ref", token: "token" });
    const request = { permissions: ["InvoiceRead"], description: "desc" };

    const response = await client.generateKsefToken(request, " access ");

    expect(response).toEqual({ referenceNumber: "ref", token: "token" });
    expect(rest.lastRequest?.path).toEqual("/api/v2/tokens");
    expect(rest.lastRequest?.method).toEqual("POST");
    expect(rest.lastRequest?.accessToken).toEqual("access");
  });

  it("builds complex query with pagination and continuation token", async () => {
    const fakeResponse: QueryKsefTokensResponse = { continuationToken: undefined, tokens: [] };
    const { client, rest } = buildClient(fakeResponse);

    const result = await client.queryKsefTokens("token", {
      statuses: ["Active", "Pending"],
      authorIdentifier: " 1234567890 ",
      authorIdentifierType: "Nip",
      description: " test ",
      continuationToken: "ref\\u002dvalue",
      pageSize: 25,
    });

    expect(result).toEqual(fakeResponse);
    expect(rest.lastRequest?.path).toEqual(
      "/api/v2/tokens?status=Active&status=Pending&authorIdentifier=1234567890&authorIdentifierType=Nip&description=test&pageSize=25",
    );
    expect(rest.lastRequest?.headers).toMatchObject({ "x-continuation-token": "ref-value" });
  });

  it("omits optional filters when not provided", async () => {
    const { client, rest } = buildClient({ continuationToken: undefined, tokens: [] });

    await client.queryKsefTokens("token", { pageSize: 0, signal: new AbortController().signal });

    expect(rest.lastRequest?.path).toEqual("/api/v2/tokens");
  });

  it("gets and revokes token", async () => {
    const { client, rest } = buildClient({ referenceNumber: "ref", status: "Active" });

    await client.getKsefToken(" ref/123 ", " token ");

    expect(rest.lastRequest?.path).toEqual("/api/v2/tokens/ref%2F123");
    expect(rest.lastRequest?.method).toEqual("GET");

    await client.revokeKsefToken("ref/123", "token");

    expect(rest.lastRequest?.method).toEqual("DELETE");
  });

  it("validates inputs", () => {
    const { client } = buildClient();

    expect(() => client.generateKsefToken(undefined as never, "token")).toThrow("requestPayload cannot be null");
    expect(() => client.generateKsefToken({ permissions: [] }, " ")).toThrow("accessToken cannot be empty");
    expect(() => client.getKsefToken(" ", "token")).toThrow("tokenReferenceNumber cannot be empty");
    expect(() => client.revokeKsefToken("ref", " ")).toThrow("accessToken cannot be empty");
  });
});
