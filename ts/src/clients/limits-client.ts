import { Routes } from "../http/routes.js";
import type { RouteBuilder } from "../http/route-builder.js";
import type { RestClientExecutor } from "../http/rest-client.js";
import { ClientBase } from "./client-base.js";
import type { CertificatesLimitInCurrentSubjectResponse } from "../models/test-data/certificates-limit-in-current-subject-response.js";
import type { SessionLimitsInCurrentContextResponse } from "../models/test-data/session-limits-in-current-context-response.js";
import type { EffectiveApiRateLimits } from "../models/rate-limits.js";

export interface LimitsClientDependencies {
  readonly restClient: RestClientExecutor;
  readonly routeBuilder: RouteBuilder;
}

export interface ILimitsClient {
  getLimitsForCurrentContext(accessToken: string, signal?: AbortSignal): Promise<SessionLimitsInCurrentContextResponse>;
  getLimitsForCurrentSubject(accessToken: string, signal?: AbortSignal): Promise<CertificatesLimitInCurrentSubjectResponse>;
  getRateLimits(accessToken: string, signal?: AbortSignal): Promise<EffectiveApiRateLimits>;
}

export class LimitsClient extends ClientBase implements ILimitsClient {
  constructor(dependencies: LimitsClientDependencies) {
    super(dependencies.restClient, dependencies.routeBuilder);
  }

  public getLimitsForCurrentContext(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<SessionLimitsInCurrentContextResponse> {
    return this.executeWithResponse(Routes.Limits.CurrentContext, "GET", { accessToken, signal });
  }

  public getLimitsForCurrentSubject(
    accessToken: string,
    signal?: AbortSignal,
  ): Promise<CertificatesLimitInCurrentSubjectResponse> {
    return this.executeWithResponse(Routes.Limits.CurrentSubject, "GET", { accessToken, signal });
  }

  public getRateLimits(accessToken: string, signal?: AbortSignal): Promise<EffectiveApiRateLimits> {
    return this.executeWithResponse(Routes.Limits.RateLimits, "GET", { accessToken, signal });
  }
}
