import { describe, expect, it } from 'vitest';
import {
  AuthenticationTokenRequest,
  AuthenticationTokenSubjectIdentifierType,
} from '../../models/authorization/authentication-token.js';
import { serializeAuthTokenRequest, AUTH_TOKEN_NAMESPACE } from '../authTokenRequestSerializer.js';

const SUBJECT: AuthenticationTokenSubjectIdentifierType = 'certificateSubject';

describe('serializeAuthTokenRequest', () => {
  it('serializes full payloads with explicit allow-lists', () => {
    const request: AuthenticationTokenRequest = {
      challenge: 'challenge-value',
      contextIdentifier: { type: 'Nip', value: '1234567890' },
      subjectIdentifierType: SUBJECT,
      authorizationPolicy: {
        allowedIps: {
          ip4Addresses: ['127.0.0.1'],
          ip4Ranges: ['10.0.0.1-10.0.0.10'],
          ip4Masks: ['192.168.0.0/24'],
        },
      },
    };

    expect(serializeAuthTokenRequest(request)).toEqual(
      `<?xml version="1.0" encoding="utf-8"?>\n` +
        `<AuthTokenRequest xmlns="${AUTH_TOKEN_NAMESPACE}">\n` +
        `  <Challenge>challenge-value</Challenge>\n` +
        `  <ContextIdentifier>\n` +
        `    <Nip>1234567890</Nip>\n` +
        `  </ContextIdentifier>\n` +
        `  <SubjectIdentifierType>certificateSubject</SubjectIdentifierType>\n` +
        `  <AuthorizationPolicy>\n` +
        `    <AllowedIps>\n` +
        `      <Ip4Address>127.0.0.1</Ip4Address>\n` +
        `      <Ip4Range>10.0.0.1-10.0.0.10</Ip4Range>\n` +
        `      <Ip4Mask>192.168.0.0/24</Ip4Mask>\n` +
        `    </AllowedIps>\n` +
        `  </AuthorizationPolicy>\n` +
        `</AuthTokenRequest>`
    );
  });

  it('self closes empty nodes when no IP restrictions are supplied', () => {
    const request: AuthenticationTokenRequest = {
      challenge: 'minimal',
      contextIdentifier: { type: 'NipVatUe' },
      subjectIdentifierType: 'certificateFingerprint',
    };

    expect(serializeAuthTokenRequest(request)).toEqual(
      `<?xml version="1.0" encoding="utf-8"?>\n` +
        `<AuthTokenRequest xmlns="${AUTH_TOKEN_NAMESPACE}">\n` +
        `  <Challenge>minimal</Challenge>\n` +
        `  <ContextIdentifier>\n` +
        `    <NipVatUe />\n` +
        `  </ContextIdentifier>\n` +
        `  <SubjectIdentifierType>certificateFingerprint</SubjectIdentifierType>\n` +
        `  <AuthorizationPolicy>\n` +
        `    <AllowedIps />\n` +
        `  </AuthorizationPolicy>\n` +
        `</AuthTokenRequest>`
    );
  });

  it('escapes special characters to preserve a valid XML payload', () => {
    const request: AuthenticationTokenRequest = {
      challenge: 'value-with-<>&"\'',
      contextIdentifier: { type: 'PeppolId', value: 'abc&123' },
      subjectIdentifierType: SUBJECT,
    };

    expect(serializeAuthTokenRequest(request)).toContain('&lt;&gt;&amp;&quot;&apos;');
    expect(serializeAuthTokenRequest(request)).toContain('<PeppolId>abc&amp;123</PeppolId>');
  });

  it('rejects requests missing mandatory data', () => {
    expect(() =>
      serializeAuthTokenRequest({
        challenge: '   ',
        contextIdentifier: { type: 'Nip', value: '1' },
        subjectIdentifierType: SUBJECT,
      })
    ).toThrow('challenge');

    expect(() =>
      serializeAuthTokenRequest({
        challenge: 'value',
        // @ts-expect-error - validating runtime guard
        contextIdentifier: undefined,
        subjectIdentifierType: SUBJECT,
      })
    ).toThrow('context identifier');
  });
});
