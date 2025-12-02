import { useRouter } from 'expo-router';
import { 
  Search, 
  Calculator, 
  Users, 
  BarChart3, 
  Database, 
  Network,
  Shield,
  MessageCircle,
} from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface OfferingCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
}

function OfferingCard({ icon: Icon, title, description }: OfferingCardProps) {
  return (
    <View style={styles.offeringCard}>
      <View style={styles.offeringIconContainer}>
        <Icon size={40} color="#F59E0B" />
      </View>
      <Text style={styles.offeringTitle}>{title}</Text>
      <Text style={styles.offeringDescription}>{description}</Text>
    </View>
  );
}

interface ToolCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
  onPress: () => void;
}

function ToolCard({ icon: Icon, title, description, onPress }: ToolCardProps) {
  return (
    <TouchableOpacity style={styles.toolCard} onPress={onPress}>
      <View style={styles.toolIconContainer}>
        <Icon size={32} color="#F59E0B" />
      </View>
      <Text style={styles.toolTitle}>{title}</Text>
      <Text style={styles.toolDescription}>{description}</Text>
      <View style={styles.toolArrow}>
        <Text style={styles.toolArrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Navigation />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/h1scswj599jbbvjp1ia9a' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
          
          <Text style={styles.beaconName}>BEACON</Text>
          
          <Text style={styles.heroTitle}>
            Empowering Communities Facing Data Center Development
          </Text>
          
          <Text style={styles.heroSubtitle}>
            BEACON provides tools, data, and community connections to help residents understand, evaluate, and respond to data center projects—ensuring benefits are real, impacts are transparent, and local voices are heard.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/tools' as any)}
            >
              <Text style={styles.primaryButtonText}>Explore Tools</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/about' as any)}
            >
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.offeringsSection}>
          <Text style={styles.sectionTitle}>What BEACON Offers</Text>
          
          <View style={styles.offeringsGrid}>
            <OfferingCard
              icon={Search}
              title="Research & Transparency"
              description="Clear breakdowns of water, energy, emissions, incentives, and zoning impacts."
            />
            <OfferingCard
              icon={Calculator}
              title="Community Tools"
              description="Interactive calculators and trackers to estimate local impacts and find similar communities."
            />
            <OfferingCard
              icon={MessageCircle}
              title="Connection & Organizing"
              description="Channels and forums to share strategies, ask questions, and build coalitions."
            />
          </View>
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Tools</Text>
          
          <View style={styles.toolsGrid}>
            <ToolCard
              icon={Shield}
              title="Community Susceptibility Calculator"
              description="Assess your community's vulnerability to data center development"
              onPress={() => router.push('/susceptibility' as any)}
            />
            <ToolCard
              icon={BarChart3}
              title="Footprint Calculator"
              description="Estimate water, energy, and emissions impacts of proposed projects"
              onPress={() => router.push('/footprint-calculator' as any)}
            />
            <ToolCard
              icon={Database}
              title="LLC Tracker + Map"
              description="Track shell companies and hidden data center projects"
              onPress={() => router.push('/llc-tracker' as any)}
            />
            <ToolCard
              icon={Network}
              title="Community Network"
              description="Connect with others facing similar challenges"
              onPress={() => router.push('/network' as any)}
            />
          </View>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/tools' as any)}
          >
            <Text style={styles.viewAllButtonText}>View All Tools</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whyMattersSection}>
          <Text style={styles.sectionTitle}>Why This Matters</Text>
          
          <View style={styles.bulletContainer}>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Data centers can bring jobs and tax revenue—but also major water and electricity demands.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Many deals are made under NDAs, leaving communities without key information.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Infrastructure impacts (power plants, transmission, water sourcing) often fall on residents.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                BEACON centralizes information so communities can make informed decisions and negotiate confidently.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.ctaIconContainer}>
            <Users size={56} color="#F59E0B" />
          </View>
          <Text style={styles.ctaTitle}>Join a Growing Network of Communities</Text>
          <Text style={styles.ctaDescription}>
            Whether you&apos;re just learning about a proposed project or organizing your neighborhood, BEACON helps you connect with others facing similar challenges.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/network' as any)}
          >
            <Text style={styles.ctaButtonText}>Visit Community Network</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.beaconLabsSection}>
          <View style={styles.labsDivider} />
          <Text style={styles.labsTitle}>BEACON Labs</Text>
          <Text style={styles.labsSubtitle}>Advanced Tools for Developers</Text>
          <Text style={styles.labsDescription}>
            BEACON Labs creates specialized tools for data center operators, AI infrastructure teams, and researchers seeking deeper environmental modeling capabilities.
          </Text>
          
          <TouchableOpacity
            style={styles.lodestarCard}
            onPress={() => router.push('/developer/lodestar' as any)}
          >
            <View style={styles.lodestarIconContainer}>
              <Image
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/jiq1hcopq2l86h1aregrf' }}
                style={{ width: 56, height: 56 }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.lodestarTitle}>LODESTAR</Text>
            <Text style={styles.lodestarSubtitle}>Grid-Aware AI Training Planner</Text>
            <Text style={styles.lodestarDescription}>
              Optimize AI training emissions by selecting cleaner hourly windows based on ISO conditions and facility configuration.
            </Text>
            <View style={styles.lodestarButton}>
              <Text style={styles.lodestarButtonText}>Open LODESTAR</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: '#1E3A5F',
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  beaconName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    maxWidth: 800,
    marginBottom: 24,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 700,
    marginBottom: 40,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#1E3A5F',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '700',
  },
  offeringsSection: {
    backgroundColor: '#1E293B',
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  offeringsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
    maxWidth: 1200,
    width: '100%',
  },
  offeringCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: 360,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  offeringIconContainer: {
    marginBottom: 20,
  },
  offeringTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 12,
    textAlign: 'center',
  },
  offeringDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    textAlign: 'center',
  },
  featuredSection: {
    backgroundColor: '#0F172A',
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
    maxWidth: 1200,
    width: '100%',
    marginBottom: 40,
  },
  toolCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 24,
    minWidth: 260,
    maxWidth: 280,
    flex: 1,
    borderWidth: 2,
    borderColor: '#334155',
    position: 'relative',
  },
  toolIconContainer: {
    marginBottom: 16,
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 16,
  },
  toolArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  toolArrowText: {
    fontSize: 24,
    color: '#F59E0B',
    fontWeight: '700',
  },
  viewAllButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  viewAllButtonText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '700',
  },
  whyMattersSection: {
    backgroundColor: '#1E293B',
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bulletContainer: {
    maxWidth: 800,
    width: '100%',
    gap: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
  },
  ctaSection: {
    backgroundColor: '#0F172A',
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  ctaIconContainer: {
    marginBottom: 24,
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 600,
    marginBottom: 32,
  },
  ctaButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#1E3A5F',
    fontSize: 16,
    fontWeight: '700',
  },
  beaconLabsSection: {
    backgroundColor: '#1E293B',
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  labsDivider: {
    width: 120,
    height: 3,
    backgroundColor: 'rgba(239,168,96,0.3)',
    marginBottom: 24,
    borderRadius: 2,
  },
  labsTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 12,
  },
  labsSubtitle: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  labsDescription: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 700,
    marginBottom: 40,
  },
  lodestarCard: {
    backgroundColor: '#F6E2C9',
    borderRadius: 16,
    padding: 32,
    maxWidth: 500,
    width: '100%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#EFA860',
    shadowColor: '#EFA860',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  lodestarIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239,168,96,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lodestarTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#EFA860',
    letterSpacing: 4,
    marginBottom: 8,
  },
  lodestarSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B2F2A',
    marginBottom: 16,
  },
  lodestarDescription: {
    fontSize: 15,
    color: '#3B2F2A',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  lodestarButton: {
    backgroundColor: '#EFA860',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#EFA860',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  lodestarButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B2F2A',
  },
});
