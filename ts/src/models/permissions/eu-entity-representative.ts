import type { EuEntityRepresentativeSubjectIdentifier } from './identifiers.js';

export type EuEntityRepresentativeStandardPermissionType = 'InvoiceRead' | 'InvoiceWrite';

export interface GrantPermissionsEuEntityRepresentativeRequest {
  readonly subjectIdentifier: EuEntityRepresentativeSubjectIdentifier;
  readonly permissions: readonly EuEntityRepresentativeStandardPermissionType[];
  readonly description?: string;
}
