export type TokenContextIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';

export interface TokenSubjectIdentifier {
  readonly type: string;
  readonly value: string;
}

export interface TokenSubjectDetails {
  readonly subjectIdentifier?: TokenSubjectIdentifier;
  readonly givenNames: readonly string[];
  readonly surname?: string;
  readonly serialNumber?: string;
  readonly commonName?: string;
  readonly countryName?: string;
}

export interface TokenIppPolicy {
  readonly onClientIpChange?: string;
}

export interface PersonToken {
  readonly issuer?: string;
  readonly audiences: readonly string[];
  readonly issuedAt?: Date;
  readonly expiresAt?: Date;
  readonly roles: readonly string[];
  readonly tokenType?: string;
  readonly contextIdType?: string;
  readonly contextIdValue?: string;
  readonly authMethod?: string;
  readonly authRequestNumber?: string;
  readonly subjectDetails?: TokenSubjectDetails;
  readonly permissions: readonly string[];
  readonly permissionsExcluded: readonly string[];
  readonly rolesRaw: readonly string[];
  readonly permissionsEffective: readonly string[];
  readonly ipPolicy?: TokenIppPolicy;
}
