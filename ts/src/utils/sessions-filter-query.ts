import type { SessionsFilter } from "../models/sessions/sessions-filter.js";

const ISO_WITHOUT_MS = /\.\d{3}Z$/;

export function applySessionsFilterParams(target: URLSearchParams, filter?: SessionsFilter | null): void {
  if (!filter) {
    return;
  }
  if (!target) {
    throw new Error("target cannot be null");
  }

  const appendDate = (key: keyof SessionsFilter, paramName: string) => {
    const value = filter[key];
    if (value instanceof Date) {
      target.append(paramName, toIsoWithoutMs(value));
    }
  };

  const referenceNumber = filter.referenceNumber?.trim();
  if (referenceNumber) {
    target.append("referenceNumber", referenceNumber);
  }

  appendDate("dateCreatedFrom", "dateCreatedFrom");
  appendDate("dateCreatedTo", "dateCreatedTo");
  appendDate("dateClosedFrom", "dateClosedFrom");
  appendDate("dateClosedTo", "dateClosedTo");
  appendDate("dateModifiedFrom", "dateModifiedFrom");
  appendDate("dateModifiedTo", "dateModifiedTo");

  if (filter.statuses && filter.statuses.length > 0) {
    const statuses = filter.statuses.filter(Boolean).join(",");
    if (statuses.length > 0) {
      target.append("statuses", statuses);
    }
  }
}

function toIsoWithoutMs(date: Date): string {
  const iso = date.toISOString();
  return ISO_WITHOUT_MS.test(iso) ? iso.replace(ISO_WITHOUT_MS, "Z") : iso;
}
