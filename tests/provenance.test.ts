
import { describe, expect, it } from "vitest";

import type {
  ProviderSource,
  ProviderEvidence,
} from "../src/models/provenance.js";

describe("Provider Provenance", () => {
  it("links provider evidence to its source", () => {
    const source: ProviderSource = {
      id: "source-001",
      providerId: "provider-001",
      sourceType: "professional_website",
      sourceName: "Example Tutor Website",
      sourceUrl: "https://example.com/tutor",
      discoveredAt: "2026-10-16T12:00:00Z",
      discoveryMethod: "manual",
      notes: null,
    };

    const evidence: ProviderEvidence = {
      id: "evidence-001",
      providerId: "provider-001",
      sourceId: source.id,
      evidenceType: "teaching_experience",
      description: "Public website describes tutoring experience.",
      evidenceUrl: source.sourceUrl,
      collectedAt: "2026-10-16T12:05:00Z",
      confidence: "medium",
    };

    expect(evidence.sourceId).toBe(source.id);
    expect(evidence.providerId).toBe(source.providerId);
  });
});
