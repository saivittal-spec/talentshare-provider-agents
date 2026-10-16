
import { randomUUID } from "node:crypto";
import type {
  ProviderProspect,
  ProviderType,
  Subject,
} from "../models/provider.js";
import { ProviderProspectSchema } from "../schema/provider.schema.js";

export interface ManualProviderInput {
  displayName: string;
  providerType: ProviderType;
  subjects: Subject[];
  specializations?: string[];
  geography?: string | null;
  teachingExperienceYears?: number | null;
  subjectExperienceYears?: number | null;

  sourceName: string;
  sourceUrl?: string;
  sourceFact: string;
}

export function importManualProvider(
  input: ManualProviderInput,
): ProviderProspect {
  const now = new Date().toISOString();

  const provider: ProviderProspect = {
    id: randomUUID(),
    displayName: input.displayName.trim(),
    providerType: input.providerType,
    subjects: input.subjects,
    specializations: input.specializations ?? [],
    geography: input.geography ?? null,
    teachingExperienceYears:
      input.teachingExperienceYears ?? null,
    subjectExperienceYears:
      input.subjectExperienceYears ?? null,

    evidence: [
      {
        id: randomUUID(),
        sourceName: input.sourceName.trim(),
        ...(input.sourceUrl
          ? { sourceUrl: input.sourceUrl }
          : {}),
        observedAt: now,
        fact: input.sourceFact.trim(),
      },
    ],

    qualificationStatus: "not_evaluated",
    qualificationScore: null,
    priorityTier: "not_scored",
    qualificationPolicyVersion: null,

    contactEligibilityStatus: "not_checked",
    isSuppressed: false,

    createdAt: now,
    updatedAt: now,
  };

  return ProviderProspectSchema.parse(provider);
}
