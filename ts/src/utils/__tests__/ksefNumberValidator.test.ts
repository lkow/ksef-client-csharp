import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { KsefNumberValidator } from '../ksefNumberValidator.js';

const DATA_LENGTH = 32;
const FILLER_INDEX = 32;

const textEncoder = new TextEncoder();

function buildKsefNumber(data32: string, filler: string): string {
  const checksum = computeChecksum(data32);
  return data32 + filler + checksum;
}

function computeChecksum(data32: string): string {
  let crc = 0x00;
  const bytes = textEncoder.encode(data32);
  for (const b of bytes) {
    crc ^= b;
    for (let i = 0; i < 8; i += 1) {
      if ((crc & 0x80) !== 0) {
        crc = ((crc << 1) ^ 0x07) & 0xff;
      } else {
        crc = (crc << 1) & 0xff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(2, '0');
}

function getRandomConventionalData32(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const part1 = randomHex(10);
  const part2 = randomHex(10);
  const suffix = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');
  const full = `${date}-EE-${part1}-${part2}-${suffix}`;
  return full.substring(0, DATA_LENGTH);
}

function randomHex(length: number): string {
  const bytes = randomBytes(Math.ceil(length / 2));
  return [...bytes].map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join('').substring(0, length);
}

describe('KsefNumberValidator', () => {
  it('returns false and message when number is empty or whitespace', () => {
    const emptyResult = KsefNumberValidator.isValid('');
    const whitespaceResult = KsefNumberValidator.isValid('   ');

    expect(emptyResult.valid).toBe(false);
    expect(emptyResult.errorMessage).toBe('Numer KSeF jest pusty.');
    expect(whitespaceResult.valid).toBe(false);
    expect(whitespaceResult.errorMessage).toBe('Numer KSeF jest pusty.');
  });

  it('returns false and message when length differs from 35', () => {
    const data32 = getRandomConventionalData32();
    const checksum = computeChecksum(data32);
    const tooShort = data32 + checksum;

    const result = KsefNumberValidator.isValid(tooShort);

    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe('Numer KSeF ma nieprawidłową długość: 34. Oczekiwana długość to 35.');
  });

  it('returns true for valid data and checksum', () => {
    const data32 = getRandomConventionalData32();
    const ksef = buildKsefNumber(data32, 'X');

    const result = KsefNumberValidator.isValid(ksef);

    expect(result.valid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('returns false when checksum is mismatched', () => {
    const data32 = getRandomConventionalData32();
    const ksef = buildKsefNumber(data32, 'X');
    const invalid = ksef.slice(0, -1) + (ksef.at(-1) === '0' ? '1' : '0');

    const result = KsefNumberValidator.isValid(invalid);

    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBeUndefined();
  });

  it('ignores changes to the filler character (current behavior parity)', () => {
    const data32 = getRandomConventionalData32();
    const base = buildKsefNumber(data32, 'X');
    const altered = base.substring(0, FILLER_INDEX) + 'Y' + base.substring(FILLER_INDEX + 1);

    const baseResult = KsefNumberValidator.isValid(base);
    const alteredResult = KsefNumberValidator.isValid(altered);

    expect(baseResult.valid).toBe(true);
    expect(alteredResult.valid).toBe(true);
  });
});
