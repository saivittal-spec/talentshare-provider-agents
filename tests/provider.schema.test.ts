
import { describe, expect, it } from "vitest";
import { validateProviderProspect } from "../src/schema/provider.schema.js";

const validProvider = {
  id: "provider-001",
  displayName: "Example Maths Tutor",
  providerType: "tutor",
  subjects: ["math"],
  specializations: ["Algebra"],
  geography: "United States",
  teachingExperienceYears: 5,
  subjectExperienceYears: 7,
  evidence: [],
  qualificationStatus: "not_evaluated",
  qualificationScore: null,
  priorityTier: "not_scored",
  qualificationPolicyVersion: null,
  contactEligibilityStatus: "not_checked",
  isSuppressed: false,
  createdAt: "2026-10-16T12:00:00Z",
  updatedAt: "2026-10-16T12:00:00Z",
};

describe("Provider Schema Validation", () => {
  it("accepts a valid provider", () => {
    const result = validateProviderProspect(validProvider);
    expect(result.success).toBe(true);
  });

  it("rejects an unsupported subject", () => {
    const result = validateProviderProspect({
      ...validProvider,
      subjects: ["physics"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative experience", () => {
    const result = validateProviderProspect({
      ...validProvider,
      teachingExperienceYears: -2,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a qualification score above 100", () => {
    const result = validateProviderProspect({
      ...validProvider,
      qualificationScore: 120,
    });
    expect(result.success).toBe(false);
  });
});
