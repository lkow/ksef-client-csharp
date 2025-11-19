import { Routes } from "../http/routes.js";
import type { RouteBuilder } from "../http/route-builder.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import type { EffectiveApiRateLimitsRequest } from "../models/rate-limits.js";
import type {
  AttachmentPermissionGrantRequest,
  AttachmentPermissionRevokeRequest,
  ChangeCertificatesLimitInCurrentSubjectRequest,
  ChangeSessionLimitsInCurrentContextRequest,
  PersonCreateRequest,
  PersonRemoveRequest,
  SubjectCreateRequest,
  SubjectRemoveRequest,
  TestDataPermissionsGrantRequest,
  TestDataPermissionsRevokeRequest,
} from "../models/test-data/requests.js";
import { ClientBase } from "./client-base.js";

export interface TestDataClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface ITestDataClient {
  createSubjectAsync(request: SubjectCreateRequest, signal?: AbortSignal): Promise<void>;
  removeSubjectAsync(request: SubjectRemoveRequest, signal?: AbortSignal): Promise<void>;
  createPersonAsync(request: PersonCreateRequest, signal?: AbortSignal): Promise<void>;
  removePersonAsync(request: PersonRemoveRequest, signal?: AbortSignal): Promise<void>;
  grantPermissionsAsync(request: TestDataPermissionsGrantRequest, signal?: AbortSignal): Promise<void>;
  revokePermissionsAsync(request: TestDataPermissionsRevokeRequest, signal?: AbortSignal): Promise<void>;
  enableAttachmentAsync(request: AttachmentPermissionGrantRequest, signal?: AbortSignal): Promise<void>;
  disableAttachmentAsync(request: AttachmentPermissionRevokeRequest, signal?: AbortSignal): Promise<void>;
  changeSessionLimitsInCurrentContextAsync(
    request: ChangeSessionLimitsInCurrentContextRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<void>;
  restoreDefaultSessionLimitsInCurrentContextAsync(accessToken: string, signal?: AbortSignal): Promise<void>;
  changeCertificatesLimitInCurrentSubjectAsync(
    request: ChangeCertificatesLimitInCurrentSubjectRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<void>;
  restoreDefaultCertificatesLimitInCurrentSubjectAsync(accessToken: string, signal?: AbortSignal): Promise<void>;
  restoreRateLimitsAsync(accessToken: string, signal?: AbortSignal): Promise<void>;
  setRateLimitsAsync(
    requestPayload: EffectiveApiRateLimitsRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<void>;
}

export class TestDataClient extends ClientBase implements ITestDataClient {
  constructor(dependencies: TestDataClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public createSubjectAsync(request: SubjectCreateRequest, signal?: AbortSignal): Promise<void> {
    return this.executeWithBody(Routes.TestData.CreateSubject, request, { signal });
  }

  public removeSubjectAsync(request: SubjectRemoveRequest, signal?: AbortSignal): Promise<void> {
    return this.executeWithBody(Routes.TestData.RemoveSubject, request, { signal });
  }

  public createPersonAsync(request: PersonCreateRequest, signal?: AbortSignal): Promise<void> {
    return this.executeWithBody(Routes.TestData.CreatePerson, request, { signal });
  }

  public removePersonAsync(request: PersonRemoveRequest, signal?: AbortSignal): Promise<void> {
    return this.executeWithBody(Routes.TestData.RemovePerson, request, { signal });
  }

  public grantPermissionsAsync(request: TestDataPermissionsGrantRequest, signal?: AbortSignal): Promise<void> {
    return this.executeWithBody(Routes.TestData.GrantPerms, request, { signal });
  }

  public revokePermissionsAsync(request: TestDataPermissionsRevokeRequest, signal?: AbortSignal): Promise<void> {
    return this.executeWithBody(Routes.TestData.RevokePerms, request, { signal });
  }

  public enableAttachmentAsync(request: AttachmentPermissionGrantRequest, signal?: AbortSignal): Promise<void> {
    return this.executeWithBody(Routes.TestData.EnableAttach, request, { signal });
  }

  public disableAttachmentAsync(request: AttachmentPermissionRevokeRequest, signal?: AbortSignal): Promise<void> {
    return this.executeWithBody(Routes.TestData.DisableAttach, request, { signal });
  }

  public changeSessionLimitsInCurrentContextAsync(
    request: ChangeSessionLimitsInCurrentContextRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<void> {
    return this.executeWithBody(Routes.TestData.ChangeSessionLimitsInCurrentContext, request, { accessToken, signal });
  }

  public restoreDefaultSessionLimitsInCurrentContextAsync(accessToken: string, signal?: AbortSignal): Promise<void> {
    return this.execute(Routes.TestData.RestoreDefaultSessionLimitsInCurrentContext, "DELETE", { accessToken, signal });
  }

  public changeCertificatesLimitInCurrentSubjectAsync(
    request: ChangeCertificatesLimitInCurrentSubjectRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<void> {
    return this.executeWithBody(Routes.TestData.ChangeCertificatesLimitInCurrentSubject, request, { accessToken, signal });
  }

  public restoreDefaultCertificatesLimitInCurrentSubjectAsync(accessToken: string, signal?: AbortSignal): Promise<void> {
    return this.execute(Routes.TestData.RestoreDefaultCertificatesLimitInCurrentSubject, "DELETE", { accessToken, signal });
  }

  public restoreRateLimitsAsync(accessToken: string, signal?: AbortSignal): Promise<void> {
    return this.execute(Routes.TestData.RateLimits, "DELETE", { accessToken, signal });
  }

  public setRateLimitsAsync(
    requestPayload: EffectiveApiRateLimitsRequest,
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<void> {
    return this.executeWithBody(Routes.TestData.RateLimits, requestPayload, { accessToken, signal });
  }
}
