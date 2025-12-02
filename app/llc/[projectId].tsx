import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, MapPin, Building, Calendar, DollarSign, Info, ExternalLink } from 'lucide-react-native';
import { googleLlcProfile } from '@/mocks/llc/google';
import { metaLlcProfile } from '@/mocks/llc/meta';
import { LlcProject, LlcEntity, CompanyLlcProfile } from '@/types/llc';

const allProfiles: CompanyLlcProfile[] = [googleLlcProfile, metaLlcProfile];

function getStatusColor(status: string): string {
  switch (status) {
    case 'operating':
      return '#10B981';
    case 'under_construction':
      return '#F59E0B';
    case 'approved':
      return '#3B82F6';
    case 'proposed':
      return '#8B5CF6';
    case 'cancelled':
      return '#EF4444';
    default:
      return '#6B7280';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'operating':
      return 'Operating';
    case 'under_construction':
      return 'Under Construction';
    case 'approved':
      return 'Approved';
    case 'proposed':
      return 'Proposed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

function findProject(projectId: string): {
  project: LlcProject;
  llc: LlcEntity;
  profile: CompanyLlcProfile;
} | null {
  for (const profile of allProfiles) {
    for (const llc of profile.llcs) {
      const project = llc.projects.find((p) => p.id === projectId);
      if (project) {
        return { project, llc, profile };
      }
    }
  }
  return null;
}

export default function ProjectDetailPage() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const router = useRouter();

  const result = projectId ? findProject(projectId) : null;

  if (!projectId || !result) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Project Not Found</Text>
          <Text style={styles.notFoundText}>
            The data center project you&apos;re looking for could not be found.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/llc-tracker')}
          >
            <ArrowLeft size={20} color="#1E3A5F" />
            <Text style={styles.backButtonText}>Back to LLC Tracker</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const { project, llc, profile } = result;

  const handleOpenSource = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#F59E0B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Project Details</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.companyBadge}>
              <Text style={styles.companyBadgeText}>{profile.displayName}</Text>
            </View>
            
            <Text style={styles.projectTitle}>{project.projectName}</Text>
            
            {project.codeName && (
              <Text style={styles.projectCodeName}>({project.codeName})</Text>
            )}
            
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(project.status) },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {getStatusLabel(project.status)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Building size={20} color="#F59E0B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>LLC Name</Text>
                  <Text style={styles.infoValue}>{llc.llcName}</Text>
                </View>
              </View>

              {llc.jurisdiction && (
                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Calendar size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Jurisdiction</Text>
                    <Text style={styles.infoValue}>{llc.jurisdiction}</Text>
                  </View>
                </View>
              )}

              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Info size={20} color="#F59E0B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Confidence Level</Text>
                  <Text style={styles.infoValue}>
                    {llc.confidence === 'confirmed' && 'Confirmed'}
                    {llc.confidence === 'strongly_suggested' && 'Strongly Suggested'}
                    {llc.confidence === 'speculative' && 'Speculative'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <MapPin size={20} color="#F59E0B" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.locationText}>
                    {project.locationCity}
                    {project.locationCounty && `, ${project.locationCounty}`}
                  </Text>
                  <Text style={styles.locationText}>
                    {project.locationState && `${project.locationState}, `}
                    {project.locationCountry}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {project.facilityType && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Facility Type</Text>
              <View style={styles.infoCard}>
                <Text style={styles.facilityTypeText}>{project.facilityType}</Text>
              </View>
            </View>
          )}

          {project.knownIncentives && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Known Tax Incentives</Text>
              <View style={styles.incentivesCard}>
                <View style={styles.iconContainer}>
                  <DollarSign size={24} color="#F59E0B" />
                </View>
                <Text style={styles.incentivesText}>{project.knownIncentives}</Text>
              </View>
            </View>
          )}

          {project.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why This Matters for Communities</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>{project.notes}</Text>
              </View>
            </View>
          )}

          {llc.sources && llc.sources.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Public Documents & Coverage</Text>
              <View style={styles.sourcesCard}>
                {llc.sources.map((source, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.sourceButton}
                    onPress={() => handleOpenSource(source)}
                  >
                    <ExternalLink size={18} color="#1E3A5F" />
                    <Text style={styles.sourceButtonText} numberOfLines={1}>
                      {source.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.contextSection}>
            <Text style={styles.contextTitle}>Understanding Shell LLCs</Text>
            <Text style={styles.contextText}>
              Large tech companies often use single-purpose LLCs (limited liability companies) to develop data centers before their identity becomes public. These entities handle land purchases, utility agreements, and tax incentive negotiations—sometimes for years before the parent company is revealed. This practice limits transparency and makes it harder for communities to understand who is behind a project and what their track record is.
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.backToListButton}
              onPress={() => router.push('/llc-tracker')}
            >
              <ArrowLeft size={20} color="#1E3A5F" />
              <Text style={styles.backToListButtonText}>Back to LLC Tracker</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notFoundTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 12,
    textAlign: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F59E0B',
  },
  content: {
    flex: 1,
  },
  hero: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  companyBadge: {
    backgroundColor: '#F59E0B',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  companyBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E3A5F',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  projectTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  projectCodeName: {
    fontSize: 16,
    color: '#D1D5DB',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  facilityTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  incentivesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  incentivesText: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  notesCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  notesText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  sourcesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sourceButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  contextSection: {
    marginHorizontal: 16,
    marginTop: 32,
    padding: 20,
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  contextTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  contextText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  backToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
  },
  backToListButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
  },
});
