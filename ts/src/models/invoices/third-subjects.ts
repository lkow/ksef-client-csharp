import type { ThirdSubjectIdentifier } from "./third-subject-identifier.js";

export interface ThirdSubjects {
  readonly identifier: ThirdSubjectIdentifier;
  readonly name: string;
  readonly role: number;
}
