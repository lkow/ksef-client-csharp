import { describe, expect, it } from 'vitest';
import { GrantPermissionClient } from '../grant-permission-client.js';
import { RouteBuilder } from '../../http/route-builder.js';
import { FakeRestClient } from './test-utils.js';

const samplePersonRequest = {
  subjectIdentifier: { type: 'Nip', value: '1234567890' },
  permissions: ['InvoiceRead'],
};

const sampleEntityRequest = {
  subjectIdentifier: { type: 'Nip', value: '1234567890' },
  permissions: [{ type: 'InvoiceRead', canDelegate: true }],
};

const sampleAuthorizationRequest = {
  subjectIdentifier: { type: 'Nip', value: '1234567890' },
  permission: 'SelfInvoicing',
};

const sampleIndirectRequest = {
  subjectIdentifier: { type: 'Nip', value: '1234567890' },
  targetIdentifier: { type: 'Nip', value: '2222222222' },
  permissions: ['InvoiceRead'],
};

const sampleSubunitRequest = {
  subjectIdentifier: { type: 'Nip', value: '1234567890' },
  contextIdentifier: { type: 'Nip', value: '0987654321' },
};

const sampleEuEntityRequest = {
  subjectIdentifier: { type: 'Fingerprint', value: 'fingerprint' },
  contextIdentifier: { type: 'NipVatUe', value: 'PL1234567890' },
};

const sampleEuEntityRepresentativeRequest = {
  subjectIdentifier: { type: 'Nip', value: '1234567890' },
  permissions: ['InvoiceRead'],
};

describe('GrantPermissionClient', () => {
  const buildClient = () => {
    const rest = new FakeRestClient({ referenceNumber: 'op-123' });
    const client = new GrantPermissionClient({ restClient: rest, routeBuilder: new RouteBuilder() });
    return { client, rest };
  };

  it.each([
    {
      name: 'person grants',
      call: (client: GrantPermissionClient) => client.grantPermissionsForPerson(samplePersonRequest, 'token'),
      path: '/api/v2/permissions/persons/grants',
    },
    {
      name: 'entity grants',
      call: (client: GrantPermissionClient) => client.grantPermissionsForEntity(sampleEntityRequest, 'token'),
      path: '/api/v2/permissions/entities/grants',
    },
    {
      name: 'authorization grants',
      call: (client: GrantPermissionClient) => client.grantAuthorizationPermissions(sampleAuthorizationRequest, 'token'),
      path: '/api/v2/permissions/authorizations/grants',
    },
    {
      name: 'indirect entity grants',
      call: (client: GrantPermissionClient) => client.grantPermissionsForIndirectEntity(sampleIndirectRequest, 'token'),
      path: '/api/v2/permissions/indirect/grants',
    },
    {
      name: 'subunit grants',
      call: (client: GrantPermissionClient) => client.grantPermissionsForSubunit(sampleSubunitRequest, 'token'),
      path: '/api/v2/permissions/subunits/grants',
    },
    {
      name: 'eu entity grants',
      call: (client: GrantPermissionClient) => client.grantPermissionsForEuEntity(sampleEuEntityRequest, 'token'),
      path: '/api/v2/permissions/eu-entities/administration/grants',
    },
    {
      name: 'eu entity representatives grants',
      call: (client: GrantPermissionClient) =>
        client.grantPermissionsForEuEntityRepresentative(sampleEuEntityRepresentativeRequest, 'token'),
      path: '/api/v2/permissions/eu-entities/grants',
    },
  ])('calls endpoint for $name', async ({ call, path }) => {
    const { client, rest } = buildClient();

    await call(client);

    expect(rest.lastRequest?.path).toBe(path);
    expect(rest.lastRequest?.method).toBe('POST');
    expect(rest.lastRequest?.accessToken).toBe('token');
    expect('body' in (rest.lastRequest ?? {})).toBe(true);
  });

  it('validates arguments', async () => {
    const { client } = buildClient();

    expect(() => client.grantPermissionsForPerson(undefined as never, 'token')).toThrow(
      'requestPayload cannot be null',
    );
    expect(() => client.grantPermissionsForPerson(samplePersonRequest, '   ')).toThrow('accessToken cannot be empty');
  });
});
