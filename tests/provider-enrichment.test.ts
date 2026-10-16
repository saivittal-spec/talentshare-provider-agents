
import { describe, expect, it } from "vitest";
import { importManualProvider } from "../src/services/manual-provider-import.js";
import { enrichProvider } from "../src/services/provider-enrichment.js";
import { ProviderProspectSchema } from "../src/schema/provider.schema.js";

function makeProvider() {
  return importManualProvider({
    displayName: "Jane Smith",
    providerType: "tutor",
    subjects: ["math"],
    specializations: ["Algebra"],
    geography: "United States",
    teachingExperienceYears: 3,
    subjectExperienceYears: 5,
    sourceName: "Manual Referral",
    sourceFact: "Jane teaches mathematics.",
  });
}

const enrichment = {
  specializations: ["Calculus"],
  geography: "Boston, MA",
  teachingExperienceYears: 6,
  subjectExperienceYears: 8,
  sourceName: "Professional Website",
  sourceUrl: "https://example.com/jane",
  sourceFact: "Jane has six years of teaching experience.",
};

describe("PA-010: Basic Provider Enrichment", () => {
  it("enriches an existing provider", () => {
    const result = enrichProvider(makeProvider(), enrichment);

    expect(result.specializations).toEqual([
      "Algebra",
      "Calculus",
    ]);
    expect(result.geography).toBe("Boston, MA");
    expect(result.teachingExperienceYears).toBe(6);
    expect(result.subjectExperienceYears).toBe(8);
  });

  it("preserves the provider ID", () => {
    const provider = makeProvider();
    const result = enrichProvider(provider, enrichment);

    expect(result.id).toBe(provider.id);
  });

  it("adds evidence without deleting existing evidence", () => {
    const provider = makeProvider();
    const result = enrichProvider(provider, enrichment);

    expect(result.evidence).toHaveLength(2);
    expect(result.evidence[0]).toEqual(provider.evidence[0]);
    expect(result.evidence[1]).toMatchObject({
      sourceName: "Professional Website",
      sourceUrl: "https://example.com/jane",
      fact: "Jane has six years of teaching experience.",
    });
    expect(result.evidence[1]?.id).toBeTruthy();
    expect(result.evidence[1]?.observedAt).toBeTruthy();
  });

  it("preserves existing fields when updates are omitted", () => {
    const provider = makeProvider();

    const result = enrichProvider(provider, {
      sourceName: "Referral",
      sourceFact: "Confirmed teaching background.",
    });

    expect(result.specializations).toEqual(
      provider.specializations,
    );
    expect(result.geography).toBe(provider.geography);
    expect(result.teachingExperienceYears).toBe(
      provider.teachingExperienceYears,
    );
    expect(result.subjectExperienceYears).toBe(
      provider.subjectExperienceYears,
    );
  });

  it("avoids duplicate specializations", () => {
    const result = enrichProvider(makeProvider(), {
      ...enrichment,
      specializations: ["Algebra", "Calculus", "Calculus"],
    });

    expect(result.specializations).toEqual([
      "Algebra",
      "Calculus",
    ]);
  });

  it("preserves qualification decisions", () => {
    const provider = {
      ...makeProvider(),
      qualificationStatus: "qualified" as const,
      qualificationScore: 85,
      priorityTier: "high" as const,
      qualificationPolicyVersion: "v1",
    };

    const result = enrichProvider(provider, enrichment);

    expect(result.qualificationStatus).toBe("qualified");
    expect(result.qualificationScore).toBe(85);
    expect(result.priorityTier).toBe("high");
    expect(result.qualificationPolicyVersion).toBe("v1");
  });

  it("preserves contact eligibility and suppression", () => {
    const provider = {
      ...makeProvider(),
      contactEligibilityStatus: "blocked" as const,
      isSuppressed: true,
    };

    const result = enrichProvider(provider, enrichment);

    expect(result.contactEligibilityStatus).toBe("blocked");
    expect(result.isSuppressed).toBe(true);
  });

  it("does not mutate the original provider", () => {
    const provider = makeProvider();
    const original = structuredClone(provider);

    enrichProvider(provider, enrichment);

    expect(provider).toEqual(original);
  });

  it("rejects blank source names", () => {
    expect(() =>
      enrichProvider(makeProvider(), {
        sourceName: "   ",
        sourceFact: "Verified experience.",
      }),
    ).toThrow();
  });

  it("rejects blank source facts", () => {
    expect(() =>
      enrichProvider(makeProvider(), {
        sourceName: "Website",
        sourceFact: "   ",
      }),
    ).toThrow();
  });

  it("rejects invalid experience values", () => {
    expect(() =>
      enrichProvider(makeProvider(), {
        ...enrichment,
        teachingExperienceYears: -2,
      }),
    ).toThrow();
  });

  it("rejects invalid source URLs", () => {
    expect(() =>
      enrichProvider(makeProvider(), {
        ...enrichment,
        sourceUrl: "not-a-valid-url",
      }),
    ).toThrow();
  });

  it("returns a valid provider prospect", () => {
    const result = enrichProvider(makeProvider(), enrichment);

    expect(
      ProviderProspectSchema.safeParse(result).success,
    ).toBe(true);
  });
});
