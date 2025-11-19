import {
  AuthenticationTokenAllowedIps,
  AuthenticationTokenAuthorizationPolicy,
  AuthenticationTokenRequest,
} from '../models/authorization/authentication-token.js';

const AUTH_TOKEN_NAMESPACE = 'http://ksef.mf.gov.pl/auth/token/2.0';

class XmlBuilder {
  private readonly lines: string[] = ['<?xml version="1.0" encoding="utf-8"?>'];
  private indentLevel = 0;

  private indent(): string {
    return '  '.repeat(this.indentLevel);
  }

  openTag(name: string, attributes: Record<string, string> = {}): void {
    const attrString = Object.entries(attributes)
      .map(([key, value]) => ` ${key}="${escapeXml(value)}"`)
      .join('');
    this.lines.push(`${this.indent()}<${name}${attrString}>`);
    this.indentLevel++;
  }

  closeTag(name: string): void {
    this.indentLevel = Math.max(0, this.indentLevel - 1);
    this.lines.push(`${this.indent()}</${name}>`);
  }

  element(name: string, rawValue?: string): void {
    if (rawValue === undefined || rawValue === null || rawValue.length === 0) {
      this.lines.push(`${this.indent()}<${name} />`);
      return;
    }
    this.lines.push(`${this.indent()}<${name}>${escapeXml(rawValue)}</${name}>`);
  }

  toString(): string {
    return this.lines.join('\n');
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function ensureAllowedIps(policy?: AuthenticationTokenAuthorizationPolicy): AuthenticationTokenAllowedIps {
  return policy?.allowedIps ?? {};
}

function serializeAllowedIps(builder: XmlBuilder, allowedIps: AuthenticationTokenAllowedIps): void {
  const { ip4Addresses, ip4Ranges, ip4Masks } = allowedIps;

  const appendCollection = (tagName: string, values?: readonly string[]) =>
    values?.forEach((ip) => builder.element(tagName, ip));

  if (!ip4Addresses?.length && !ip4Ranges?.length && !ip4Masks?.length) {
    builder.element('AllowedIps');
    return;
  }

  builder.openTag('AllowedIps');
  appendCollection('Ip4Address', ip4Addresses);
  appendCollection('Ip4Range', ip4Ranges);
  appendCollection('Ip4Mask', ip4Masks);
  builder.closeTag('AllowedIps');
}

export function serializeAuthTokenRequest(request: AuthenticationTokenRequest): string {
  if (!request?.challenge?.trim()) {
    throw new TypeError('Auth token request must contain a challenge value.');
  }
  if (!request.contextIdentifier) {
    throw new TypeError('Auth token request must define a context identifier.');
  }

  const builder = new XmlBuilder();
  builder.openTag('AuthTokenRequest', { xmlns: AUTH_TOKEN_NAMESPACE });
  builder.element('Challenge', request.challenge);

  builder.openTag('ContextIdentifier');
  builder.element(request.contextIdentifier.type, request.contextIdentifier.value);
  builder.closeTag('ContextIdentifier');

  builder.element('SubjectIdentifierType', request.subjectIdentifierType);

  builder.openTag('AuthorizationPolicy');
  serializeAllowedIps(builder, ensureAllowedIps(request.authorizationPolicy));
  builder.closeTag('AuthorizationPolicy');

  builder.closeTag('AuthTokenRequest');

  return builder.toString();
}

export { AUTH_TOKEN_NAMESPACE };
