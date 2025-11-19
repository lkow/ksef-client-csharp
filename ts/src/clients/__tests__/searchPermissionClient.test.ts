import { describe, expect, it } from 'vitest';
import { SearchPermissionClient } from '../search-permission-client.js';
import { RouteBuilder } from '../../http/route-builder.js';
import { FakeRestClient } from './test-utils.js';

const personalQuery = {
  contextIdentifier: { type: 'Nip', value: '1111111111' },
  targetIdentifier: { type: 'Nip', value: '2222222222' },
  permissionTypes: ['InvoiceRead'],
};

const personQuery = {
  authorIdentifier: { type: 'Nip', value: '3333333333' },
  targetIdentifier: { type: 'Nip', value: '4444444444' },
  permissionTypes: ['InvoiceRead'],
  queryType: 'PermissionsInCurrentContext',
};

const subunitQuery = {
  subunitIdentifier: { type: 'Nip', value: '5555555555' },
};

const subordinateQuery = {
  subordinateEntityIdentifier: { type: 'Nip', value: '6666666666' },
};

const entityAuthQuery = {
  queryType: 'Granted',
  permissionTypes: ['SelfInvoicing'],
};

const euEntityQuery = {
  permissionTypes: ['InvoiceRead'],
};

describe('SearchPermissionClient', () => {
  const buildClient = () => {
    const rest = new FakeRestClient({ permissions: [], hasMore: false });
    const client = new SearchPermissionClient({ restClient: rest, routeBuilder: new RouteBuilder() });
    return { rest, client };
  };

  it('searches personal permissions with pagination', async () => {
    const { client, rest } = buildClient();

    await client.searchGrantedPersonalPermissions(personalQuery, 'token', 1, 5);

    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/query/personal/grants?pageSize=5&pageOffset=1');
    expect('body' in (rest.lastRequest ?? {})).toBe(true);
  });

  it('searches person permissions', async () => {
    const { client, rest } = buildClient();

    await client.searchGrantedPersonPermissions(personQuery, 'token');

    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/query/persons/grants');
    const personRequest = rest.lastRequest as { body?: unknown };
    expect(personRequest.body).toMatchObject(personQuery);
  });

  it('searches subunit permissions', async () => {
    const { client, rest } = buildClient();

    await client.searchSubunitAdminPermissions(subunitQuery, 'token', 2, 20);

    expect(rest.lastRequest?.path).toContain('/api/v2/permissions/query/subunits/grants');
    expect(rest.lastRequest?.path).toContain('pageSize=20');
  });

  it('searches entity invoice roles', async () => {
    const { client, rest } = buildClient();

    await client.searchEntityInvoiceRoles('token', 10, 5);

    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/query/entities/roles?pageSize=5&pageOffset=10');
    expect(rest.lastRequest?.method).toBe('GET');
  });

  it('searches subordinate entity roles', async () => {
    const { client, rest } = buildClient();

    await client.searchSubordinateEntityInvoiceRoles(subordinateQuery, 'token');

    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/query/subordinate-entities/roles');
    const subordinateRequest = rest.lastRequest as { body?: unknown };
    expect(subordinateRequest.body).toMatchObject(subordinateQuery);
  });

  it('searches authorization grants and eu entity permissions', async () => {
    const { client, rest } = buildClient();

    await client.searchEntityAuthorizationGrants(entityAuthQuery, 'token', 1, 1);
    expect(rest.lastRequest?.path).toContain('/api/v2/permissions/query/authorizations/grants');

    await client.searchGrantedEuEntityPermissions(euEntityQuery, 'token');
    expect(rest.lastRequest?.path).toBe('/api/v2/permissions/query/eu-entities/grants');
  });

  it('validates access token and payload', async () => {
    const { client } = buildClient();

    expect(() => client.searchGrantedPersonalPermissions(undefined as never, 'token')).toThrow(
      'requestPayload cannot be null',
    );
    expect(() => client.searchEntityInvoiceRoles('')).toThrow('accessToken cannot be empty');
  });
});
