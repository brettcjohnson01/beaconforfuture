import { useRouter } from 'expo-router';
import { Building2 } from 'lucide-react-native';
import React, { useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { googleLlcProfile } from '@/mocks/llc/google';
import { metaLlcProfile } from '@/mocks/llc/meta';
import { CompanyLlcProfile } from '@/types/llc';
import { LlcMap, LlcProjectLocation } from '@/components/LlcMap';

const companyProfiles: CompanyLlcProfile[] = [
  googleLlcProfile,
  metaLlcProfile,
];

interface CompanyCardProps {
  profile: CompanyLlcProfile;
  onPress: () => void;
}

function CompanyCard({ profile, onPress }: CompanyCardProps) {
  const llcCount = profile.llcs.length;
  const projectCount = profile.llcs.reduce((sum, llc) => sum + llc.projects.length, 0);

  return (
    <TouchableOpacity style={styles.companyCard} onPress={onPress}>
      <View style={styles.companyCardHeader}>
        <Building2 size={40} color="#F59E0B" />
        <Text style={styles.companyName}>{profile.displayName}</Text>
      </View>
      
      <Text style={styles.companyDescription}>{profile.description}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{llcCount}</Text>
          <Text style={styles.statLabel}>LLC Entities</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{projectCount}</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>View LLCs</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function LlcTrackerPage() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const allProjectLocations = useMemo<LlcProjectLocation[]>(() => {
    return companyProfiles.flatMap((profile) =>
      profile.llcs.flatMap((llc) =>
        llc.projects
          .filter((project) => project.latitude !== undefined && project.longitude !== undefined)
          .map((project) => ({
            id: project.id,
            company: profile.displayName,
            llcName: llc.llcName,
            projectName: project.projectName,
            codeName: project.codeName,
            city: project.locationCity,
            state: project.locationState || '',
            country: project.locationCountry,
            latitude: project.latitude!,
            longitude: project.longitude!,
            status: project.status,
          }))
      )
    );
  }, []);



  return (
    <View style={styles.container}>
      <Navigation />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>LLC Tracker</Text>
          <Text style={styles.subtitle}>
            Track shell companies and LLCs used by hyperscalers for data center development,
            land acquisition, and tax incentive agreements.
          </Text>
        </View>

        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>Map of Tracked Data Center LLCs</Text>
          <Text style={styles.mapSubtitle}>
            {allProjectLocations.length} data center projects across {companyProfiles.length} hyperscalers
          </Text>
          <View style={styles.mapWrapper}>
            <LlcMap 
              projects={allProjectLocations}
            />
          </View>
        </View>

        <View style={styles.companiesSection}>
          <Text style={styles.sectionTitle}>Hyperscaler Companies</Text>
          
          <View style={styles.companiesGrid}>
            {companyProfiles.map((profile) => (
              <CompanyCard
                key={profile.slug}
                profile={profile}
                onPress={() => router.push(`/llc-tracker/${profile.slug}` as any)}
              />
            ))}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>How to add more companies:</Text>
            <Text style={styles.infoBoxText}>
              1. Create a new data file in mocks/llc/[company].ts using the CompanyLlcProfile interface{'\n'}
              2. Import the profile and add it to the companyProfiles array in this file{'\n'}
              3. The company will automatically appear on this page with its own detail page
            </Text>
          </View>
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
    paddingVertical: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#D1D5DB',
    lineHeight: 26,
    textAlign: 'center',
    maxWidth: 800,
  },
  companiesSection: {
    paddingHorizontal: 16,
    paddingVertical: 48,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 24,
    textAlign: 'center',
  },
  companiesGrid: {
    gap: 24,
    marginBottom: 32,
  },
  companyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  companyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  companyName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E3A5F',
  },
  companyDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  buttonContainer: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1E3A5F',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  mapContainer: {
    backgroundColor: 'white',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mapTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 8,
    textAlign: 'center',
  },
  mapSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  mapWrapper: {
    height: 500,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
});
