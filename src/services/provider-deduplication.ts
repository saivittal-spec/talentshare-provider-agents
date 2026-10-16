
import type { ProviderProspect } from "../models/provider.js";
import type { ProviderRepository } from "../repositories/provider.repository.js";

export type DuplicateStatus =
  | "possible_duplicate"
  | "no_match";

export interface DuplicateMatch {
  providerId: string;
  reason: string;
}

export interface DeduplicationResult {
  status: DuplicateStatus;
  matches: DuplicateMatch[];
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeSourceUrl(url: string): string {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.search = "";
  parsed.hostname = parsed.hostname.toLowerCase();
  parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
  return parsed.toString();
}

export async function checkProviderDuplicates(
  incoming: ProviderProspect,
  repository: ProviderRepository,
): Promise<DeduplicationResult> {
  const existingProviders = await repository.findAll();
  const matches: DuplicateMatch[] = [];

  for (const existing of existingProviders) {
    if (existing.id === incoming.id) continue;

    const sameName =
      normalizeName(existing.displayName) ===
      normalizeName(incoming.displayName);

    
const sharedSourceUrl = existing.evidence.some(
  (existingEvidence) => {
    const existingUrl = existingEvidence.sourceUrl;

    if (!existingUrl) return false;

    return incoming.evidence.some((incomingEvidence) => {
      const incomingUrl = incomingEvidence.sourceUrl;

      if (!incomingUrl) return false;

      return (
        normalizeSourceUrl(existingUrl) ===
        normalizeSourceUrl(incomingUrl)
      );
    });
  },
);

    const sharedSubject = existing.subjects.some((subject) =>
      incoming.subjects.includes(subject),
    );

    if (sameName && sharedSourceUrl) {
      matches.push({
        providerId: existing.id,
        reason: "Same name and source URL",
      });
    } else if (sameName && sharedSubject) {
      matches.push({
        providerId: existing.id,
        reason: "Same name and overlapping subject",
      });
    }
  }

  return {
    status: matches.length > 0 ? "possible_duplicate" : "no_match",
    matches,
  };
}
