import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Zap, Droplet, DollarSign, Users } from 'lucide-react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface InfoCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
}

function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <Icon size={32} color="#F59E0B" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

interface DataSourceCardProps {
  title: string;
  description: string;
}

function DataSourceCard({ title, description }: DataSourceCardProps) {
  return (
    <View style={styles.dataSourceCard}>
      <Text style={styles.dataSourceTitle}>{title}</Text>
      <Text style={styles.dataSourceDescription}>{description}</Text>
    </View>
  );
}

interface MethodCardProps {
  title: string;
  description: string;
}

function MethodCard({ title, description }: MethodCardProps) {
  return (
    <View style={styles.methodCard}>
      <Text style={styles.methodTitle}>{title}</Text>
      <Text style={styles.methodDescription}>{description}</Text>
    </View>
  );
}

export default function AboutPage() {
  return (
    <View style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>About BEACON</Text>
          <Text style={styles.pageSubtitle}>
            Community Data Center Transparency & Empowerment Tool
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            BEACON exists to bring transparency to the data center industry and empower
            communities to understand the true impact of these facilities on their
            environment, economy, and quality of life. Data centers are critical
            infrastructure for our digital economy, but their rapid expansion often
            happens behind closed doors. Communities deserve access to clear,
            comprehensive information about energy consumption, water usage, tax
            incentives, and environmental impacts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Track</Text>
          <View style={styles.infoGrid}>
            <InfoCard
              icon={Zap}
              title="Energy Consumption"
              description="Power load in megawatts, grid connections, and energy sources."
            />
            <InfoCard
              icon={Droplet}
              title="Water Usage"
              description="Daily water consumption and local water stress indicators."
            />
            <InfoCard
              icon={DollarSign}
              title="Tax Incentives"
              description="State and local tax breaks, revenue loss, and job commitments."
            />
            <InfoCard
              icon={Users}
              title="Community Impact"
              description="EPA EJScreen scores, demographics, and environmental burdens."
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sources</Text>
          
          <DataSourceCard
            title="EIA Form-861 & Utility Reports"
            description="Electric power sales, revenue, customers, and NAICS 518210 (data processing and hosting). We analyze utility interconnection data and power consumption reports to identify and quantify data center loads."
          />

          <DataSourceCard
            title="EPA EJScreen"
            description="Census-tract level environmental justice indicators including PM2.5, diesel particulate matter, energy burden, demographics, and socioeconomic factors. We use the latest EJScreen dataset to assess community impact."
          />

          <DataSourceCard
            title="State Tax Expenditure Reports"
            description="Data center sales and use tax exemptions, property tax abatements, and revenue loss estimates from state tax expenditure reports. Includes FOIA-obtained data from state revenue departments where needed."
          />

          <DataSourceCard
            title="DataCenterMap & Industry Reports"
            description="Facility locations, operators, power capacity estimates, and development announcements from industry directories, corporate filings, and trade publications."
          />

          <DataSourceCard
            title="USGS & WRI Aqueduct"
            description="County-level water stress indicators, baseline water stress scores, and drought risk data from the U.S. Geological Survey and World Resources Institute Aqueduct project."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Methodology</Text>

          <MethodCard
            title="Facility Identification"
            description="Data centers are identified based on utility interconnection data, industry directories, environmental permits, and corporate announcements. Each facility is geocoded and linked to the nearest census tract for community impact analysis."
          />

          <MethodCard
            title="Energy & Water Data"
            description="Power load estimates are derived from utility filings, interconnection agreements, and public reports. Water use is estimated using industry averages for cooling systems given MW capacity and climate zone. Actual consumption may vary significantly."
          />

          <MethodCard
            title="Tax Incentive Estimates"
            description="Tax incentive data is compiled from state tax expenditure reports, local economic development agreements, and FOIA requests. Revenue loss and job figures are estimates based on reported exemptions and claimed benefits, not independently audited."
          />

          <MethodCard
            title="Community Metrics"
            description="EJScreen, demographic, and income data are aggregated at the census tract or county level. Water stress indicators are from USGS and WRI Aqueduct. These metrics provide context but do not capture all aspects of community impact."
          />
        </View>

        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerTitle}>Important Notes</Text>
          <Text style={styles.disclaimerText}>
            • This platform aggregates publicly available data and industry estimates.
            Individual facility data may contain inaccuracies or outdated information.
          </Text>
          <Text style={styles.disclaimerText}>
            • Tax incentive figures represent estimated revenue loss to state and local
            governments, not total project investment.
          </Text>
          <Text style={styles.disclaimerText}>
            • Environmental justice scores are relative percentiles comparing census
            tracts nationally. Higher percentiles indicate higher environmental burdens.
          </Text>
          <Text style={styles.disclaimerText}>
            • BEACON is an independent project. We are not affiliated with data center
            operators, utilities, or government agencies.
          </Text>
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
  section: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 24,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 24,
  },
  missionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    flex: 1,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
    marginTop: 12,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  dataSourceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dataSourceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  dataSourceDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  methodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  methodDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  disclaimerSection: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 32,
    marginTop: 24,
  },
  disclaimerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 16,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
    paddingHorizontal: 16,
    maxWidth: 800,
    marginHorizontal: 'auto',
  },
});
