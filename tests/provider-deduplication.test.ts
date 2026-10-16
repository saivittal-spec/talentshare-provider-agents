
import { describe, expect, it } from "vitest";
import type { ProviderProspect } from "../src/models/provider.js";
import type { ProviderRepository } from "../src/repositories/provider.repository.js";
import { importManualProvider } from "../src/services/manual-provider-import.js";
import { checkProviderDuplicates } from "../src/services/provider-deduplication.js";

function makeProvider(
  name: string,
  subjects: ("math" | "english")[],
  sourceUrl?: string,
): ProviderProspect {
  return importManualProvider({
    displayName: name,
    providerType: "tutor",
    subjects,
    sourceName: "Test Directory",
    sourceFact: "Provider profile found in test directory",
    ...(sourceUrl ? { sourceUrl } : {}),
  });
}

function makeRepository(
  providers: ProviderProspect[],
): ProviderRepository {
  return {
    findAll: async () => providers,
    findById: async (id) =>
      providers.find((provider) => provider.id === id) ?? null,
    create: async (provider) => provider,
    update: async (provider) => provider,
  };
}

describe("PA-009: Provider Deduplication", () => {
  it("detects the same name and source URL", async () => {
    const existing = makeProvider(
      "Jane Smith",
      ["math"],
      "https://example.com/jane",
    );

    const incoming = makeProvider(
      "  JANE   SMITH ",
      ["english"],
      "https://example.com/jane/",
    );

    const result = await checkProviderDuplicates(
      incoming,
      makeRepository([existing]),
    );

    expect(result.status).toBe("possible_duplicate");
    expect(result.matches).toEqual([
      {
        providerId: existing.id,
        reason: "Same name and source URL",
      },
    ]);
  });

  it("detects the same name and overlapping subject", async () => {
    const existing = makeProvider("John Doe", ["math"]);
    const incoming = makeProvider(" john  doe ", [
      "math",
      "english",
    ]);

    const result = await checkProviderDuplicates(
      incoming,
      makeRepository([existing]),
    );

    expect(result.status).toBe("possible_duplicate");
    expect(result.matches).toEqual([
      {
        providerId: existing.id,
        reason: "Same name and overlapping subject",
      },
    ]);
  });

  it("does not match different names", async () => {
    const existing = makeProvider("Jane Smith", ["math"]);
    const incoming = makeProvider("John Doe", ["math"]);

    const result = await checkProviderDuplicates(
      incoming,
      makeRepository([existing]),
    );

    expect(result.status).toBe("no_match");
    expect(result.matches).toEqual([]);
  });

  it("does not match the same name with unrelated subjects", async () => {
    const existing = makeProvider("Alex Taylor", ["math"]);
    const incoming = makeProvider("Alex Taylor", ["english"]);

    const result = await checkProviderDuplicates(
      incoming,
      makeRepository([existing]),
    );

    expect(result.status).toBe("no_match");
  });

  it("does not compare a provider against itself", async () => {
    const provider = makeProvider(
      "Jane Smith",
      ["math"],
      "https://example.com/jane",
    );

    const result = await checkProviderDuplicates(
      provider,
      makeRepository([provider]),
    );

    expect(result.status).toBe("no_match");
    expect(result.matches).toEqual([]);
  });

  it("handles an empty repository", async () => {
    const incoming = makeProvider("New Tutor", ["english"]);

    const result = await checkProviderDuplicates(
      incoming,
      makeRepository([]),
    );

    expect(result.status).toBe("no_match");
    expect(result.matches).toEqual([]);
  });

  it("returns multiple possible matches", async () => {
    const first = makeProvider("Jane Smith", ["math"]);
    const second = makeProvider(" jane smith ", ["math"]);
    const incoming = makeProvider("JANE SMITH", ["math"]);

    const result = await checkProviderDuplicates(
      incoming,
      makeRepository([first, second]),
    );

    expect(result.status).toBe("possible_duplicate");
    expect(result.matches).toHaveLength(2);
  });

  it("ignores URL query parameters and fragments", async () => {
    const existing = makeProvider(
      "Jane Smith",
      ["math"],
      "https://example.com/jane?ref=directory#about",
    );

    const incoming = makeProvider(
      "Jane Smith",
      ["english"],
      "https://example.com/jane",
    );

    const result = await checkProviderDuplicates(
      incoming,
      makeRepository([existing]),
    );

    expect(result.matches[0]?.reason).toBe(
      "Same name and source URL",
    );
  });
});
