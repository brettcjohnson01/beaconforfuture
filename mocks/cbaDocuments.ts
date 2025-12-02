export type CbaSector = "Data Center" | "Wind" | "Solar" | "Cross-Sector";

export type CbaDocument = {
  id: string;
  title: string;
  sector: CbaSector;
  docType: "CBA" | "Host Community Agreement" | "Guide / Toolkit" | "Report / Case Studies";
  year?: number;
  parties?: string;
  location?: string;
  url: string;
  summary: string;
  tags?: string[];
};

export const cbaDocuments: CbaDocument[] = [
  {
    id: "lancaster-ai-hub-cba",
    title: "Lancaster AI Hub Community Benefits Agreement",
    sector: "Data Center",
    docType: "CBA",
    year: 2025,
    parties: "City of Lancaster, PA & Lancaster AI Hub entities",
    location: "Lancaster, Pennsylvania",
    url: "https://www.cityoflancasterpa.gov/wp-content/uploads/2025/10/Tentative-Commitments-10-14-25-Council-Distribution-.pdf",
    summary:
      "A detailed CBA between the City of Lancaster and the developers of the Lancaster AI Hub data centers. It outlines financial commitments to local funds, workforce and education programs, noise and environmental protections, and expectations around clean energy and community engagement. This is a strong example of a community trying to secure concrete, enforceable benefits in exchange for an AI data center campus.",
    tags: ["AI data centers", "local funds", "workforce", "environmental protections"],
  },
  {
    id: "washtenaw-data-center-toolkit",
    title: "Preliminary Toolkit for Municipal Data Center Planning",
    sector: "Data Center",
    docType: "Guide / Toolkit",
    year: 2025,
    parties: "Washtenaw County Resiliency Office",
    location: "Washtenaw County, Michigan",
    url: "https://content.civicplus.com/api/assets/ee280c75-b213-4c90-8d02-756fc3890329",
    summary:
      "A practical toolkit for local governments facing data center proposals. It explains key risks around water, energy, land use, and tax incentives, and includes a section on how municipalities can use Community Benefits Agreements and ordinances to set conditions for approval. It's useful both for understanding what to ask for and how to structure local rules.",
    tags: ["data centers", "local government", "ordinances", "CBA guidance"],
  },
  {
    id: "castle-wind-morro-bay-cba",
    title: "City of Morro Bay and Castle Wind Community Benefits Agreement",
    sector: "Wind",
    docType: "CBA",
    year: 2018,
    parties: "City of Morro Bay, CA & Castle Wind LLC",
    location: "Morro Bay, California",
    url: "https://climate.law.columbia.edu/sites/default/files/content/CBAs/08.%20Morro%20Bay%20Executed.pdf",
    summary:
      "A CBA for a proposed 1000-MW offshore wind project offshore of Morro Bay. The agreement includes a lump-sum payment to the city, commitments to local hiring and training, port and harbor improvements, and cooperation with local fishing interests. It is a good model of how coastal communities have negotiated concrete benefits from offshore wind developers.",
    tags: ["offshore wind", "local payments", "jobs", "harbor improvements"],
  },
  {
    id: "gpi-solar-cba-guide",
    title: "Community Benefits Agreements for Solar Development",
    sector: "Solar",
    docType: "Guide / Toolkit",
    year: 2025,
    parties: "Great Plains Institute",
    location: "Midwest / United States",
    url: "https://betterenergy.org/wp-content/uploads/2025/02/Community-Benefits-Agreement.pdf",
    summary:
      "A resource guide to help local governments and community groups negotiate CBAs for utility-scale solar projects. It walks through how to build a community coalition, communicate with developers, and draft clauses related to payments, land use, natural resource protection, and local economic benefits. It's especially helpful for understanding what a solar-specific CBA can cover.",
    tags: ["solar", "local government", "example clauses", "coalition building"],
  },
  {
    id: "catf-cba-case-studies",
    title: "Community Benefits Agreements: Case Studies, Federal Guidelines, Best Practices",
    sector: "Cross-Sector",
    docType: "Report / Case Studies",
    year: 2023,
    parties: "Clean Air Task Force",
    location: "United States",
    url: "https://cdn.catf.us/wp-content/uploads/2023/11/30172616/community-benefits-agreements-case-studies-federal-guidelines-best-practices.pdf",
    summary:
      "A national report that compiles case studies of CBAs across different infrastructure sectors and explains how they align with recent federal guidance on community benefits. It highlights key lessons on process, enforcement, and equity, and includes examples of benefit packages negotiated with energy and industrial developers. This is useful background for communities wanting to see how CBAs are evolving in practice.",
    tags: ["federal guidance", "case studies", "best practices", "multiple sectors"],
  },
];
