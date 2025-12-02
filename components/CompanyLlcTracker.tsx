import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, X, ExternalLink } from 'lucide-react-native';
import { CompanyLlcProfile, LlcProject, LlcEntity, ProjectStatus } from '@/types/llc';
import { LlcMap, LlcProjectLocation } from '@/components/LlcMap';

interface CompanyLlcTrackerProps {
  profile: CompanyLlcProfile;
}

interface FilterState {
  status: ProjectStatus | 'all';
  searchQuery: string;
}

function getStatusColor(status: ProjectStatus): string {
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

function getStatusLabel(status: ProjectStatus): string {
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

interface ProjectRowProps {
  project: LlcProject;
  llc: LlcEntity | undefined;
  isSelected: boolean;
  onPress: () => void;
  onViewDetails: () => void;
}

function ProjectRow({ project, llc, isSelected, onPress, onViewDetails }: ProjectRowProps) {

  return (
    <View
      style={[styles.tableRow, isSelected && styles.tableRowSelected]}
    >
      <TouchableOpacity style={styles.tableRowContent} onPress={onPress}>
        <Text style={[styles.tableCell, styles.llcColumn]} numberOfLines={2}>
          {llc?.llcName || 'N/A'}
        </Text>
        <View style={[styles.tableCell, styles.projectColumn]}>
          <Text style={styles.projectName} numberOfLines={2}>
            {project.projectName}
          </Text>
          {project.codeName && (
            <Text style={styles.codeName} numberOfLines={1}>
              ({project.codeName})
            </Text>
          )}
        </View>
        <Text style={[styles.tableCell, styles.locationColumn]} numberOfLines={2}>
          {project.locationCity}
          {project.locationState && `, ${project.locationState}`}
          {', '}
          {project.locationCountry}
        </Text>
        <View style={[styles.tableCell, styles.statusColumn]}>
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
      </TouchableOpacity>

      {isSelected && (
        <View style={styles.expandedDetails}>
          {project.facilityType && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Facility Type:</Text>
              <Text style={styles.detailValue}>{project.facilityType}</Text>
            </View>
          )}
          {project.knownIncentives && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Known Incentives:</Text>
              <Text style={styles.detailValue}>{project.knownIncentives}</Text>
            </View>
          )}
          {project.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={styles.detailValue}>{project.notes}</Text>
            </View>
          )}
          {llc && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Confidence:</Text>
              <Text style={styles.detailValue}>{llc.confidence}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.viewDetailsButton} onPress={onViewDetails}>
            <ExternalLink size={18} color="#1E3A5F" />
            <Text style={styles.viewDetailsButtonText}>View Full Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export function CompanyLlcTracker({ profile }: CompanyLlcTrackerProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    searchQuery: '',
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const allProjects = useMemo<LlcProject[]>(() => {
    return profile.llcs.flatMap((llc) => llc.projects);
  }, [profile.llcs]);

  const getLlcForProject = useCallback((projectId: string) => {
    return profile.llcs.find((llc) => 
      llc.projects.some((p) => p.id === projectId)
    );
  }, [profile.llcs]);

  const filteredProjects = useMemo<LlcProject[]>(() => {
    return allProjects.filter((project) => {
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        filters.searchQuery === '' ||
        project.projectName.toLowerCase().includes(searchLower) ||
        project.locationCity.toLowerCase().includes(searchLower) ||
        project.locationState?.toLowerCase().includes(searchLower) ||
        project.locationCountry.toLowerCase().includes(searchLower);
      
      return matchesStatus && matchesSearch;
    });
  }, [allProjects, filters]);

  const projectLocations = useMemo<LlcProjectLocation[]>(() => {
    return filteredProjects
      .filter((p) => p.latitude && p.longitude)
      .map((project) => {
        const llc = getLlcForProject(project.id);
        return {
          id: project.id,
          company: profile.displayName,
          llcName: llc?.llcName || 'Unknown',
          projectName: project.projectName,
          codeName: project.codeName,
          city: project.locationCity,
          state: project.locationState || '',
          country: project.locationCountry,
          latitude: project.latitude!,
          longitude: project.longitude!,
          status: project.status,
        };
      });
  }, [filteredProjects, profile.displayName, getLlcForProject]);

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{profile.displayName} – LLC Tracker</Text>
        <Text style={styles.description}>{profile.description}</Text>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#1E3A5F" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
        
        <Text style={styles.resultCount}>
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {showFilters && (
        <View style={styles.filtersPanel}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
              {(['all', 'operating', 'under_construction', 'approved', 'proposed', 'cancelled'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    filters.status === status && styles.filterChipActive,
                  ]}
                  onPress={() => setFilters({ ...filters, status })}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filters.status === status && styles.filterChipTextActive,
                    ]}
                  >
                    {status === 'all' ? 'All' : getStatusLabel(status)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Search:</Text>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="City, state, project name..."
                placeholderTextColor="#9CA3AF"
                value={filters.searchQuery}
                onChangeText={(text) => setFilters({ ...filters, searchQuery: text })}
              />
              {filters.searchQuery !== '' && (
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, searchQuery: '' })}
                  style={styles.clearButton}
                >
                  <X size={18} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.mapSection}>
          <LlcMap
            projects={projectLocations}
          />
        </View>

        <ScrollView style={styles.tableSection}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.llcColumn]}>LLC Name</Text>
              <Text style={[styles.tableHeaderCell, styles.projectColumn]}>Project</Text>
              <Text style={[styles.tableHeaderCell, styles.locationColumn]}>Location</Text>
              <Text style={[styles.tableHeaderCell, styles.statusColumn]}>Status</Text>
            </View>

            {filteredProjects.map((project) => {
              const llc = getLlcForProject(project.id);
              const isSelected = selectedProject === project.id;

              return (
                <ProjectRow
                  key={project.id}
                  project={project}
                  llc={llc}
                  isSelected={isSelected}
                  onPress={() => setSelectedProject(isSelected ? null : project.id)}
                  onViewDetails={() => router.push(`/llc/${project.id}`)}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 700,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  filterButtonText: {
    color: '#1E3A5F',
    fontSize: 14,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  filtersPanel: {
    backgroundColor: 'white',
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#F59E0B',
  },
  filterChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#1E3A5F',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    ...Platform.select({
      web: {
        flexDirection: 'row' as any,
      },
      default: {
        flexDirection: 'column',
      },
    }),
  },
  mapSection: {
    ...Platform.select({
      web: {
        flex: 1,
      },
      default: {
        height: 300,
      },
    }),
    backgroundColor: '#E5E7EB',
  },
  tableSection: {
    ...Platform.select({
      web: {
        flex: 1,
      },
      default: {
        flex: 1,
      },
    }),
    backgroundColor: 'white',
  },
  table: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E3A5F',
    textTransform: 'uppercase',
  },
  llcColumn: {
    flex: 2,
  },
  projectColumn: {
    flex: 3,
  },
  locationColumn: {
    flex: 2,
  },
  statusColumn: {
    flex: 1.5,
  },
  tableRow: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableRowSelected: {
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  tableRowContent: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 14,
    color: '#1F2937',
    paddingHorizontal: 4,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 2,
  },
  codeName: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
  expandedDetails: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 18,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    marginTop: 8,
  },
  viewDetailsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
  },
});
