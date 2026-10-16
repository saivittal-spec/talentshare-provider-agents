
import type { ProviderProspect } from "../models/provider.js";

export interface ProviderRepository {
  findById(id: string): Promise<ProviderProspect | null>;

  findAll(): Promise<ProviderProspect[]>;

  create(provider: ProviderProspect): Promise<ProviderProspect>;

  update(provider: ProviderProspect): Promise<ProviderProspect>;
}
