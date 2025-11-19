const POLYNOMIAL = 0x07;
const INIT_VALUE = 0x00;
const EXPECTED_LENGTH = 35;
const DATA_LENGTH = 32;
const CHECKSUM_LENGTH = 2;

const textEncoder = new TextEncoder();

export interface KsefNumberValidationResult {
  readonly valid: boolean;
  readonly errorMessage?: string;
}

export class KsefNumberValidator {
  /**
   * Validates whether the provided KSeF number matches the checksum and length expected by MF.
   */
  public static isValid(ksefNumber: string): KsefNumberValidationResult {
    if (!ksefNumber || !ksefNumber.trim()) {
      return { valid: false, errorMessage: 'Numer KSeF jest pusty.' };
    }

    if (ksefNumber.length !== EXPECTED_LENGTH) {
      return {
        valid: false,
        errorMessage: `Numer KSeF ma nieprawidłową długość: ${ksefNumber.length}. Oczekiwana długość to ${EXPECTED_LENGTH}.`,
      };
    }

    const data = ksefNumber.substring(0, DATA_LENGTH);
    const checksum = ksefNumber.substring(EXPECTED_LENGTH - CHECKSUM_LENGTH);
    const calculated = computeChecksum(textEncoder.encode(data));

    return { valid: calculated === checksum };
  }
}

function computeChecksum(data: Uint8Array): string {
  let crc = INIT_VALUE;

  for (const b of data) {
    crc ^= b;
    for (let i = 0; i < 8; i += 1) {
      if ((crc & 0x80) !== 0) {
        crc = ((crc << 1) ^ POLYNOMIAL) & 0xff;
      } else {
        crc = (crc << 1) & 0xff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(2, '0');
}
