import { describe, expect, it, beforeEach, vi } from "vitest";
import { RestClient } from "../rest-client.js";
import { RestRequest } from "../rest-request.js";
import { KsefRateLimitException } from "../../exceptions/ksef-rate-limit-exception.js";
import { KsefApiException } from "../../exceptions/ksef-api-exception.js";

const jsonHeaders = { "content-type": "application/json" };

describe("RestClient", () => {
  const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("sends JSON payloads and parses responses", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ value: 42 }), { status: 200, headers: jsonHeaders }),
    );
    const client = new RestClient({ baseUrl: "https://api.test", fetchFn: fetchMock });

    const result = await client.sendAsync<{ value: number }, { foo: string }>("POST", "/sample", { foo: "bar" });

    expect(result).toEqual({ value: 42 });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/sample",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ foo: "bar" }),
      }),
    );
  });

  it("throws rate limit exception with retry metadata", async () => {
    const apiError = {
      exception: {
        exceptionDetailList: [{ exceptionCode: 100, exceptionDescription: "Limit" }],
      },
    };
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(apiError), {
        status: 429,
        headers: { ...jsonHeaders, "retry-after": "5" },
      }),
    );
    const client = new RestClient({ baseUrl: "https://api.test", fetchFn: fetchMock });

    await expect(client.sendAsync("GET", "/limited"))
      .rejects.toThrow(KsefRateLimitException);
  });

  it("maps structured API errors to KsefApiException", async () => {
    const apiError = {
      exception: {
        exceptionDetailList: [
          {
            exceptionCode: 101,
            exceptionDescription: "Invalid request",
            details: ["Field A"],
          },
        ],
      },
    };
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(apiError), { status: 400, headers: jsonHeaders }),
    );
    const client = new RestClient({ baseUrl: "https://api.test", fetchFn: fetchMock });

    await expect(client.sendAsync("GET", "/broken"))
      .rejects.toThrow(KsefApiException);
  });

  it("applies RestRequest metadata (query, headers, accept)", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders }),
    );
    const client = new RestClient({ baseUrl: "https://api.test", fetchFn: fetchMock });

    const request = RestRequest.new("sessions", "GET")
      .addQueryParameter("page", "1")
      .addHeader("x-trace-id", "123")
      .withAccept("application/json");

    await client.send(request);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/sessions?page=1",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ "x-trace-id": "123", Accept: "application/json" }),
      }),
    );
  });
});
