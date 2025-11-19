import type { PemCertificateInfo } from "../models/certificates/pem-certificate-info.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { RouteBuilder } from "../http/route-builder.js";
import { RestRequest } from "../http/rest-request.js";
import { Routes } from "../http/routes.js";

export interface CryptographyClientOptions {
  readonly apiVersion?: string;
}

export class CryptographyClient {
  public constructor(
    private readonly restClient: RestClientExecutor,
    private readonly routeBuilder: RouteBuilder,
    private readonly options: CryptographyClientOptions = {},
  ) {}

  public async getPublicCertificates(signal?: AbortSignal): Promise<readonly PemCertificateInfo[]> {
    const path = this.routeBuilder.build(Routes.Security.PublicCertificates, this.options.apiVersion);
    const request = RestRequest.new(path, "GET");
    return this.restClient.send<readonly PemCertificateInfo[]>(request, signal);
  }
}
