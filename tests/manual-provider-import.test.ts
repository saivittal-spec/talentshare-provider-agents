
import { describe, expect, it } from "vitest";
import { importManualProvider } from "../src/services/manual-provider-import.js";
import type { ManualProviderInput } from "../src/services/manual-provider-import.js";

const validInput: ManualProviderInput = {
  displayName: " Sarah Johnson ",
  providerType: "tutor",
  subjects: ["math"],
  specializations: ["Algebra", "Geometry"],
  geography: "Boston, MA",
  teachingExperienceYears: 5,
  subjectExperienceYears: 7,
  sourceName: " Professional Website ",
  sourceUrl: "https://example.com/sarah",
  sourceFact: " Offers online math tutoring ",
};

describe("PA-008: Manual Provider Import", () => {
  it("creates a valid provider record", () => {
    const provider = importManualProvider(validInput);

    expect(provider.id).toBeTruthy();
    expect(provider.displayName).toBe("Sarah Johnson");
    expect(provider.providerType).toBe("tutor");
    expect(provider.subjects).toEqual(["math"]);
    expect(provider.specializations).toEqual([
      "Algebra",
      "Geometry",
    ]);
    expect(provider.geography).toBe("Boston, MA");
    expect(provider.teachingExperienceYears).toBe(5);
    expect(provider.subjectExperienceYears).toBe(7);
  });

  it("generates unique provider and evidence IDs", () => {
    const first = importManualProvider(validInput);
    const second = importManualProvider(validInput);

    expect(first.id).not.toBe(second.id);
    expect(first.evidence[0]?.id).not.toBe(
      second.evidence[0]?.id,
    );
  });

  it("preserves source evidence", () => {
    const provider = importManualProvider(validInput);
    const evidence = provider.evidence[0];

    expect(evidence?.id).toBeTruthy();
    expect(evidence?.sourceName).toBe(
      "Professional Website",
    );
    expect(evidence?.sourceUrl).toBe(
      "https://example.com/sarah",
    );
    expect(evidence?.fact).toBe(
      "Offers online math tutoring",
    );
    expect(evidence?.observedAt).toBeTruthy();
  });

  it("sets safe initial qualification statuses", () => {
    const provider = importManualProvider(validInput);

    expect(provider.qualificationStatus).toBe(
      "not_evaluated",
    );
    expect(provider.qualificationScore).toBeNull();
    expect(provider.priorityTier).toBe("not_scored");
    expect(provider.qualificationPolicyVersion).toBeNull();
    expect(provider.contactEligibilityStatus).toBe(
      "not_checked",
    );
    expect(provider.isSuppressed).toBe(false);
  });

  it("sets valid creation and update timestamps", () => {
    const provider = importManualProvider(validInput);

    expect(Number.isNaN(Date.parse(provider.createdAt)))
      .toBe(false);
    expect(provider.updatedAt).toBe(provider.createdAt);
  });

  it("handles optional fields correctly", () => {
    const provider = importManualProvider({
      displayName: "John Smith",
      providerType: "teacher",
      subjects: ["english"],
      sourceName: "Referral",
      sourceFact: "Recommended as an English teacher",
    });

    expect(provider.specializations).toEqual([]);
    expect(provider.geography).toBeNull();
    expect(provider.teachingExperienceYears).toBeNull();
    expect(provider.subjectExperienceYears).toBeNull();
    expect(provider.evidence[0]?.sourceUrl).toBeUndefined();
  });

  it("rejects an invalid subject", () => {
    expect(() =>
      importManualProvider({
        ...validInput,
        subjects: ["science" as "math"],
      }),
    ).toThrow();
  });

  it("rejects negative teaching experience", () => {
    expect(() =>
      importManualProvider({
        ...validInput,
        teachingExperienceYears: -2,
      }),
    ).toThrow();
  });

  it("rejects an invalid source URL", () => {
    expect(() =>
      importManualProvider({
        ...validInput,
        sourceUrl: "not-a-valid-url",
      }),
    ).toThrow();
  });

  it("rejects a blank provider name", () => {
    expect(() =>
      importManualProvider({
        ...validInput,
        displayName: "   ",
      }),
    ).toThrow();
  });

  it("rejects a blank source name", () => {
    expect(() =>
      importManualProvider({
        ...validInput,
        sourceName: "   ",
      }),
    ).toThrow();
  });

  it("rejects a blank source fact", () => {
    expect(() =>
      importManualProvider({
        ...validInput,
        sourceFact: "   ",
      }),
    ).toThrow();
  });
});
