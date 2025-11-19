export const Routes = {
  TestData: {
    CreateSubject: "testdata/subject",
    RemoveSubject: "testdata/subject/remove",
    CreatePerson: "testdata/person",
    RemovePerson: "testdata/person/remove",
    GrantPerms: "testdata/permissions",
    RevokePerms: "testdata/permissions/revoke",
    EnableAttach: "testdata/attachment",
    DisableAttach: "testdata/attachment/revoke",
    ChangeSessionLimitsInCurrentContext: "testdata/limits/context/session",
    RestoreDefaultSessionLimitsInCurrentContext: "testdata/limits/context/session",
    ChangeCertificatesLimitInCurrentSubject: "testdata/limits/subject/certificate",
    RestoreDefaultCertificatesLimitInCurrentSubject: "testdata/limits/subject/certificate",
    RateLimits: "testdata/rate-limits",
  },
  Limits: {
    CurrentContext: "limits/context",
    CurrentSubject: "limits/subject",
    RateLimits: "rate-limits",
  },
  ActiveSessions: {
    Session: "auth/sessions",
    CurrentSession: "auth/sessions/current",
  },
  Authorization: {
    Challenge: "auth/challenge",
    XadesSignature: "auth/xades-signature",
    KsefToken: "auth/ksef-token",
    Status: (reference: string) => `auth/${reference}`,
    Token: {
      Redeem: "auth/token/redeem",
      Refresh: "auth/token/refresh",
    },
  },
  Sessions: {
    Root: "sessions",
    ByReference: (referenceNumber: string) => `sessions/${referenceNumber}`,
    Invoices: (referenceNumber: string) => `sessions/${referenceNumber}/invoices`,
    Invoice: (referenceNumber: string, invoiceReferenceNumber: string) =>
      `sessions/${referenceNumber}/invoices/${invoiceReferenceNumber}`,
    FailedInvoices: (referenceNumber: string) => `sessions/${referenceNumber}/invoices/failed`,
    UpoByKsefNumber: (referenceNumber: string, ksefNumber: string) =>
      `sessions/${referenceNumber}/invoices/ksef/${ksefNumber}/upo`,
    UpoByInvoiceReference: (referenceNumber: string, invoiceReferenceNumber: string) =>
      `sessions/${referenceNumber}/invoices/${invoiceReferenceNumber}/upo`,
    Upo: (referenceNumber: string, upoReferenceNumber: string) =>
      `sessions/${referenceNumber}/upo/${upoReferenceNumber}`,
    Online: {
      Open: "sessions/online",
      Invoices: (sessionReferenceNumber: string) => `sessions/online/${sessionReferenceNumber}/invoices`,
      Close: (sessionReferenceNumber: string) => `sessions/online/${sessionReferenceNumber}/close`,
    },
    Batch: {
      Open: "sessions/batch",
      Close: (batchSessionReferenceNumber: string) => `sessions/batch/${batchSessionReferenceNumber}/close`,
    },
  },
  Invoices: {
    ByKsefNumber: (ksefNumber: string) => `invoices/ksef/${ksefNumber}`,
    QueryMetadata: "invoices/query/metadata",
    Exports: "invoices/exports",
    ExportByReference: (referenceNumber: string) => `invoices/exports/${referenceNumber}`,
  },
  Permissions: {
    Grants: {
      Persons: "permissions/persons/grants",
      Entities: "permissions/entities/grants",
      Authorizations: "permissions/authorizations/grants",
      Indirect: "permissions/indirect/grants",
      Subunits: "permissions/subunits/grants",
      EuEntities: "permissions/eu-entities/administration/grants",
      EuEntitiesRepresentatives: "permissions/eu-entities/grants",
    },
    Common: {
      GrantById: (permissionId: string) => `permissions/common/grants/${permissionId}`,
    },
    Authorizations: {
      GrantById: (permissionId: string) => `permissions/authorizations/grants/${permissionId}`,
    },
    Query: {
      PersonalGrants: "permissions/query/personal/grants",
      PersonsGrants: "permissions/query/persons/grants",
      SubunitsGrants: "permissions/query/subunits/grants",
      EntitiesRoles: "permissions/query/entities/roles",
      SubordinateEntitiesRoles: "permissions/query/subordinate-entities/roles",
      AuthorizationsGrants: "permissions/query/authorizations/grants",
      EuEntitiesGrants: "permissions/query/eu-entities/grants",
    },
    Operations: {
      ByReference: (operationReferenceNumber: string) => `permissions/operations/${operationReferenceNumber}`,
    },
    Attachments: {
      Status: "permissions/attachments/status",
    },
  },
  Certificates: {
    Limits: "certificates/limits",
    EnrollmentData: "certificates/enrollments/data",
    Enrollments: "certificates/enrollments",
    EnrollmentStatus: (referenceNumber: string) => `certificates/enrollments/${referenceNumber}`,
    Retrieve: "certificates/retrieve",
    Revoke: (serialNumber: string) => `certificates/${serialNumber}/revoke`,
    Query: "certificates/query",
  },
  Tokens: {
    Root: "tokens",
    ByReference: (referenceNumber: string) => `tokens/${referenceNumber}`,
  },
  Peppol: {
    Query: "peppol/query",
  },
  Security: {
    PublicCertificates: "security/public-key-certificates",
  },
} as const;
