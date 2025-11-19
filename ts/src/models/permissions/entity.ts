import type {
  EntityAuthorizationsAuthorizedEntityIdentifier,
  EntityAuthorizationsAuthorizingEntityIdentifier,
  GrantPermissionsEntitySubjectIdentifier,
  PersonPermissionContextIdentifier,
} from './identifiers.js';

export type EntityStandardPermissionType = 'InvoiceRead' | 'InvoiceWrite';

export interface EntityPermission {
  readonly type: EntityStandardPermissionType;
  readonly canDelegate: boolean;
}

export interface GrantPermissionsEntityRequest {
  readonly subjectIdentifier: GrantPermissionsEntitySubjectIdentifier;
  readonly permissions: readonly EntityPermission[];
  readonly description?: string;
}

export type QueryType = 'Granted' | 'Received';

export type InvoicePermissionType = 'SelfInvoicing' | 'TaxRepresentative' | 'RRInvoicing' | 'PefInvoicing';

export interface EntityAuthorizationsQueryRequest {
  readonly authorizingIdentifier?: EntityAuthorizationsAuthorizingEntityIdentifier;
  readonly authorizedIdentifier?: EntityAuthorizationsAuthorizedEntityIdentifier;
  readonly queryType: QueryType;
  readonly permissionTypes: readonly InvoicePermissionType[];
}

export interface EntityRole {
  readonly parentEntityIdentifier: PersonPermissionContextIdentifier;
  readonly role: string;
  readonly description?: string;
  readonly startDate: Date;
}
