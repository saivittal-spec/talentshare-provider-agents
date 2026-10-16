
import { randomUUID } from "node:crypto";
import type { ProviderProspect } from "../models/provider.js";
import { ProviderProspectSchema } from "../schema/provider.schema.js";

export interface ProviderEnrichmentInput {
  specializations?: string[];
  geography?: string | null;
  teachingExperienceYears?: number | null;
  subjectExperienceYears?: number | null;

  sourceName: string;
  sourceUrl?: string;
  sourceFact: string;
}

export function enrichProvider(
  provider: ProviderProspect,
  input: ProviderEnrichmentInput,
): ProviderProspect {
  // Validate the existing record before modifying it.
  const existing = ProviderProspectSchema.parse(provider);

  const sourceName = input.sourceName.trim();
  const sourceFact = input.sourceFact.trim();

  if (!sourceName || !sourceFact) {
    throw new Error(
      "Enrichment requires a source name and supporting fact.",
    );
  }

  const now = new Date().toISOString();

  const newEvidence = {
    id: randomUUID(),
    sourceName,
    ...(input.sourceUrl !== undefined
      ? { sourceUrl: input.sourceUrl }
      : {}),
    observedAt: now,
    fact: sourceFact,
  };

  const specializations =
    input.specializations === undefined
      ? existing.specializations
      : [
          ...new Set([
            ...existing.specializations,
            ...input.specializations.map((value) => value.trim()),
          ]),
        ];

  const enriched: ProviderProspect = {
    ...existing,

    specializations,
    geography:
      input.geography === undefined
        ? existing.geography
        : input.geography,

    teachingExperienceYears:
      input.teachingExperienceYears === undefined
        ? existing.teachingExperienceYears
        : input.teachingExperienceYears,

    subjectExperienceYears:
      input.subjectExperienceYears === undefined
        ? existing.subjectExperienceYears
        : input.subjectExperienceYears,

    evidence: [...existing.evidence, newEvidence],

    updatedAt: now,
  };

  return ProviderProspectSchema.parse(enriched);
}
