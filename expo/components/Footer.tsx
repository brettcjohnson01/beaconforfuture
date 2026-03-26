import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export function Footer() {
  const router = useRouter();
  
  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>BEACON</Text>
          <Text style={styles.footerMission}>
            Bringing transparency to data center development and empowering communities
            to understand the true impacts in their backyard.
          </Text>
        </View>

        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Data Sources</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.developerSection}>
        <View style={styles.divider} />
        <Text style={styles.developerLabel}>BEACON LABS</Text>
        <Text style={styles.labsSubtitle}>Advanced Tools for Developers</Text>
        <TouchableOpacity 
          style={styles.lodestarButton}
          onPress={() => router.push('/developer/lodestar' as any)}
        >
          <Text style={styles.lodestarButtonText}>LODESTAR</Text>
          <Text style={styles.lodestarSubtext}>Grid-Aware AI Training Planner</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.copyright}>
        © 2025 BEACON. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginTop: 60,
  },
  footerContent: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 24,
  },
  footerSection: {
    gap: 8,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  footerMission: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    maxWidth: 600,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  footerLink: {
    fontSize: 14,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
  },
  developerSection: {
    marginTop: 40,
    paddingTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    width: 100,
    height: 2,
    backgroundColor: 'rgba(239,168,96,0.25)',
    marginBottom: 16,
  },
  developerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D1D5DB',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  labsSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  lodestarButton: {
    backgroundColor: '#EFA860',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#EFA860',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 240,
    borderWidth: 2,
    borderColor: 'rgba(239,168,96,0.5)',
  },
  lodestarButtonText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3B2F2A',
    letterSpacing: 3,
    marginBottom: 4,
  },
  lodestarSubtext: {
    fontSize: 12,
    color: '#3B2F2A',
    fontWeight: '600',
  },

});
