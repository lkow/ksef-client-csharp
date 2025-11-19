import type {
  AuthorIdentifier,
  GrantPermissionsPersonSubjectIdentifier,
  PersonPermissionAuthorizedIdentifier,
  PersonPermissionContextIdentifier,
  PersonPermissionTargetIdentifier,
  PersonPermissionsAuthorIdentifier,
  PersonPermissionsAuthorizedIdentifier,
  PersonPermissionsContextIdentifier,
  PersonPermissionsTargetIdentifier,
} from './identifiers.js';

export type PersonPermissionType =
  | 'CredentialsManage'
  | 'CredentialsRead'
  | 'InvoiceWrite'
  | 'InvoiceRead'
  | 'Introspection'
  | 'SubunitManage'
  | 'EnforcementOperations';

export type PersonPermissionState = 'Active' | 'Inactive';

export interface GrantPermissionsPersonRequest {
  readonly subjectIdentifier: GrantPermissionsPersonSubjectIdentifier;
  readonly permissions: readonly PersonPermissionType[];
  readonly description?: string;
}

export type PersonQueryType = 'PermissionsInCurrentContext' | 'PermissionsGrantedInCurrentContext';

export interface PersonPermissionsQueryRequest {
  readonly authorIdentifier?: PersonPermissionsAuthorIdentifier;
  readonly authorizedIdentifier?: PersonPermissionsAuthorizedIdentifier;
  readonly contextIdentifier?: PersonPermissionsContextIdentifier;
  readonly targetIdentifier?: PersonPermissionsTargetIdentifier;
  readonly permissionTypes?: readonly PersonPermissionType[];
  readonly permissionState?: PersonPermissionState;
  readonly queryType: PersonQueryType;
}

export interface PersonPermission {
  readonly id: string;
  readonly authorizedIdentifier: PersonPermissionAuthorizedIdentifier;
  readonly contextIdentifier: PersonPermissionContextIdentifier;
  readonly targetIdentifier: PersonPermissionTargetIdentifier;
  readonly authorIdentifier: AuthorIdentifier;
  readonly permissionScope: string;
  readonly description?: string;
  readonly permissionState: string;
  readonly startDate: Date;
  readonly canDelegate: boolean;
}
