import type { EffectiveApiRateLimitsRequest } from "../rate-limits.js";

export interface TestDataSubjectIdentifier {
  readonly type: string;
  readonly value: string;
}

export interface SubjectCreateRequest {
  readonly identifier: TestDataSubjectIdentifier;
  readonly name: string;
}

export interface SubjectRemoveRequest {
  readonly identifier: TestDataSubjectIdentifier;
}

export interface PersonCreateRequest {
  readonly identifier: string;
  readonly name: string;
  readonly surname: string;
  readonly email: string;
}

export interface PersonRemoveRequest {
  readonly identifier: string;
}

export interface AttachmentPermissionGrantRequest {
  readonly identifier: string;
}

export interface AttachmentPermissionRevokeRequest {
  readonly identifier: string;
}

export interface TestDataPermissionsGrantRequest {
  readonly subject: TestDataSubjectIdentifier;
  readonly personIdentifier: string;
  readonly permissions: readonly string[];
}

export interface TestDataPermissionsRevokeRequest {
  readonly subject: TestDataSubjectIdentifier;
  readonly personIdentifier: string;
}

export interface ChangeSessionLimitsInCurrentContextRequest {
  readonly sessionLimitPerDay?: number;
  readonly sessionLimitPerSecond?: number;
}

export interface ChangeCertificatesLimitInCurrentSubjectRequest {
  readonly certificatesLimit?: number;
}
