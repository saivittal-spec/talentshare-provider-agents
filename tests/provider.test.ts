import { describe, expect, it } from "vitest";
import type { ProviderProspect } from "../src/models/provider.js";

describe("Provider Prospect", () => {
  it("keeps qualification and contact eligibility separate", () => {
    const provider: Partial<ProviderProspect> = {
      qualificationStatus: "qualified",
      qualificationScore: 85,
      priorityTier: "high",
      contactEligibilityStatus: "blocked",
      isSuppressed: true,
    };

    expect(provider.qualificationStatus).toBe("qualified");
    expect(provider.contactEligibilityStatus).toBe("blocked");
    expect(provider.isSuppressed).toBe(true);
  });
});
