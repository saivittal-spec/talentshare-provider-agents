
import { z } from "zod";
import type { ProviderProspect } from "../models/provider.js";

export const SubjectSchema = z.enum(["math", "english"]);

export const ProviderTypeSchema = z.enum([
  "tutor",
  "teacher",
  "instructor",
  "professor",
  "mentor",
  "coach",
  "subject_matter_expert",
  "creator",
  "other",
]);

export const QualificationStatusSchema = z.enum([
  "not_evaluated",
  "qualified",
  "review_required",
  "disqualified",
]);

export const PriorityTierSchema = z.enum([
  "not_scored",
  "high",
  "standard",
  "review",
  "low",
]);

export const ContactEligibilityStatusSchema = z.enum([
  "not_checked",
  "permitted",
  "blocked",
  "review_required",
]);

export const ProviderEvidenceSchema = z.object({
  id: z.string().min(1),
  sourceName: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  observedAt: z.iso.datetime(),
  fact: z.string().min(1),
});

export const ProviderProspectSchema = z.object({
    id: z.string().min(1),
    displayName: z.string().min(1),
    providerType: ProviderTypeSchema,

    subjects: z.array(SubjectSchema).min(1),
    specializations: z.array(z.string()),
    geography: z.string().nullable(),

    teachingExperienceYears: z.number().nonnegative().nullable(),
    subjectExperienceYears: z.number().nonnegative().nullable(),

    evidence: z.array(ProviderEvidenceSchema),

    qualificationStatus: QualificationStatusSchema,
    qualificationScore: z.number().min(0).max(100).nullable(),
    priorityTier: PriorityTierSchema,
    qualificationPolicyVersion: z.string().nullable(),

    contactEligibilityStatus: ContactEligibilityStatusSchema,
    isSuppressed: z.boolean(),

    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  });

export function validateProviderProspect(data: unknown) {
  return ProviderProspectSchema.safeParse(data);
}
