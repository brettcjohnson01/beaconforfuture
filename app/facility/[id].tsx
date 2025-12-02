import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Building2,
  Calendar,
  DollarSign,
  Users,
  Zap,
  Droplet,
  AlertTriangle,
  Factory,
} from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { facilities } from '@/mocks/facilities';
import { taxIncentives } from '@/mocks/taxIncentives';

interface InfoCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
}

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <Icon size={24} color="#F59E0B" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function FacilityDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const facility = facilities.find((f) => f.id === id);

  if (!facility) {
    return (
      <View style={styles.container}>
        <Navigation />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Facility not found</Text>
          <TouchableOpacity
            style={styles.backToMapButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToMapButtonText}>Back to Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const relatedIncentives = taxIncentives.filter((inc) =>
    inc.facilities_covered.includes(facility.id)
  );

  const homesEquivalent = Math.round(facility.mw_load * 1000);
  const annualCO2 = Math.round(facility.mw_load * 8760 * 0.5);

  return (
    <View style={styles.container}>
      <Navigation />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1E3A5F" />
          <Text style={styles.backButtonText}>Data Center Map</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.facilityName}>{facility.facility_name}</Text>
          <Text style={styles.facilityAddress}>
            {facility.address}
          </Text>
          <Text style={styles.facilityLocation}>
            {facility.city}, {facility.state} {facility.zip}
          </Text>
        </View>

        {facility.fossil_colocation && (
          <View style={styles.warningBanner}>
            <AlertTriangle size={24} color="#DC2626" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Fossil Fuel Co-location</Text>
              <Text style={styles.warningText}>
                This facility is co-located with{' '}
                {facility.fossil_plant_name || 'a fossil fuel plant'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operator & Infrastructure</Text>
          <View style={styles.infoGrid}>
            <InfoCard icon={Building2} label="Operator" value={facility.operator} />
            <InfoCard
              icon={Calendar}
              label="Established"
              value={facility.established_year.toString()}
            />
            <InfoCard
              icon={DollarSign}
              label="Investment"
              value={`$${Math.round(facility.investment_usd / 1000000)}M`}
            />
            <InfoCard
              icon={Users}
              label="Permanent Jobs"
              value={facility.permanent_jobs.toString()}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grid & Utility</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Grid Region:</Text>
            <Text style={styles.detailValue}>{facility.grid_region}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Utility:</Text>
            <Text style={styles.detailValue}>{facility.utility}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Energy Type:</Text>
            <Text style={styles.detailValue}>{facility.energy_type}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resource Consumption</Text>
          
          <View style={styles.resourceCard}>
            <Zap size={32} color="#F59E0B" />
            <Text style={styles.resourceValue}>{facility.mw_load} MW</Text>
            <Text style={styles.resourceDescription}>
              Enough to power approximately {homesEquivalent.toLocaleString()} homes
              (using 1 kW per home as a rough benchmark)
            </Text>
          </View>

          <View style={styles.resourceCard}>
            <Droplet size={32} color="#3B82F6" />
            <Text style={styles.resourceValue}>
              {facility.daily_water_gal.toLocaleString()} gallons/day
            </Text>
            <Text style={styles.resourceDescription}>
              Daily water consumption for cooling and operations
            </Text>
          </View>

          <View style={styles.resourceCard}>
            <Factory size={32} color="#6B7280" />
            <Text style={styles.resourceValue}>
              ~{annualCO2.toLocaleString()} tons CO₂/year
            </Text>
            <Text style={styles.resourceDescription}>
              Estimated annual emissions using regional grid mix (0.5 tons CO₂/MWh)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Impact Snapshot</Text>
          
          <View style={styles.ejScoreContainer}>
            <Text style={styles.ejScoreLabel}>EJScreen Overall Percentile</Text>
            <View style={styles.ejScoreBar}>
              <View
                style={[
                  styles.ejScoreFill,
                  {
                    width: `${facility.ej_percentile_overall}%`,
                    backgroundColor:
                      facility.ej_percentile_overall >= 80
                        ? '#DC2626'
                        : facility.ej_percentile_overall >= 70
                        ? '#F59E0B'
                        : '#10B981',
                  },
                ]}
              />
            </View>
            <Text style={styles.ejScoreValue}>{facility.ej_percentile_overall}th percentile</Text>
          </View>

          <View style={styles.ejMetrics}>
            <View style={styles.ejMetric}>
              <Text style={styles.ejMetricLabel}>PM2.5</Text>
              <Text style={styles.ejMetricValue}>{facility.ej_pm25_percentile}th</Text>
            </View>
            <View style={styles.ejMetric}>
              <Text style={styles.ejMetricLabel}>Diesel PM</Text>
              <Text style={styles.ejMetricValue}>{facility.ej_diesel_percentile}th</Text>
            </View>
            <View style={styles.ejMetric}>
              <Text style={styles.ejMetricLabel}>Energy Burden</Text>
              <Text style={styles.ejMetricValue}>
                {facility.ej_energy_burden_percentile}th
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Local Median Income:</Text>
            <Text style={styles.detailValue}>
              ${facility.median_income.toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Water Stress Level:</Text>
            <Text
              style={[
                styles.detailValue,
                facility.water_stress_level === 'High' && styles.detailValueWarning,
              ]}
            >
              {facility.water_stress_level}
            </Text>
          </View>
        </View>

        {relatedIncentives.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tax Incentives</Text>
            {relatedIncentives.map((inc) => (
              <View key={inc.id} style={styles.incentiveCard}>
                <Text style={styles.incentiveName}>{inc.program_name}</Text>
                <Text style={styles.incentiveText}>
                  State: {inc.state}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.toolsButton}
          onPress={() => router.push('/tools' as any)}
        >
          <Text style={styles.toolsButtonText}>View in BEACON Tools</Text>
        </TouchableOpacity>

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
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 32,
  },
  facilityName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 12,
  },
  facilityAddress: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 4,
  },
  facilityLocation: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  warningBanner: {
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#991B1B',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minWidth: 150,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  detailValueWarning: {
    color: '#DC2626',
  },
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
    marginTop: 12,
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  ejScoreContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  ejScoreLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  ejScoreBar: {
    height: 32,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  ejScoreFill: {
    height: '100%',
    borderRadius: 16,
  },
  ejScoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
    textAlign: 'center',
  },
  ejMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  ejMetric: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  ejMetricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  ejMetricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  incentiveCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  incentiveName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  incentiveText: {
    fontSize: 14,
    color: '#4B5563',
  },
  toolsButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 32,
    alignItems: 'center',
  },
  toolsButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 20,
  },
  backToMapButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToMapButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
  },
});
