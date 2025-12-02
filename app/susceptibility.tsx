import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import {
  Zap,
  Map,
  DollarSign,
  Droplet,
  Shield,
  Info,
  RotateCcw,
} from 'lucide-react-native';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'Washington DC',
];

interface StateRiskProfile {
  energyInfra: number;
  landZoning: number;
  incentivesFiscal: number;
  resourceEnv: number;
}

const stateRiskProfiles: Record<string, StateRiskProfile> = {
  Virginia: { energyInfra: 0.9, landZoning: 0.8, incentivesFiscal: 0.85, resourceEnv: 0.7 },
  Texas: { energyInfra: 0.85, landZoning: 0.75, incentivesFiscal: 0.8, resourceEnv: 0.65 },
  Ohio: { energyInfra: 0.8, landZoning: 0.7, incentivesFiscal: 0.75, resourceEnv: 0.6 },
  Nevada: { energyInfra: 0.75, landZoning: 0.8, incentivesFiscal: 0.9, resourceEnv: 0.4 },
  Oregon: { energyInfra: 0.7, landZoning: 0.6, incentivesFiscal: 0.7, resourceEnv: 0.5 },
  Michigan: { energyInfra: 0.75, landZoning: 0.65, incentivesFiscal: 0.7, resourceEnv: 0.55 },
  Arkansas: { energyInfra: 0.7, landZoning: 0.75, incentivesFiscal: 0.85, resourceEnv: 0.6 },
  Nebraska: { energyInfra: 0.65, landZoning: 0.7, incentivesFiscal: 0.75, resourceEnv: 0.5 },
  Missouri: { energyInfra: 0.7, landZoning: 0.65, incentivesFiscal: 0.7, resourceEnv: 0.55 },
  Arizona: { energyInfra: 0.75, landZoning: 0.7, incentivesFiscal: 0.75, resourceEnv: 0.35 },
  'North Carolina': { energyInfra: 0.8, landZoning: 0.7, incentivesFiscal: 0.75, resourceEnv: 0.6 },
  Georgia: { energyInfra: 0.8, landZoning: 0.75, incentivesFiscal: 0.8, resourceEnv: 0.55 },
  default: { energyInfra: 0.5, landZoning: 0.5, incentivesFiscal: 0.5, resourceEnv: 0.5 },
};

const communityTypeModifier: Record<string, number> = {
  rural: 1.1,
  'small town': 1.0,
  suburb: 0.95,
  city: 0.9,
};

const organizingStrengthModifier: Record<string, number> = {
  low: 1.1,
  medium: 1.0,
  high: 0.8,
};

interface CategoryInfo {
  id: string;
  name: string;
  weight: number;
  icon: React.ComponentType<{ size: number; color: string }>;
  description: string;
  tooltip: string;
}

const categories: CategoryInfo[] = [
  {
    id: 'energy',
    name: 'Energy & Infrastructure',
    weight: 25,
    icon: Zap,
    description: 'Grid capacity, transmission, and data center clustering',
    tooltip:
      'Based on state-level grid load, transmission infrastructure, and existing data center density. Higher scores indicate more attractive power infrastructure.',
  },
  {
    id: 'land',
    name: 'Land & Zoning',
    weight: 20,
    icon: Map,
    description: 'Industrial land availability and permitting ease',
    tooltip:
      'Evaluates availability of large industrial parcels, by-right zoning, and streamlined permitting processes that make development easier.',
  },
  {
    id: 'incentives',
    name: 'Incentives & Fiscal',
    weight: 20,
    icon: DollarSign,
    description: 'Tax incentives and economic development programs',
    tooltip:
      'Measures state and local tax exemptions, subsidy programs, and fiscal pressure to attract large-scale developments with incentive packages.',
  },
  {
    id: 'resources',
    name: 'Resource & Environment',
    weight: 20,
    icon: Droplet,
    description: 'Water availability and environmental risk',
    tooltip:
      'Considers water stress, grid carbon intensity, and strength of environmental enforcement. Areas with abundant resources and weaker oversight score higher.',
  },
  {
    id: 'community',
    name: 'Community Power',
    weight: 15,
    icon: Shield,
    description: 'Local protections and organizing strength',
    tooltip:
      'Reverse-scored: Strong community organizing, moratoria, and transparency protections REDUCE susceptibility. This is where you have the most control.',
  },
];

export default function SusceptibilityPage() {
  const [communityName, setCommunityName] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [countyOrZip, setCountyOrZip] = useState<string>('');
  const [communityType, setCommunityType] = useState<string>('');
  const [organizingStrength, setOrganizingStrength] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const calculateScore = useMemo(() => {
    if (!state || !communityType || !organizingStrength) {
      return null;
    }

    const stateProfile = stateRiskProfiles[state] || stateRiskProfiles.default;
    const typeModifier = communityTypeModifier[communityType.toLowerCase()] || 1.0;
    const orgModifier = organizingStrengthModifier[organizingStrength] || 1.0;

    const energyScore = stateProfile.energyInfra * 25 * typeModifier;
    const landScore = stateProfile.landZoning * 20 * typeModifier;
    const incentivesScore = stateProfile.incentivesFiscal * 20;
    const resourcesScore = stateProfile.resourceEnv * 20;
    const communityScore = 15 * (1 - (1 - 0.5) * orgModifier);

    const total = Math.round(
      energyScore + landScore + incentivesScore + resourcesScore + communityScore
    );

    return {
      total: Math.min(total, 100),
      categories: [
        { name: 'Energy & Infrastructure', score: Math.round(energyScore) },
        { name: 'Land & Zoning', score: Math.round(landScore) },
        { name: 'Incentives & Fiscal', score: Math.round(incentivesScore) },
        { name: 'Resource & Environment', score: Math.round(resourcesScore) },
        { name: 'Community Power', score: Math.round(15 - communityScore) },
      ],
    };
  }, [state, communityType, organizingStrength]);

  const handleSubmit = () => {
    if (calculateScore) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCommunityName('');
    setState('');
    setCountyOrZip('');
    setCommunityType('');
    setOrganizingStrength('');
    setShowResults(false);
  };

  const canSubmit = state && communityType && organizingStrength;

  const getSusceptibilityLevel = (
    score: number
  ): { label: string; color: string; bgColor: string } => {
    if (score <= 30)
      return { label: 'Lower Susceptibility', color: '#10B981', bgColor: '#D1FAE5' };
    if (score <= 60)
      return { label: 'Moderate Susceptibility', color: '#F59E0B', bgColor: '#FEF3C7' };
    return { label: 'High Susceptibility', color: '#EF4444', bgColor: '#FEE2E2' };
  };

  const getInsight = (score: number, categoryScores: { name: string; score: number }[]) => {
    const topCategory = [...categoryScores]
      .sort((a, b) => b.score - a.score)
      .find((c) => !c.name.includes('Community'));

    if (score <= 30) {
      return `Your community shows lower susceptibility. ${
        topCategory?.name || 'Several factors'
      } contribute, but overall conditions do not strongly favor data center development.`;
    } else if (score <= 60) {
      return `Your community shows moderate susceptibility. ${
        topCategory?.name || 'Infrastructure and incentives'
      } are primary drivers. Consider building community awareness and protections now.`;
    } else {
      return `Your community shows high susceptibility. ${
        topCategory?.name || 'Multiple factors'
      } create favorable conditions for developers. Strong organizing and legal protections are recommended.`;
    }
  };

  return (
    <View style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Community Susceptibility Calculator</Text>
          <Text style={styles.heroSubtitle}>
            Estimate how likely your community is to be targeted for large-scale data center
            development — and where you have leverage to push back.
          </Text>
          <Text style={styles.heroDescription}>
            This is an early-stage, educational tool based on publicly available data. It&apos;s
            meant to spark questions and guide organizing, not provide a definitive prediction.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Your Community</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Community Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your city or community name"
                placeholderTextColor="#9CA3AF"
                value={communityName}
                onChangeText={setCommunityName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                State <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.stateScroll}
                  contentContainerStyle={styles.stateScrollContent}
                >
                  {US_STATES.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.stateChip, state === s && styles.stateChipActive]}
                      onPress={() => setState(s)}
                    >
                      <Text
                        style={[
                          styles.stateChipText,
                          state === s && styles.stateChipTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>County or ZIP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional - for future reference"
                placeholderTextColor="#9CA3AF"
                value={countyOrZip}
                onChangeText={setCountyOrZip}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Community Type <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.optionsRow}>
                {['Rural', 'Small Town', 'Suburb', 'City'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      communityType === type && styles.typeButtonActive,
                    ]}
                    onPress={() => setCommunityType(type)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        communityType === type && styles.typeButtonTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Organizing Strength (self-assessment){' '}
                <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.radioGroup}>
                {[
                  { value: 'low', label: 'Little to no organizing' },
                  { value: 'medium', label: 'Some organizing' },
                  { value: 'high', label: 'Strong, active coalition' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.radioButton,
                      organizingStrength === option.value && styles.radioButtonActive,
                    ]}
                    onPress={() => setOrganizingStrength(option.value)}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        organizingStrength === option.value && styles.radioCircleActive,
                      ]}
                    >
                      {organizingStrength === option.value && (
                        <View style={styles.radioCircleFill} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioLabel,
                        organizingStrength === option.value && styles.radioLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={styles.submitButtonText}>Calculate Score</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transparencySection}>
            <View style={styles.transparencyHeader}>
              <Info size={24} color="#F59E0B" />
              <Text style={styles.transparencyTitle}>What This Calculator Considers</Text>
            </View>
            <Text style={styles.transparencyDescription}>
              All calculations use state-level data and your community type. You don&apos;t need to
              answer technical questions — the tool handles that behind the scenes.
            </Text>
            <View style={styles.factorsList}>
              <Text style={styles.factorItem}>
                • State-level data center growth and incentive programs
              </Text>
              <Text style={styles.factorItem}>
                • Grid region and energy/digital infrastructure readiness
              </Text>
              <Text style={styles.factorItem}>
                • Availability of industrial land and zoning conditions
              </Text>
              <Text style={styles.factorItem}>
                • Water availability and environmental risk context
              </Text>
              <Text style={styles.factorItem}>
                • Community organizing strength and local protections
              </Text>
            </View>
          </View>

          {showResults && calculateScore && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>
                {communityName || 'Your'} Susceptibility Score
              </Text>

              <View
                style={[
                  styles.scoreBadge,
                  { backgroundColor: getSusceptibilityLevel(calculateScore.total).color },
                ]}
              >
                <Text style={styles.scoreNumber}>{calculateScore.total}</Text>
                <Text style={styles.scoreLabel}>out of 100</Text>
              </View>

              <View
                style={[
                  styles.levelBadge,
                  {
                    backgroundColor: getSusceptibilityLevel(calculateScore.total).bgColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.levelLabel,
                    { color: getSusceptibilityLevel(calculateScore.total).color },
                  ]}
                >
                  {getSusceptibilityLevel(calculateScore.total).label}
                </Text>
              </View>

              <Text style={styles.insight}>
                {getInsight(calculateScore.total, calculateScore.categories)}
              </Text>

              <View style={styles.breakdown}>
                <Text style={styles.breakdownTitle}>Category Breakdown</Text>
                {calculateScore.categories.map((cat, index) => {
                  const categoryInfo = categories[index];
                  return (
                    <View key={cat.name} style={styles.breakdownRow}>
                      <View style={styles.breakdownLabelRow}>
                        <Text style={styles.breakdownLabel}>{cat.name}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            setShowTooltip(
                              showTooltip === categoryInfo.id ? null : categoryInfo.id
                            )
                          }
                        >
                          <Info size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                      </View>
                      {showTooltip === categoryInfo.id && (
                        <Text style={styles.tooltip}>{categoryInfo.tooltip}</Text>
                      )}
                      <View style={styles.breakdownBarRow}>
                        <View style={styles.breakdownBar}>
                          <View
                            style={[
                              styles.breakdownBarFill,
                              {
                                width: `${Math.min(
                                  (cat.score / categoryInfo.weight) * 100,
                                  100
                                )}%`,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.breakdownValue}>{cat.score}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <Text style={styles.disclaimerText}>
                This score combines state-level data center conditions with your community type
                and organizing strength. It is a high-level screening tool meant to help you
                understand vulnerability to future data center development.
              </Text>

              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <RotateCcw size={18} color="#1E3A5F" />
                <Text style={styles.resetButtonText}>Reset / Try Another Community</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.methodologySection}>
            <Text style={styles.methodologyTitle}>How This Score Works</Text>
            <View style={styles.methodologyList}>
              <Text style={styles.methodologyItem}>
                • This tool combines five key dimensions: infrastructure, land/zoning readiness,
                incentives, environmental context, and community power.
              </Text>
              <Text style={styles.methodologyItem}>
                • It uses state-level data on grid capacity, tax incentive programs, water
                stress, and regulatory frameworks.
              </Text>
              <Text style={styles.methodologyItem}>
                • Community type (rural vs. urban) and organizing strength adjust the baseline
                susceptibility.
              </Text>
              <Text style={styles.methodologyItem}>
                • This is an early-stage prototype meant to spark questions and guide
                organizing, not a definitive prediction.
              </Text>
            </View>

            <View style={styles.dataSourcesBox}>
              <Text style={styles.dataSourcesTitle}>Data & Sources</Text>
              <Text style={styles.dataSourcesText}>
                This calculator draws on grid load forecasts, state tax expenditure reports,
                water stress indicators (USGS/WRI Aqueduct), environmental justice metrics (EPA
                EJScreen), and local policy research. Scores reflect typical patterns but
                individual circumstances vary.
              </Text>
            </View>
          </View>

          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Want help interpreting your score?</Text>
            <Text style={styles.ctaText}>
              We can help you dig deeper into permits, incentives, and community strategies.
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Connect with BEACON</Text>
            </TouchableOpacity>
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
  hero: {
    backgroundColor: '#1E3A5F',
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: '#F59E0B',
    marginBottom: 16,
    textAlign: 'center',
    maxWidth: 800,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#E5E7EB',
    marginBottom: 16,
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 26,
  },
  heroDescription: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 700,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 48,
    maxWidth: 900,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 24,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1E3A5F',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  stateScroll: {
    maxHeight: 120,
  },
  stateScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  stateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
    marginBottom: 6,
  },
  stateChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  stateChipText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  stateChipTextActive: {
    color: '#92400E',
    fontWeight: '600' as const,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#92400E',
  },
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  radioButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioCircleActive: {
    borderColor: '#F59E0B',
  },
  radioCircleFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  radioLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500' as const,
    flex: 1,
  },
  radioLabelActive: {
    color: '#92400E',
    fontWeight: '600' as const,
  },
  submitButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#1E3A5F',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  transparencySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  transparencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transparencyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1E3A5F',
    flex: 1,
  },
  transparencyDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  factorsList: {
    gap: 8,
    paddingLeft: 8,
  },
  factorItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#1E3A5F',
    textAlign: 'center',
  },
  scoreBadge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '800' as const,
    color: 'white',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'white',
    opacity: 0.9,
  },
  levelBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  insight: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  breakdown: {
    width: '100%',
    gap: 20,
    marginTop: 16,
  },
  breakdownTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1E3A5F',
    marginBottom: 4,
  },
  breakdownRow: {
    gap: 8,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600' as const,
    flex: 1,
  },
  tooltip: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 4,
  },
  breakdownBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownBar: {
    flex: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#1E3A5F',
    width: 35,
    textAlign: 'right',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1E3A5F',
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1E3A5F',
  },
  methodologySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  methodologyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1E3A5F',
  },
  methodologyList: {
    gap: 12,
  },
  methodologyItem: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  dataSourcesBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  dataSourcesTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1E3A5F',
  },
  dataSourcesText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  ctaCard: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    marginBottom: 48,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#F59E0B',
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  ctaButtonText: {
    color: '#1E3A5F',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
