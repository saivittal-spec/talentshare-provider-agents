
import type { ProviderProspect } from "./models/provider";

const provider: ProviderProspect = {
  id: "provider-001",
  displayName: "Example Mathematics Tutor",
  providerType: "tutor",

  subjects: ["math"],
  specializations: ["Algebra", "Calculus"],
  geography: "United States",

  teachingExperienceYears: 3,
  subjectExperienceYears: 5,

  evidence: [
    {
      id: "evidence-001",
      sourceName: "Synthetic test data",
      observedAt: "2026-10-16",
      fact: "Fictional mathematics tutor with teaching experience",
    },
  ],

  qualificationStatus: "not_evaluated",
  qualificationScore: null,
  priorityTier: "not_scored",
  qualificationPolicyVersion: null,

  contactEligibilityStatus: "not_checked",
  isSuppressed: false,

  createdAt: "2026-10-16T12:00:00Z",
  updatedAt: "2026-10-16T12:00:00Z",
};

console.log("TalentShare Provider Prospect:");
console.log(JSON.stringify(provider, null, 2));
