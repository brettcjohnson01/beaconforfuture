import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DollarSign, TrendingDown, Users, AlertTriangle } from 'lucide-react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getStateStats } from '@/mocks/taxIncentives';

interface SummaryCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  value: string;
  label: string;
}

function SummaryCard({ icon: Icon, value, label }: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <Icon size={32} color="#F59E0B" />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

type SortOption = 'revenue' | 'jobs' | 'alpha';

export default function TaxIncentivesPage() {
  const [sortBy, setSortBy] = useState<SortOption>('revenue');
  
  const stateStats = useMemo(() => getStateStats(), []);

  const totalRevenueLoss = stateStats.reduce(
    (sum, state) => sum + state.annual_revenue_loss,
    0
  );
  const totalClaimedJobs = stateStats.reduce((sum, state) => sum + state.claimed_jobs, 0);
  const totalActualJobs = stateStats.reduce((sum, state) => sum + state.actual_jobs, 0);
  const avgFulfillment = Math.round((totalActualJobs / totalClaimedJobs) * 100);
  const jobGap = totalClaimedJobs - totalActualJobs;

  const sortedStates = useMemo(() => {
    const sorted = [...stateStats];
    switch (sortBy) {
      case 'revenue':
        return sorted.sort((a, b) => b.annual_revenue_loss - a.annual_revenue_loss);
      case 'jobs':
        return sorted.sort((a, b) => b.job_fulfillment - a.job_fulfillment);
      case 'alpha':
        return sorted.sort((a, b) => a.state.localeCompare(b.state));
      default:
        return sorted;
    }
  }, [stateStats, sortBy]);

  return (
    <View style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Tax Incentive Transparency</Text>
          <Text style={styles.pageSubtitle}>
            Analyzing the true cost of data center tax breaks
          </Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>National Summary</Text>
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon={DollarSign}
              value={`$${Math.round(totalRevenueLoss / 1000000)}M`}
              label="Annual Revenue Loss (sample)"
            />
            <SummaryCard
              icon={Users}
              value={jobGap.toString()}
              label="Job Creation Gap (claimed vs actual)"
            />
            <SummaryCard
              icon={TrendingDown}
              value={`${avgFulfillment}%`}
              label="Avg Job Fulfillment"
            />
          </View>
        </View>

        <View style={styles.statesSection}>
          <View style={styles.statesSectionHeader}>
            <Text style={styles.sectionTitle}>By State</Text>
            
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'revenue' && styles.sortButtonActive]}
                onPress={() => setSortBy('revenue')}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === 'revenue' && styles.sortButtonTextActive,
                  ]}
                >
                  Revenue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'jobs' && styles.sortButtonActive]}
                onPress={() => setSortBy('jobs')}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === 'jobs' && styles.sortButtonTextActive,
                  ]}
                >
                  Jobs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'alpha' && styles.sortButtonActive]}
                onPress={() => setSortBy('alpha')}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === 'alpha' && styles.sortButtonTextActive,
                  ]}
                >
                  A–Z
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {sortedStates.map((state) => (
            <View key={state.state} style={styles.stateCard}>
              <View style={styles.stateHeader}>
                <Text style={styles.stateName}>{state.state}</Text>
                <View style={styles.stateMetrics}>
                  <View style={styles.stateMetric}>
                    <Text style={styles.stateMetricLabel}>Annual Revenue Loss</Text>
                    <Text style={styles.stateMetricValue}>
                      ${(state.annual_revenue_loss / 1000000).toFixed(1)}M
                    </Text>
                  </View>
                  <View style={styles.stateMetric}>
                    <Text style={styles.stateMetricLabel}>Facilities</Text>
                    <Text style={styles.stateMetricValue}>{state.facilities_count}</Text>
                  </View>
                  <View style={styles.stateMetric}>
                    <Text style={styles.stateMetricLabel}>Incentive Programs</Text>
                    <Text style={styles.stateMetricValue}>{state.programs_count}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.jobsSection}>
                <Text style={styles.jobsSectionTitle}>Job Creation Performance</Text>
                
                <View style={styles.jobBars}>
                  <View style={styles.jobBarRow}>
                    <Text style={styles.jobBarLabel}>Claimed Jobs</Text>
                    <View style={styles.jobBar}>
                      <View
                        style={[
                          styles.jobBarFill,
                          styles.jobBarClaimed,
                          { width: '100%' },
                        ]}
                      />
                    </View>
                    <Text style={styles.jobBarValue}>{state.claimed_jobs}</Text>
                  </View>

                  <View style={styles.jobBarRow}>
                    <Text style={styles.jobBarLabel}>Actual Jobs</Text>
                    <View style={styles.jobBar}>
                      <View
                        style={[
                          styles.jobBarFill,
                          styles.jobBarActual,
                          {
                            width: `${state.job_fulfillment}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.jobBarValue}>{state.actual_jobs}</Text>
                  </View>
                </View>

                <Text style={styles.jobFulfillmentText}>
                  {state.job_fulfillment}% job creation fulfillment
                </Text>

                {state.job_fulfillment < 60 && (
                  <View style={styles.warningBanner}>
                    <AlertTriangle size={20} color="#DC2626" />
                    <Text style={styles.warningText}>
                      Significantly underperforming on job creation commitments
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 48,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 12,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  summarySection: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 32,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 24,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 250,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E3A5F',
    marginTop: 12,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  statesSection: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  statesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  sortButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  sortButtonTextActive: {
    color: '#1E3A5F',
  },
  stateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stateHeader: {
    marginBottom: 24,
  },
  stateName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 16,
  },
  stateMetrics: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  stateMetric: {
    flex: 1,
    minWidth: 120,
  },
  stateMetricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  stateMetricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  jobsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 24,
  },
  jobsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 16,
  },
  jobBars: {
    gap: 16,
    marginBottom: 12,
  },
  jobBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  jobBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    width: 100,
  },
  jobBar: {
    flex: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    overflow: 'hidden',
  },
  jobBarFill: {
    height: '100%',
    borderRadius: 16,
  },
  jobBarClaimed: {
    backgroundColor: '#93C5FD',
  },
  jobBarActual: {
    backgroundColor: '#10B981',
  },
  jobBarValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    width: 60,
    textAlign: 'right',
  },
  jobFulfillmentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  warningBanner: {
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
  },
});
