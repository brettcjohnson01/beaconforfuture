import { CompanyLlcProfile } from '@/types/llc';

export const metaLlcProfile: CompanyLlcProfile = {
  slug: 'meta',
  displayName: 'Meta Platforms, Inc.',
  description: 'Meta frequently uses single-purpose LLCs to acquire land, secure incentives, and develop hyperscale data centers before its identity is public.',
  llcs: [
    {
      llcName: 'Greater Kudu LLC',
      parentCompany: 'Meta Platforms, Inc.',
      confidence: 'confirmed',
      jurisdiction: 'Delaware',
      sources: [
        'https://example.com/meta-source1',
        'https://example.com/meta-source2',
      ],
      projects: [
        {
          id: 'meta-greaterkudu-001',
          projectName: 'Los Lunas Data Center & AI Expansion',
          locationCity: 'Los Lunas',
          locationCounty: 'Valencia County',
          locationState: 'New Mexico',
          locationCountry: 'USA',
          latitude: 34.8064,
          longitude: -106.7331,
          status: 'operating',
          facilityType: 'hyperscale data center campus',
          knownIncentives: 'Large industrial revenue bond packages and tax incentives',
          notes: 'Multi-building hyperscale campus (~750 acres). Significant local concern about water use and tax policy. Subsidiary used to develop and expand Meta\'s Los Lunas data center campus.',
        },
      ],
    },
    {
      llcName: 'Goat Systems LLC',
      parentCompany: 'Meta Platforms, Inc.',
      confidence: 'confirmed',
      jurisdiction: 'Delaware',
      sources: [
        'https://example.com/meta-source3',
        'https://example.com/meta-source4',
      ],
      projects: [
        {
          id: 'meta-goatsystems-001',
          projectName: 'Cheyenne Data Center Campus',
          codeName: 'Project Cosmo',
          locationCity: 'Cheyenne',
          locationCounty: 'Laramie County',
          locationState: 'Wyoming',
          locationCountry: 'USA',
          latitude: 41.1400,
          longitude: -104.8202,
          status: 'operating',
          facilityType: 'hyperscale data center campus',
          knownIncentives: 'Local development agreements and infrastructure support',
          notes: 'Initially presented only under "Goat Systems LLC". Located in High Plains Business Park (~945 acres). Tied to local road and utility expansion. Landowner and developer for Meta\'s data center campus.',
        },
      ],
    },
    {
      llcName: 'Liames LLC',
      parentCompany: 'Meta Platforms, Inc.',
      confidence: 'confirmed',
      jurisdiction: 'Delaware',
      sources: [
        'https://example.com/meta-source5',
        'https://example.com/meta-source6',
      ],
      projects: [
        {
          id: 'meta-liames-001',
          projectName: 'Bowling Green AI Data Center',
          codeName: 'Project Accordion',
          locationCity: 'Middleton Township / Bowling Green',
          locationCounty: 'Wood County',
          locationState: 'Ohio',
          locationCountry: 'USA',
          latitude: 41.3748,
          longitude: -83.6513,
          status: 'under_construction',
          facilityType: 'AI-optimized data center campus',
          knownIncentives: 'Tax abatements and publicly supported infrastructure improvements',
          notes: 'Large farmland-to-data-center conversion (~800-900 acres). High-energy AI-optimized campus. Landholding entity for Meta\'s AI-optimized data center campus.',
        },
      ],
    },
  ],
};
