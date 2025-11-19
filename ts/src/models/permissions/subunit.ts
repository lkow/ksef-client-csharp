import type {
  AuthorIdentifier,
  EntityPermissionsSubordinateEntityIdentifier,
  SubunitSubjectIdentifier,
  SubunitContextIdentifier,
  SubunitIdentifier,
  SubunitPermissionAuthorizedIdentifier,
  SubunitPermissionsSubunitIdentifier,
} from './identifiers.js';

export interface GrantPermissionsSubunitRequest {
  readonly subjectIdentifier: SubunitSubjectIdentifier;
  readonly contextIdentifier: SubunitContextIdentifier;
  readonly description?: string;
  readonly subunitName?: string;
}

export interface SubunitPermissionsQueryRequest {
  readonly subunitIdentifier: SubunitPermissionsSubunitIdentifier;
}

export interface SubordinateEntityRolesQueryRequest {
  readonly subordinateEntityIdentifier: EntityPermissionsSubordinateEntityIdentifier;
}

export type SubunitPermissionType = 'CredentialsManage';

export interface SubunitPermission {
  readonly id: string;
  readonly authorizedIdentifier: SubunitPermissionAuthorizedIdentifier;
  readonly subunitIdentifier: SubunitIdentifier;
  readonly authorIdentifier: AuthorIdentifier;
  readonly permissionScope: SubunitPermissionType;
  readonly description?: string;
  readonly subunitName?: string;
  readonly startDate: Date;
}
