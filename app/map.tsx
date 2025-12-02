import { useRouter } from 'expo-router';
import { ChevronLeft, Filter, Zap, Droplet, MapPin } from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { facilities, Facility } from '@/mocks/facilities';

interface FacilityCardProps {
  facility: Facility;
  onPress: () => void;
}

function FacilityCard({ facility, onPress }: FacilityCardProps) {
  return (
    <TouchableOpacity style={styles.facilityCard} onPress={onPress}>
      <View style={styles.facilityHeader}>
        <Text style={styles.facilityName}>{facility.facility_name}</Text>
        <Text style={styles.facilityLocation}>
          {facility.city}, {facility.state}
        </Text>
      </View>

      <View style={styles.facilityMetrics}>
        <View style={styles.metric}>
          <Zap size={16} color="#F59E0B" />
          <Text style={styles.metricText}>{facility.mw_load} MW</Text>
        </View>
        <View style={styles.metric}>
          <Droplet size={16} color="#3B82F6" />
          <Text style={styles.metricText}>
            {Math.round(facility.daily_water_gal / 1000)}k gal/day
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricText}>EJ {facility.ej_percentile_overall}</Text>
        </View>
      </View>

      <View style={styles.facilityTags}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{facility.grid_region}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{facility.operator}</Text>
        </View>
        {facility.fossil_colocation && (
          <View style={[styles.tag, styles.tagWarning]}>
            <Text style={[styles.tagText, styles.tagWarningText]}>
              Fossil Co-location
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

interface MapMarkerProps {
  facility: Facility;
  onPress: () => void;
}

function MapMarker({ facility, onPress }: MapMarkerProps) {
  const isHighEJ = facility.ej_percentile_overall >= 80;
  const isFossilColocated = facility.fossil_colocation;

  return (
    <TouchableOpacity
      style={[
        styles.mapMarker,
        isHighEJ && styles.mapMarkerHighEJ,
        isFossilColocated && styles.mapMarkerFossil,
      ]}
      onPress={onPress}
    >
      <MapPin
        size={20}
        color={isFossilColocated ? '#DC2626' : isHighEJ ? '#F59E0B' : '#1E3A5F'}
      />
    </TouchableOpacity>
  );
}

function SimpleMap({ facilities, onMarkerPress }: {
  facilities: Facility[];
  onMarkerPress: (facility: Facility) => void;
}) {
  return (
    <View style={styles.mapContainer}>
      <Text style={styles.mapPlaceholder}>Interactive Map View</Text>
      <Text style={styles.mapSubtext}>
        Showing {facilities.length} facilities
      </Text>
      <View style={styles.mapMarkersOverlay}>
        {facilities.map((facility) => (
          <MapMarker
            key={facility.id}
            facility={facility}
            onPress={() => onMarkerPress(facility)}
          />
        ))}
      </View>
    </View>
  );
}

export default function MapPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [stateFilter, setStateFilter] = useState('');
  const [gridRegionFilter, setGridRegionFilter] = useState('');
  const [minPowerLoad, setMinPowerLoad] = useState('');
  const [minEJScore, setMinEJScore] = useState('');
  const [fossilOnlyFilter, setFossilOnlyFilter] = useState(false);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      if (stateFilter && !facility.state.toLowerCase().includes(stateFilter.toLowerCase())) {
        return false;
      }
      if (gridRegionFilter && facility.grid_region !== gridRegionFilter) {
        return false;
      }
      if (minPowerLoad && facility.mw_load < parseInt(minPowerLoad)) {
        return false;
      }
      if (minEJScore && facility.ej_percentile_overall < parseInt(minEJScore)) {
        return false;
      }
      if (fossilOnlyFilter && !facility.fossil_colocation) {
        return false;
      }
      return true;
    });
  }, [stateFilter, gridRegionFilter, minPowerLoad, minEJScore, fossilOnlyFilter]);

  const handleFacilityPress = (facility: Facility) => {
    router.push(`/facility/${facility.id}` as any);
  };

  const resetFilters = () => {
    setStateFilter('');
    setGridRegionFilter('');
    setMinPowerLoad('');
    setMinEJScore('');
    setFossilOnlyFilter(false);
  };

  return (
    <View style={styles.container}>
      <Navigation />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1E3A5F" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Data Center Map</Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color="#1E3A5F" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ScrollView style={styles.facilityList}>
          <Text style={styles.facilityCount}>
            {filteredFacilities.length} facilities found
          </Text>
          {filteredFacilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onPress={() => handleFacilityPress(facility)}
            />
          ))}
        </ScrollView>

        <View style={styles.mapSection}>
          <SimpleMap
            facilities={filteredFacilities}
            onMarkerPress={handleFacilityPress}
          />
        </View>
      </View>

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterScroll}>
              <Text style={styles.filterLabel}>State</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="e.g., Virginia, Michigan"
                value={stateFilter}
                onChangeText={setStateFilter}
              />

              <Text style={styles.filterLabel}>Grid Region</Text>
              <View style={styles.filterOptions}>
                {['MISO', 'PJM', 'ERCOT', 'WECC', 'SPP'].map((region) => (
                  <TouchableOpacity
                    key={region}
                    style={[
                      styles.filterOption,
                      gridRegionFilter === region && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setGridRegionFilter(gridRegionFilter === region ? '' : region)
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        gridRegionFilter === region && styles.filterOptionTextActive,
                      ]}
                    >
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Minimum Power Load (MW)</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="e.g., 100"
                keyboardType="numeric"
                value={minPowerLoad}
                onChangeText={setMinPowerLoad}
              />

              <Text style={styles.filterLabel}>Minimum EJ Score</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="e.g., 70"
                keyboardType="numeric"
                value={minEJScore}
                onChangeText={setMinEJScore}
              />

              <TouchableOpacity
                style={styles.filterCheckbox}
                onPress={() => setFossilOnlyFilter(!fossilOnlyFilter)}
              >
                <View
                  style={[
                    styles.checkbox,
                    fossilOnlyFilter && styles.checkboxActive,
                  ]}
                />
                <Text style={styles.filterCheckboxText}>
                  Show only fossil co-located facilities
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Reset All Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A5F',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  facilityList: {
    flex: 1,
    padding: 16,
  },
  facilityCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
  },
  facilityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  facilityHeader: {
    marginBottom: 12,
  },
  facilityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  facilityLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  facilityMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  facilityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  tagWarning: {
    backgroundColor: '#FEE2E2',
  },
  tagWarningText: {
    color: '#DC2626',
  },
  mapSection: {
    flex: 1,
    minWidth: 400,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholder: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  mapMarkersOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 10,
  },
  mapMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mapMarkerHighEJ: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  mapMarkerFossil: {
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A5F',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F59E0B',
  },
  filterScroll: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
    marginTop: 16,
  },
  filterInput: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  filterOptionActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterOptionTextActive: {
    color: '#1E3A5F',
  },
  filterCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  checkboxActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  filterCheckboxText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
