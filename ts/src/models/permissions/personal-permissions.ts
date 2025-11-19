import type {
  PersonalPermissionAuthorizedIdentifier,
  PersonalPermissionContextIdentifier,
  PersonalPermissionTargetIdentifier,
  PersonalPermissionsContextIdentifier,
  PersonalPermissionsTargetIdentifier,
} from './identifiers.js';

export interface PersonalPermissionsQueryRequest {
  readonly contextIdentifier?: PersonalPermissionsContextIdentifier;
  readonly targetIdentifier?: PersonalPermissionsTargetIdentifier;
  readonly permissionTypes?: readonly PersonalPermissionScopeType[];
  readonly permissionState?: PersonalPermissionState;
}

export type PersonalPermissionScopeType =
  | 'CredentialsManage'
  | 'CredentialsRead'
  | 'InvoiceWrite'
  | 'InvoiceRead'
  | 'Introspection'
  | 'SubunitManage'
  | 'EnforcementOperations'
  | 'VatUeManage';

export type PersonalPermissionState = 'Active' | 'Inactive';

export interface PersonalPermission {
  readonly id: string;
  readonly contextIdentifier: PersonalPermissionContextIdentifier;
  readonly authorizedIdentifier: PersonalPermissionAuthorizedIdentifier;
  readonly targetIdentifier: PersonalPermissionTargetIdentifier;
  readonly permissionScope: PersonalPermissionScopeType;
  readonly description?: string;
  readonly permissionState: PersonalPermissionState;
  readonly startDate: Date;
  readonly canDelegate: boolean;
}
