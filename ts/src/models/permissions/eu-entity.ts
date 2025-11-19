import type {
  AuthorIdentifier,
  EuEntityContextIdentifier,
  EuEntitySubjectIdentifier,
} from './identifiers.js';

export interface GrantPermissionsEuEntityRequest {
  readonly subjectIdentifier: EuEntitySubjectIdentifier;
  readonly contextIdentifier: EuEntityContextIdentifier;
  readonly description?: string;
  readonly euEntityName?: string;
}

export interface EuEntityPermissionsQueryRequest {
  readonly vatUeIdentifier?: string;
  readonly authorizedFingerprintIdentifier?: string;
  readonly permissionTypes?: readonly EuEntityPermissionsQueryPermissionType[];
}

export type EuEntityPermissionsQueryPermissionType =
  | 'VatUeManage'
  | 'InvoiceWrite'
  | 'InvoiceRead'
  | 'Introspection';

export interface EuEntityPermission {
  readonly id: string;
  readonly authorIdentifier: AuthorIdentifier;
  readonly vatUeIdentifier: string;
  readonly euEntityName?: string;
  readonly authorizedFingerprintIdentifier?: string;
  readonly permissionScope: string;
  readonly description?: string;
  readonly startDate: Date;
}
