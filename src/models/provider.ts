
export type Subject = "math" | "english";

export type ProviderType =
  | "tutor"
  | "teacher"
  | "instructor"
  | "professor"
  | "mentor"
  | "coach"
  | "subject_matter_expert"
  | "creator"
  | "other";

export type QualificationStatus =
  | "not_evaluated"
  | "qualified"
  | "review_required"
  | "disqualified";

export type PriorityTier =
  | "not_scored"
  | "high"
  | "standard"
  | "review"
  | "low";

export interface ProviderEvidence {
  id: string;
  sourceName: string;
  sourceUrl?: string;
  observedAt: string;
  fact: string;
}

export interface ProviderProspect {
  id: string;
  displayName: string;
  providerType: ProviderType;

  subjects: Subject[];
  specializations: string[];
  geography: string | null;

  teachingExperienceYears: number | null;
  subjectExperienceYears: number | null;

  evidence: ProviderEvidence[];

  qualificationStatus: QualificationStatus;
  qualificationScore: number | null;
  priorityTier: PriorityTier;
  qualificationPolicyVersion: string | null;

  contactEligibilityStatus:
    | "not_checked"
    | "permitted"
    | "blocked"
    | "review_required";

  isSuppressed: boolean;

  createdAt: string;
  updatedAt: string;
}
