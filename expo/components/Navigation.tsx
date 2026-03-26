import { Link } from 'expo-router';
import { MapPin, Home, DollarSign, Wrench, Info, Building2, Calculator, FileText, Menu, X, Users, BarChart3 } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, ScrollView } from 'react-native';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const allNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Interactive Map', href: '/map', icon: MapPin },
  { label: 'BEACON Tools', href: '/tools', icon: Wrench },
  { label: 'Susceptibility Calculator', href: '/susceptibility', icon: Calculator },
  { label: 'Footprint Calculator', href: '/footprint-calculator', icon: BarChart3 },
  { label: 'LLC Tracker', href: '/llc-tracker', icon: Building2 },
  { label: 'Community Network', href: '/network', icon: Users },
  { label: 'Tax Incentive Explorer', href: '/tax-incentives', icon: DollarSign },
  { label: 'CBA AI Tool', href: '/cba-tool', icon: FileText },
  { label: 'About & Methodology', href: '/about', icon: Info },
];

const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Tools', href: '/tools', icon: Wrench },
  { label: 'About', href: '/about', icon: Info },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <View style={styles.nav}>
        <View style={styles.navContent}>
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text style={styles.logo}>BEACON</Text>
            </TouchableOpacity>
          </Link>
          
          <View style={styles.navRight}>
            <View style={styles.mainNavLinks}>
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href as any} asChild>
                  <TouchableOpacity style={styles.navLink}>
                    <Text style={styles.navLinkText}>{item.label}</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setMenuOpen(true)}
            >
              <Menu size={24} color="#F59E0B" />
              <Text style={styles.menuButtonText}>Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          />
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Navigation</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <X size={28} color="#F59E0B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerContent}>
              {allNavItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href as any} 
                  asChild
                >
                  <TouchableOpacity 
                    style={styles.drawerItem}
                    onPress={() => setMenuOpen(false)}
                  >
                    <item.icon size={22} color="#F59E0B" />
                    <Text style={styles.drawerItemText}>{item.label}</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </ScrollView>

            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>BEACON © 2025</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#1E3A5F',
    paddingTop: Platform.OS === 'web' ? 0 : 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C4F7C',
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        zIndex: 100,
      },
    }),
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mainNavLinks: {
    flexDirection: 'row',
    gap: 8,
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  navLinkText: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '600',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  menuButtonText: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    width: 320,
    maxWidth: '85%',
    backgroundColor: '#1E3A5F',
    borderLeftWidth: 2,
    borderLeftColor: '#F59E0B',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2C4F7C',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F59E0B',
  },
  drawerContent: {
    flex: 1,
    paddingVertical: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C4F7C',
  },
  drawerItemText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '600',
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#2C4F7C',
  },
  drawerFooterText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
});
