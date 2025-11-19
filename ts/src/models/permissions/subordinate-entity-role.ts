import type { SubordinateEntityIdentifier } from './identifiers.js';

export interface SubordinateEntityRole {
  readonly subordinateEntityIdentifier: SubordinateEntityIdentifier;
  readonly role: string;
  readonly description?: string;
  readonly startDate: Date;
}
