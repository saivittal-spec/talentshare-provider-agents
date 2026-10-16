
export type ProviderSourceType =
  | "professional_website"
  | "instructor_website"
  | "directory"
  | "conference"
  | "professional_association"
  | "university"
  | "public_api"
  | "manual_import"
  | "referral"
  | "event"
  | "other";

export interface ProviderSource {
  id: string;
  providerId: string;
  sourceType: ProviderSourceType;
  sourceName: string;
  sourceUrl: string | null;
  discoveredAt: string;
  discoveryMethod: "manual" | "permitted_api" | "referral";
  notes: string | null;
}

export type ProviderEvidenceType =
  | "subject_expertise"
  | "teaching_experience"
  | "professional_experience"
  | "educational_content"
  | "credential"
  | "speaking_experience"
  | "other";

export interface ProviderEvidence {
  id: string;
  providerId: string;
  sourceId: string;
  evidenceType: ProviderEvidenceType;
  description: string;
  evidenceUrl: string | null;
  collectedAt: string;
  confidence: "low" | "medium" | "high";
}
