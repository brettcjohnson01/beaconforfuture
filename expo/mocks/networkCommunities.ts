export type ProjectStatus =
  | "No project yet"
  | "Proposed"
  | "Planning / permitting"
  | "Under construction"
  | "Operating";

export type OrganizingLevel = "Just starting" | "Some organizing" | "Strong coalition";

export type NetworkCommunity = {
  id: string;
  name: string;
  state: string;
  county?: string;
  communityType: "Rural" | "Small Town" | "Suburb" | "City";
  projectStatus: ProjectStatus;
  developer: string;
  llcOrCodename?: string;
  zoning: string;
  decisionMakers: string[];
  organizingLevel: OrganizingLevel;
  tags: string[];
  description: string;
};

export const mockNetworkCommunities: NetworkCommunity[] = [
  {
    id: "bowling-green-oh",
    name: "Bowling Green",
    state: "Ohio",
    county: "Wood County",
    communityType: "Small Town",
    projectStatus: "Planning / permitting",
    developer: "Meta",
    llcOrCodename: "Liames LLC / Project Accordion",
    zoning: "Agricultural to Industrial",
    decisionMakers: ["County commission", "Township board"],
    organizingLevel: "Some organizing",
    tags: ["Meta", "farmland conversion", "tax abatements"],
    description:
      "Proposed Meta AI data center on 800+ acres of farmland. Community organizing around water use and tax incentives.",
  },
  {
    id: "los-lunas-nm",
    name: "Los Lunas",
    state: "New Mexico",
    county: "Valencia County",
    communityType: "Small Town",
    projectStatus: "Under construction",
    developer: "Meta",
    llcOrCodename: "Greater Kudu LLC",
    zoning: "Industrial",
    decisionMakers: ["County commission", "Utility commission"],
    organizingLevel: "Some organizing",
    tags: ["Meta", "water stress", "IRB financing"],
    description:
      "Expanding Meta data center campus with significant water use concerns in an arid region.",
  },
  {
    id: "west-memphis-ar",
    name: "West Memphis",
    state: "Arkansas",
    county: "Crittenden County",
    communityType: "Small Town",
    projectStatus: "Planning / permitting",
    developer: "Google",
    llcOrCodename: "Groot LLC / Project Pyramid",
    zoning: "Industrial",
    decisionMakers: ["City council"],
    organizingLevel: "Just starting",
    tags: ["Google", "PILOT agreement", "large incentives"],
    description:
      "Massive Google campus proposal with 30-year PILOT. Community just beginning to organize.",
  },
  {
    id: "prince-william-va",
    name: "Prince William County",
    state: "Virginia",
    county: "Prince William County",
    communityType: "Suburb",
    projectStatus: "Proposed",
    developer: "Various (Data Center Alley)",
    zoning: "Mixed",
    decisionMakers: ["County commission", "Planning commission"],
    organizingLevel: "Strong coalition",
    tags: ["multiple developers", "moratorium", "data center alley"],
    description:
      "Strong community coalition successfully advocating for data center regulations and moratoria.",
  },
  {
    id: "cheyenne-wy",
    name: "Cheyenne",
    state: "Wyoming",
    county: "Laramie County",
    communityType: "City",
    projectStatus: "Operating",
    developer: "Meta",
    llcOrCodename: "Goat Systems LLC / Project Cosmo",
    zoning: "Industrial (Business Park)",
    decisionMakers: ["City council", "Planning commission"],
    organizingLevel: "Some organizing",
    tags: ["Meta", "infrastructure impacts", "expansion"],
    description: "Large Meta campus with ongoing expansion. Growing concerns about infrastructure strain.",
  },
  {
    id: "midlothian-tx",
    name: "Midlothian",
    state: "Texas",
    county: "Ellis County",
    communityType: "Small Town",
    projectStatus: "Operating",
    developer: "Google",
    llcOrCodename: "Sharka LLC",
    zoning: "Industrial",
    decisionMakers: ["City council"],
    organizingLevel: "Just starting",
    tags: ["Google", "property tax abatement", "RailPort"],
    description: "Operating Google campus with 100% property tax abatement. Limited organizing activity.",
  },
  {
    id: "lincoln-ne",
    name: "Lincoln",
    state: "Nebraska",
    county: "Lancaster County",
    communityType: "City",
    projectStatus: "Planning / permitting",
    developer: "Google",
    llcOrCodename: "Agate LLC",
    zoning: "Industrial",
    decisionMakers: ["City council", "Planning commission"],
    organizingLevel: "Some organizing",
    tags: ["Google", "economic development", "large campus"],
    description: "Proposed Google campus on 570+ acres with local economic development incentives.",
  },
  {
    id: "st-charles-mo",
    name: "St. Charles",
    state: "Missouri",
    county: "St. Charles County",
    communityType: "Suburb",
    projectStatus: "Proposed",
    developer: "Google (suspected)",
    llcOrCodename: "Spark Innovations LLC",
    zoning: "Under negotiation",
    decisionMakers: ["County commission"],
    organizingLevel: "Some organizing",
    tags: ["Google", "secrecy", "NDAs"],
    description:
      "Controversial proposal marked by secrecy and NDAs. Community organizing around transparency.",
  },
  {
    id: "new-albany-oh",
    name: "New Albany",
    state: "Ohio",
    county: "Licking / Franklin County",
    communityType: "Suburb",
    projectStatus: "Operating",
    developer: "Google",
    llcOrCodename: "Montauk Innovations LLC",
    zoning: "Special district",
    decisionMakers: ["City council"],
    organizingLevel: "Just starting",
    tags: ["Google", "CRA agreements", "expansion"],
    description: "Established Google campus with ongoing expansions. Limited community engagement.",
  },
  {
    id: "the-dalles-or",
    name: "The Dalles",
    state: "Oregon",
    county: "Wasco County",
    communityType: "Small Town",
    projectStatus: "Under construction",
    developer: "Google",
    llcOrCodename: "Design LLC",
    zoning: "Industrial",
    decisionMakers: ["County commission", "City council"],
    organizingLevel: "Some organizing",
    tags: ["Google", "river cooling", "expansion"],
    description: "Google expansion project near Columbia River. Concerns about water and energy use.",
  },
];
