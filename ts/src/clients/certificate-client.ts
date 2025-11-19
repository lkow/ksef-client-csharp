import { appendPagination } from "../http/helpers/pagination.js";
import { Routes } from "../http/routes.js";
import type { RouteBuilder } from "../http/route-builder.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type {
  CertificateEnrollmentResponse,
  CertificateEnrollmentStatusResponse,
  CertificateEnrollmentsInfoResponse,
  CertificateLimitResponse,
  CertificateListRequest,
  CertificateListResponse,
  CertificateMetadataListRequest,
  CertificateMetadataListResponse,
  CertificateRevokeRequest,
  SendCertificateEnrollmentRequest,
} from "../models/certificates/index.js";
import { ClientBase } from "./client-base.js";

export interface CertificateClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface ICertificateClient {
  getCertificateLimitsAsync(accessToken: string, signal?: AbortSignal): Promise<CertificateLimitResponse>;
  getCertificateEnrollmentDataAsync(accessToken: string, signal?: AbortSignal): Promise<CertificateEnrollmentsInfoResponse>;
  sendCertificateEnrollmentAsync(
    requestPayload: SendCertificateEnrollmentRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<CertificateEnrollmentResponse>;
  getCertificateEnrollmentStatusAsync(
    certificateRequestReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<CertificateEnrollmentStatusResponse>;
  getCertificateListAsync(
    requestPayload: CertificateListRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<CertificateListResponse>;
  revokeCertificateAsync(
    requestPayload: CertificateRevokeRequest,
    serialNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<void>;
  getCertificateMetadataListAsync(
    accessToken: string,
    requestPayload?: CertificateMetadataListRequest,
    pageSize?: number,
    pageOffset?: number,
    signal?: AbortSignal,
  ): Promise<CertificateMetadataListResponse>;
}

export class CertificateClient extends ClientBase implements ICertificateClient {
  constructor(dependencies: CertificateClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public getCertificateLimitsAsync(accessToken: string, signal?: AbortSignal): Promise<CertificateLimitResponse> {
    this.ensureAccessToken(accessToken);
    return this.executeWithResponse(Routes.Certificates.Limits, "GET", { accessToken, signal });
  }

  public getCertificateEnrollmentDataAsync(accessToken: string, signal?: AbortSignal): Promise<CertificateEnrollmentsInfoResponse> {
    this.ensureAccessToken(accessToken);
    return this.executeWithResponse(Routes.Certificates.EnrollmentData, "GET", { accessToken, signal });
  }

  public sendCertificateEnrollmentAsync(
    requestPayload: SendCertificateEnrollmentRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<CertificateEnrollmentResponse> {
    if (!requestPayload) {
      throw new Error("Certificate enrollment payload is required");
    }
    this.ensureAccessToken(accessToken);

    return this.executeWithBodyAndResponse(Routes.Certificates.Enrollments, requestPayload, { accessToken, signal });
  }

  public getCertificateEnrollmentStatusAsync(
    certificateRequestReferenceNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<CertificateEnrollmentStatusResponse> {
    if (!certificateRequestReferenceNumber?.trim()) {
      throw new Error("Certificate request reference number is required");
    }
    this.ensureAccessToken(accessToken);

    return this.executeWithResponse(
      Routes.Certificates.EnrollmentStatus(certificateRequestReferenceNumber),
      "GET",
      { accessToken, signal },
    );
  }

  public getCertificateListAsync(
    requestPayload: CertificateListRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<CertificateListResponse> {
    if (!requestPayload) {
      throw new Error("Certificate list request is required");
    }
    this.ensureAccessToken(accessToken);
    return this.executeWithBodyAndResponse(Routes.Certificates.Retrieve, requestPayload, { accessToken, signal });
  }

  public revokeCertificateAsync(
    requestPayload: CertificateRevokeRequest,
    serialNumber: string,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<void> {
    if (!requestPayload) {
      throw new Error("Certificate revoke request is required");
    }
    if (!serialNumber?.trim()) {
      throw new Error("Certificate serial number is required");
    }
    this.ensureAccessToken(accessToken);

    return this.executeWithBody(Routes.Certificates.Revoke(serialNumber), requestPayload, { accessToken, signal });
  }

  public getCertificateMetadataListAsync(
    accessToken: string,
    requestPayload?: CertificateMetadataListRequest,
    pageSize?: number,
    pageOffset?: number,
    signal?: AbortSignal,
  ): Promise<CertificateMetadataListResponse> {
    this.ensureAccessToken(accessToken);

    const endpoint = appendPagination(Routes.Certificates.Query, pageOffset, pageSize);

    return this.executeWithBodyAndResponse(endpoint, requestPayload ?? {}, { accessToken, signal });
  }

  private ensureAccessToken(accessToken: string): void {
    if (!accessToken?.trim()) {
      throw new Error("Access token is required");
    }
  }
}
