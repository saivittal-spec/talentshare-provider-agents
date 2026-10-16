
export type ProviderWorkflowStatus =
  | "discovered"
  | "researched"
  | "qualified"
  | "review_required"
  | "rejected"
  | "segmented"
  | "drafted"
  | "approved"
  | "outreach_sent"
  | "responded"
  | "registered"
  | "activated";

export interface ProviderWorkflow {
  providerId: string;
  status: ProviderWorkflowStatus;
  updatedAt: string;
}

export const allowedTransitions: Record<
  ProviderWorkflowStatus,
  readonly ProviderWorkflowStatus[]
> = {
  discovered: ["researched", "rejected"],
  researched: ["qualified", "review_required", "rejected"],
  qualified: ["segmented", "review_required", "rejected"],
  review_required: ["qualified", "rejected"],
  rejected: [],
  segmented: ["drafted", "rejected"],
  drafted: ["approved", "rejected"],
  approved: ["outreach_sent", "rejected"],
  outreach_sent: ["responded"],
  responded: ["registered"],
  registered: ["activated"],
  activated: [],
};

export function canTransition(
  from: ProviderWorkflowStatus,
  to: ProviderWorkflowStatus
): boolean {
  return allowedTransitions[from].includes(to);
}
