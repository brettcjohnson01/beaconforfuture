export type ProjectStatus = 
  | "proposed" 
  | "approved" 
  | "under_construction" 
  | "operating" 
  | "cancelled" 
  | "unknown";

export interface LlcProject {
  id: string;
  projectName: string;
  codeName?: string;
  locationCity: string;
  locationCounty?: string;
  locationState?: string;
  locationCountry: string;
  latitude?: number;
  longitude?: number;
  status: ProjectStatus;
  facilityType?: string;
  utilityProvider?: string;
  knownIncentives?: string;
  notes?: string;
}

export interface LlcEntity {
  llcName: string;
  parentCompany: string;
  jurisdiction?: string;
  projects: LlcProject[];
  confidence: "confirmed" | "strongly_suggested" | "speculative";
  sources: string[];
}

export interface CompanyLlcProfile {
  slug: string;
  displayName: string;
  logoUrl?: string;
  description: string;
  llcs: LlcEntity[];
}
