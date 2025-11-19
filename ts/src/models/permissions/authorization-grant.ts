import type {
  AuthorIdentifier,
  AuthorizedEntityIdentifier,
  AuthorizingEntityIdentifier,
  AuthorizationSubjectIdentifier,
} from './identifiers.js';

export interface AuthorizationGrant {
  readonly id: string;
  readonly authorIdentifier: AuthorIdentifier;
  readonly authorizedEntityIdentifier: AuthorizedEntityIdentifier;
  readonly authorizingEntityIdentifier: AuthorizingEntityIdentifier;
  readonly authorizationScope: string;
  readonly description?: string;
  readonly startDate: Date;
}

export type AuthorizationPermissionType =
  | 'SelfInvoicing'
  | 'RRInvoicing'
  | 'TaxRepresentative'
  | 'PefInvoicing';

export interface GrantPermissionsAuthorizationRequest {
  readonly subjectIdentifier: AuthorizationSubjectIdentifier;
  readonly permission: AuthorizationPermissionType;
  readonly description?: string;
}
