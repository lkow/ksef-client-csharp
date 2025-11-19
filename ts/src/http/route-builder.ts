import { RestRequest } from "./rest-request.js";

export interface RouteBuilderOptions {
  readonly apiPrefix?: string;
  readonly defaultVersion?: string;
}

export class RouteBuilder {
  private readonly apiPrefix: string;
  private readonly defaultVersion: string;

  constructor(options: RouteBuilderOptions = {}) {
    const prefix = options.apiPrefix ?? "api";
    const version = options.defaultVersion ?? "v2";
    this.apiPrefix = prefix.trim().length === 0 ? "api" : prefix.trim().replace(/\/+$/, "");
    this.defaultVersion = version.trim().length === 0 ? "v2" : version.trim();
  }

  public build(endpoint: string, apiVersion?: string): string {
    if (!endpoint || endpoint.trim().length === 0) {
      throw new Error("Endpoint cannot be empty");
    }

    const version = apiVersion && apiVersion.trim().length > 0 ? apiVersion : this.defaultVersion;
    const cleanEndpoint = endpoint.trim().replace(/^\/+/, "");
    return `/${this.apiPrefix}/${version}/${cleanEndpoint}`;
  }

  public resolve(request: RestRequest | undefined, relativeEndpoint: string): string {
    const version = request?.apiVersion;
    return this.build(relativeEndpoint, version);
  }
}
