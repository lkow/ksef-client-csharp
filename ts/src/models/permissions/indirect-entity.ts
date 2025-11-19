import type {
  IndirectEntitySubjectIdentifier,
  IndirectEntityTargetIdentifier,
} from './identifiers.js';

export type IndirectEntityStandardPermissionType = 'InvoiceRead' | 'InvoiceWrite';

export interface GrantPermissionsIndirectEntityRequest {
  readonly subjectIdentifier: IndirectEntitySubjectIdentifier;
  readonly targetIdentifier: IndirectEntityTargetIdentifier;
  readonly permissions: readonly IndirectEntityStandardPermissionType[];
  readonly description?: string;
}
