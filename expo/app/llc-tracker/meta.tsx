import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Navigation } from '@/components/Navigation';
import { CompanyLlcTracker } from '@/components/CompanyLlcTracker';
import { metaLlcProfile } from '@/mocks/llc/meta';

export default function MetaLlcTrackerPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Navigation />
      
      <View style={styles.backBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/llc-tracker' as any)}
        >
          <ArrowLeft size={20} color="#1E3A5F" />
          <Text style={styles.backButtonText}>Back to LLC Tracker</Text>
        </TouchableOpacity>
      </View>

      <CompanyLlcTracker profile={metaLlcProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  backBar: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
  },
});
