export interface TaxIncentive {
  id: string;
  state: string;
  program_name: string;
  annual_revenue_loss_usd: number;
  claimed_jobs: number;
  actual_jobs: number;
  facilities_covered: string[];
}

export const taxIncentives: TaxIncentive[] = [
  {
    id: 'va-001',
    state: 'Virginia',
    program_name: 'Data Center Sales Tax Exemption',
    annual_revenue_loss_usd: 58000000,
    claimed_jobs: 85,
    actual_jobs: 42,
    facilities_covered: ['dc-001', 'dc-002']
  },
  {
    id: 'va-002',
    state: 'Virginia',
    program_name: 'Enterprise Zone Job Creation Grant',
    annual_revenue_loss_usd: 25000000,
    claimed_jobs: 40,
    actual_jobs: 27,
    facilities_covered: ['dc-001']
  },
  {
    id: 'mi-001',
    state: 'Michigan',
    program_name: 'Renaissance Zone Tax Abatement',
    annual_revenue_loss_usd: 42000000,
    claimed_jobs: 95,
    actual_jobs: 73,
    facilities_covered: ['dc-003', 'dc-004']
  },
  {
    id: 'tx-001',
    state: 'Texas',
    program_name: 'Chapter 313 Property Tax Limitation',
    annual_revenue_loss_usd: 68000000,
    claimed_jobs: 120,
    actual_jobs: 96,
    facilities_covered: ['dc-005', 'dc-006']
  },
  {
    id: 'il-001',
    state: 'Illinois',
    program_name: 'EDGE Tax Credit',
    annual_revenue_loss_usd: 35000000,
    claimed_jobs: 55,
    actual_jobs: 38,
    facilities_covered: ['dc-007']
  },
  {
    id: 'az-001',
    state: 'Arizona',
    program_name: 'Quality Jobs Tax Credit',
    annual_revenue_loss_usd: 28000000,
    claimed_jobs: 45,
    actual_jobs: 33,
    facilities_covered: ['dc-008']
  }
];

export const getIncentivesByState = (state: string): TaxIncentive[] => {
  return taxIncentives.filter(inc => inc.state === state);
};

export const getIncentiveById = (id: string): TaxIncentive | undefined => {
  return taxIncentives.find(inc => inc.id === id);
};

export const getStateStats = () => {
  const stateMap = new Map<string, {
    annual_revenue_loss: number;
    facilities: Set<string>;
    programs: number;
    claimed_jobs: number;
    actual_jobs: number;
  }>();

  taxIncentives.forEach(inc => {
    if (!stateMap.has(inc.state)) {
      stateMap.set(inc.state, {
        annual_revenue_loss: 0,
        facilities: new Set(),
        programs: 0,
        claimed_jobs: 0,
        actual_jobs: 0
      });
    }
    const stateData = stateMap.get(inc.state)!;
    stateData.annual_revenue_loss += inc.annual_revenue_loss_usd;
    stateData.programs += 1;
    stateData.claimed_jobs += inc.claimed_jobs;
    stateData.actual_jobs += inc.actual_jobs;
    inc.facilities_covered.forEach(f => stateData.facilities.add(f));
  });

  return Array.from(stateMap.entries()).map(([state, data]) => ({
    state,
    annual_revenue_loss: data.annual_revenue_loss,
    facilities_count: data.facilities.size,
    programs_count: data.programs,
    claimed_jobs: data.claimed_jobs,
    actual_jobs: data.actual_jobs,
    job_fulfillment: Math.round((data.actual_jobs / data.claimed_jobs) * 100)
  }));
};
