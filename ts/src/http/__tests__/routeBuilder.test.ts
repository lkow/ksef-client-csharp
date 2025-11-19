import { describe, expect, it } from "vitest";
import { RouteBuilder } from "../route-builder.js";
import { RestRequest } from "../rest-request.js";

describe("RouteBuilder", () => {
  it("builds default route with sanitized endpoint", () => {
    const builder = new RouteBuilder();
    expect(builder.build("limits/context")).toEqual("/api/v2/limits/context");
  });

  it("uses custom prefix and version", () => {
    const builder = new RouteBuilder({ apiPrefix: "custom", defaultVersion: "v3" });
    expect(builder.build("/auth/challenge")).toEqual("/custom/v3/auth/challenge");
  });

  it("throws for empty endpoint", () => {
    const builder = new RouteBuilder();
    expect(() => builder.build(" ")).toThrowError("Endpoint cannot be empty");
  });

  it("resolves api version from request", () => {
    const builder = new RouteBuilder();
    const request = RestRequest.new("/ignored", "GET").withApiVersion("v1");
    expect(builder.resolve(request, "limits/context")).toEqual("/api/v1/limits/context");
  });
});
