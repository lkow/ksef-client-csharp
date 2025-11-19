import type { BuyerIdentifier } from "./buyer-identifier.js";

export interface Buyer {
  readonly identifier: BuyerIdentifier;
  readonly name: string;
}
