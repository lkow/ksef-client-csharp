export type AuthorIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface AuthorIdentifier {
  readonly type: AuthorIdentifierType;
  readonly value: string;
}

export type AuthorizationSubjectIdentifierType = 'Nip' | 'PeppolId';
export interface AuthorizationSubjectIdentifier {
  readonly type: AuthorizationSubjectIdentifierType;
  readonly value: string;
}

export type AuthorizedEntityIdentifierType = 'Nip' | 'PeppolId';
export interface AuthorizedEntityIdentifier {
  readonly type: AuthorizedEntityIdentifierType;
  readonly value: string;
}

export type AuthorizingEntityIdentifierType = 'Nip';
export interface AuthorizingEntityIdentifier {
  readonly type: AuthorizingEntityIdentifierType;
  readonly value: string;
}

export type EntityAuthorizationsAuthorizedEntityIdentifierType = 'Nip' | 'PeppolId';
export interface EntityAuthorizationsAuthorizedEntityIdentifier {
  readonly type: EntityAuthorizationsAuthorizedEntityIdentifierType;
  readonly value: string;
}

export type EntityAuthorizationsAuthorizingEntityIdentifierType = 'Nip';
export interface EntityAuthorizationsAuthorizingEntityIdentifier {
  readonly type: EntityAuthorizationsAuthorizingEntityIdentifierType;
  readonly value: string;
}

export type EntityPermissionsSubordinateEntityIdentifierType = 'Nip';
export interface EntityPermissionsSubordinateEntityIdentifier {
  readonly type: EntityPermissionsSubordinateEntityIdentifierType;
  readonly value: string;
}

export type EuEntityContextIdentifierType = 'NipVatUe';
export interface EuEntityContextIdentifier {
  readonly type: EuEntityContextIdentifierType;
  readonly value: string;
}

export type EuEntitySubjectIdentifierType = 'Fingerprint';
export interface EuEntitySubjectIdentifier {
  readonly type: EuEntitySubjectIdentifierType;
  readonly value: string;
}

export type EuEntityRepresentativeSubjectIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface EuEntityRepresentativeSubjectIdentifier {
  readonly type: EuEntityRepresentativeSubjectIdentifierType;
  readonly value: string;
}

export type GrantPermissionsEntitySubjectIdentifierType = 'Nip' | 'PeppolId';
export interface GrantPermissionsEntitySubjectIdentifier {
  readonly type: GrantPermissionsEntitySubjectIdentifierType;
  readonly value: string;
}

export type GrantPermissionsPersonSubjectIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface GrantPermissionsPersonSubjectIdentifier {
  readonly type: GrantPermissionsPersonSubjectIdentifierType;
  readonly value: string;
}

export type IndirectEntitySubjectIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface IndirectEntitySubjectIdentifier {
  readonly type: IndirectEntitySubjectIdentifierType;
  readonly value: string;
}

export type IndirectEntityTargetIdentifierType = 'Nip' | 'AllPartners' | 'InternalId';
export interface IndirectEntityTargetIdentifier {
  readonly type: IndirectEntityTargetIdentifierType;
  readonly value: string;
}

export type PersonAuthorizedIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface PersonAuthorizedIdentifier {
  readonly type: PersonAuthorizedIdentifierType;
  readonly value: string;
}

export type PersonPermissionAuthorizedIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface PersonPermissionAuthorizedIdentifier {
  readonly type: PersonPermissionAuthorizedIdentifierType;
  readonly value: string;
}

export type PersonPermissionContextIdentifierType = 'Nip' | 'InternalId';
export interface PersonPermissionContextIdentifier {
  readonly type: PersonPermissionContextIdentifierType;
  readonly value: string;
}

export type PersonPermissionTargetIdentifierType = 'Nip' | 'AllPartners';
export interface PersonPermissionTargetIdentifier {
  readonly type: PersonPermissionTargetIdentifierType;
  readonly value: string;
}

export type PersonPermissionsAuthorIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint' | 'System';
export interface PersonPermissionsAuthorIdentifier {
  readonly type: PersonPermissionsAuthorIdentifierType;
  readonly value: string;
}

export type PersonPermissionsAuthorizedIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface PersonPermissionsAuthorizedIdentifier {
  readonly type: PersonPermissionsAuthorizedIdentifierType;
  readonly value: string;
}

export type PersonPermissionsContextIdentifierType = 'Nip' | 'InternalId';
export interface PersonPermissionsContextIdentifier {
  readonly type: PersonPermissionsContextIdentifierType;
  readonly value: string;
}

export type PersonPermissionsTargetIdentifierType = 'Nip' | 'AllPartners' | 'InternalId';
export interface PersonPermissionsTargetIdentifier {
  readonly type: PersonPermissionsTargetIdentifierType;
  readonly value: string;
}

export type PersonalPermissionAuthorizedIdentifierType = 'Nip';
export interface PersonalPermissionAuthorizedIdentifier {
  readonly type: PersonalPermissionAuthorizedIdentifierType;
  readonly value: string;
}

export type PersonalPermissionContextIdentifierType = 'Nip';
export interface PersonalPermissionContextIdentifier {
  readonly type: PersonalPermissionContextIdentifierType;
  readonly value: string;
}

export type PersonalPermissionTargetIdentifierType = 'Nip';
export interface PersonalPermissionTargetIdentifier {
  readonly type: PersonalPermissionTargetIdentifierType;
  readonly value: string;
}

export type PersonalPermissionsContextIdentifierType = 'Nip' | 'InternalId';
export interface PersonalPermissionsContextIdentifier {
  readonly type: PersonalPermissionsContextIdentifierType;
  readonly value: string;
}

export type PersonalPermissionsTargetIdentifierType = 'Nip' | 'AllPartners' | 'InternalId';
export interface PersonalPermissionsTargetIdentifier {
  readonly type: PersonalPermissionsTargetIdentifierType;
  readonly value: string;
}

export type SubunitContextIdentifierType = 'Nip' | 'InternalId';
export interface SubunitContextIdentifier {
  readonly type: SubunitContextIdentifierType;
  readonly value: string;
}

export type SubunitIdentifierType = 'InternalId' | 'Nip';
export interface SubunitIdentifier {
  readonly type: SubunitIdentifierType;
  readonly value: string;
}

export type SubunitIQuerydentifierType = 'InternalId' | 'Nip';
export interface SubunitPermissionsSubunitIdentifier {
  readonly type: SubunitIQuerydentifierType;
  readonly value: string;
}

export type SubunitPermissionAuthorizedIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface SubunitPermissionAuthorizedIdentifier {
  readonly type: SubunitPermissionAuthorizedIdentifierType;
  readonly value: string;
}

export type SubUnitSubjectIdentifierType = 'Nip' | 'Pesel' | 'Fingerprint';
export interface SubunitSubjectIdentifier {
  readonly type: SubUnitSubjectIdentifierType;
  readonly value: string;
}

export type SubordinateEntityIdentifierType = 'Nip';
export interface SubordinateEntityIdentifier {
  readonly type: SubordinateEntityIdentifierType;
  readonly value: string;
}
