
import { describe, expect, it } from "vitest";
import { canTransition } from "../src/models/workflow.js";

describe("Provider Workflow", () => {
  it("allows discovery to research", () => {
    expect(canTransition("discovered", "researched")).toBe(true);
  });

  it("prevents discovery directly to outreach", () => {
    expect(canTransition("discovered", "outreach_sent")).toBe(false);
  });

  it("prevents rejected providers from progressing", () => {
    expect(canTransition("rejected", "qualified")).toBe(false);
    expect(canTransition("rejected", "outreach_sent")).toBe(false);
  });

  it("requires approval before outreach", () => {
    expect(canTransition("drafted", "outreach_sent")).toBe(false);
    expect(canTransition("drafted", "approved")).toBe(true);
  });

  it("allows approved workflow to reach outreach stage", () => {
    expect(canTransition("approved", "outreach_sent")).toBe(true);
  });

  it("prevents skipping registration before activation", () => {
    expect(canTransition("responded", "activated")).toBe(false);
    expect(canTransition("registered", "activated")).toBe(true);
  });
});
