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
  Home,
  Droplet,
  Cloud,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
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

interface GridEmissionsFactor {
  low: number;
  typical: number;
  high: number;
}

const gridEmissionsByState: Record<string, GridEmissionsFactor> = {
  Virginia: { low: 0.45, typical: 0.55, high: 0.65 },
  Texas: { low: 0.40, typical: 0.50, high: 0.60 },
  Ohio: { low: 0.55, typical: 0.70, high: 0.80 },
  Pennsylvania: { low: 0.50, typical: 0.60, high: 0.70 },
  Illinois: { low: 0.35, typical: 0.45, high: 0.55 },
  California: { low: 0.15, typical: 0.25, high: 0.35 },
  Washington: { low: 0.15, typical: 0.25, high: 0.35 },
  Oregon: { low: 0.15, typical: 0.30, high: 0.40 },
  default: { low: 0.30, typical: 0.50, high: 0.70 },
};

interface CalculationResult {
  energyMWh: { low: number; typical: number; high: number };
  peakMW: { low: number; typical: number; high: number };
  waterGal: { low: number; typical: number; high: number };
  ghgTons: { low: number; typical: number; high: number };
  homesEquiv: { low: number; typical: number; high: number };
  peopleEquivWater: { low: number; typical: number; high: number };
  dieselEmissions: number;
}

export default function FootprintCalculatorPage() {
  const [projectName, setProjectName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [projectStage, setProjectStage] = useState<string>('');
  const [dataCenterType, setDataCenterType] = useState<string>('');

  const [itLoadMW, setItLoadMW] = useState<string>('');
  const [facilityCapacityMW, setFacilityCapacityMW] = useState<string>('');
  const [squareFeet, setSquareFeet] = useState<string>('');
  const [roughScale, setRoughScale] = useState<string>('');

  const [pue, setPue] = useState<string>('1.5');
  const [itUtilization, setItUtilization] = useState<string>('0.55');

  const [coolingSystem, setCoolingSystem] = useState<string>('');

  const [hasDieselUsage, setHasDieselUsage] = useState<boolean>(false);
  const [dieselHoursPerYear, setDieselHoursPerYear] = useState<string>('35');
  const [dieselGenMW, setDieselGenMW] = useState<string>('');

  const [showResults, setShowResults] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('basics');



  const coolingWUE: Record<string, { low: number; typical: number; high: number }> = useMemo(
    () => ({
      'air-cooled': { low: 0, typical: 0.05, high: 0.1 },
      'advanced-liquid': { low: 0.1, typical: 0.25, high: 0.4 },
      hybrid: { low: 1.0, typical: 1.75, high: 2.5 },
      'heavy-evaporative': { low: 3.0, typical: 4.0, high: 5.5 },
      'not-sure': { low: 1.5, typical: 2.0, high: 3.0 },
    }),
    []
  );

  const calculateResults = useMemo((): CalculationResult | null => {
    let itMW = { low: 0, typical: 0, high: 0 };

    if (itLoadMW && parseFloat(itLoadMW) > 0) {
      const val = parseFloat(itLoadMW);
      itMW = { low: val * 0.9, typical: val, high: val * 1.1 };
    } else if (facilityCapacityMW && parseFloat(facilityCapacityMW) > 0 && pue) {
      const facMW = parseFloat(facilityCapacityMW);
      const pueVal = parseFloat(pue);
      const itVal = facMW / pueVal;
      itMW = { low: itVal * 0.9, typical: itVal, high: itVal * 1.1 };
    } else if (squareFeet && parseFloat(squareFeet) > 0) {
      const sqft = parseFloat(squareFeet);
      let wattPerSqft = { low: 150, typical: 225, high: 300 };
      if (dataCenterType === 'ai-hpc') {
        wattPerSqft = { low: 400, typical: 600, high: 800 };
      }
      itMW.low = (sqft * wattPerSqft.low) / 1_000_000;
      itMW.typical = (sqft * wattPerSqft.typical) / 1_000_000;
      itMW.high = (sqft * wattPerSqft.high) / 1_000_000;
    } else if (roughScale) {
      const scaleRanges: Record<string, { low: number; typical: number; high: number }> = {
        small: { low: 1, typical: 3, high: 5 },
        medium: { low: 5, typical: 25, high: 50 },
        large: { low: 50, typical: 100, high: 200 },
        mega: { low: 200, typical: 400, high: 600 },
      };
      itMW = scaleRanges[roughScale] || { low: 0, typical: 0, high: 0 };
    } else {
      return null;
    }

    const utilLow = 0.3;
    const utilTypical = parseFloat(itUtilization);
    const utilHigh = 0.8;

    const pueVal = parseFloat(pue);

    const itEnergyKWh = {
      low: itMW.low * 1000 * utilLow * 8760,
      typical: itMW.typical * 1000 * utilTypical * 8760,
      high: itMW.high * 1000 * utilHigh * 8760,
    };

    const facilityEnergyKWh = {
      low: itEnergyKWh.low * pueVal,
      typical: itEnergyKWh.typical * pueVal,
      high: itEnergyKWh.high * pueVal,
    };

    const facilityEnergyMWh = {
      low: facilityEnergyKWh.low / 1000,
      typical: facilityEnergyKWh.typical / 1000,
      high: facilityEnergyKWh.high / 1000,
    };

    const peakMW = {
      low: itMW.low * pueVal,
      typical: itMW.typical * pueVal,
      high: itMW.high * pueVal,
    };

    const wueValues =
      coolingWUE[coolingSystem] || { low: 1.5, typical: 2.0, high: 3.0 };

    const waterLiters = {
      low: itEnergyKWh.low * wueValues.low,
      typical: itEnergyKWh.typical * wueValues.typical,
      high: itEnergyKWh.high * wueValues.high,
    };

    const waterGal = {
      low: waterLiters.low / 3.785,
      typical: waterLiters.typical / 3.785,
      high: waterLiters.high / 3.785,
    };

    const gridFactors = gridEmissionsByState[state] || gridEmissionsByState.default;

    const ghgTons = {
      low: facilityEnergyMWh.low * gridFactors.low,
      typical: facilityEnergyMWh.typical * gridFactors.typical,
      high: facilityEnergyMWh.high * gridFactors.high,
    };

    const homesEquiv = {
      low: facilityEnergyKWh.low / 11000,
      typical: facilityEnergyKWh.typical / 11000,
      high: facilityEnergyKWh.high / 11000,
    };

    const peopleEquivWater = {
      low: waterGal.low / 36500,
      typical: waterGal.typical / 36500,
      high: waterGal.high / 36500,
    };

    let dieselEmissions = 0;
    if (hasDieselUsage && dieselGenMW && dieselHoursPerYear) {
      const genMW = parseFloat(dieselGenMW);
      const hours = parseFloat(dieselHoursPerYear);
      dieselEmissions = genMW * hours * 0.7;
    }

    return {
      energyMWh: facilityEnergyMWh,
      peakMW,
      waterGal,
      ghgTons,
      homesEquiv,
      peopleEquivWater,
      dieselEmissions,
    };
  }, [
    itLoadMW,
    facilityCapacityMW,
    squareFeet,
    roughScale,
    dataCenterType,
    pue,
    itUtilization,
    coolingSystem,
    coolingWUE,
    state,
    hasDieselUsage,
    dieselHoursPerYear,
    dieselGenMW,
  ]);

  const handleSubmit = () => {
    if (calculateResults) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setProjectName('');
    setCity('');
    setState('');
    setProjectStage('');
    setDataCenterType('');
    setItLoadMW('');
    setFacilityCapacityMW('');
    setSquareFeet('');
    setRoughScale('');
    setPue('1.5');
    setItUtilization('0.55');
    setCoolingSystem('');
    setHasDieselUsage(false);
    setDieselHoursPerYear('35');
    setDieselGenMW('');
    setShowResults(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const canSubmit = (state || roughScale) && (itLoadMW || facilityCapacityMW || squareFeet || roughScale);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const SectionHeader = ({
    title,
    sectionKey,
    icon: Icon,
  }: {
    title: string;
    sectionKey: string;
    icon: React.ComponentType<{ size: number; color: string }>;
  }) => (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={() => toggleSection(sectionKey)}
    >
      <View style={styles.sectionHeaderLeft}>
        <Icon size={22} color="#F59E0B" />
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
      {expandedSection === sectionKey ? (
        <ChevronUp size={20} color="#6B7280" />
      ) : (
        <ChevronDown size={20} color="#6B7280" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Footprint Calculator</Text>
          <Text style={styles.heroSubtitle}>
            This tool provides screening-level estimates of electricity use, water
            consumption, and operational carbon emissions for data center projects. It is
            designed to help communities understand the scale of potential impacts and ask
            informed questions.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.assumptionsBox}>
            <View style={styles.assumptionsHeader}>
              <AlertTriangle size={24} color="#F59E0B" />
              <Text style={styles.assumptionsTitle}>Important: Limitations & Assumptions</Text>
            </View>
            <Text style={styles.assumptionsText}>
              This calculator provides screening-level estimates, not an engineering analysis.
              Results rely on typical industry ranges for power use, efficiency (PUE), and
              water use (WUE) derived from publicly available reports.
            </Text>
            <Text style={styles.assumptionsText}>
              Actual impacts may be higher or lower depending on design, operations, local
              climate, and grid mix.
            </Text>
            <Text style={styles.assumptionsText}>
              The tool models operational impacts only (electricity, water, backup generator
              testing). It does not include construction impacts or the indirect emissions of
              new power plants or transmission upgrades.
            </Text>
            <Text style={styles.assumptionsText}>
              Water values represent on-site cooling water only and do not include upstream
              water for electricity production.
            </Text>
            <Text style={styles.assumptionsText}>
              For projects with NDAs or limited disclosures, estimates reflect wide
              uncertainty. These ranges are intended to help communities ask better questions
              and advocate for transparency.
            </Text>
            <Text style={styles.assumptionsText}>
              For more accurate assessments, communities should request project-specific energy
              and water projections, cooling system descriptions, generator testing schedules,
              and environmental filings.
            </Text>
          </View>

          <View style={styles.formCard}>
            <SectionHeader
              title="Project Basics"
              sectionKey="basics"
              icon={Zap}
            />
            {expandedSection === 'basics' && (
              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Project Name (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Lancaster AI Hub"
                    placeholderTextColor="#9CA3AF"
                    value={projectName}
                    onChangeText={setProjectName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>City/Town</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Lancaster"
                    placeholderTextColor="#9CA3AF"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>State</Text>
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

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Project Stage</Text>
                  <View style={styles.optionsRow}>
                    {['Proposed', 'Planning', 'Under construction', 'Operating', 'Unknown'].map(
                      (stage) => (
                        <TouchableOpacity
                          key={stage}
                          style={[
                            styles.optionButton,
                            projectStage === stage && styles.optionButtonActive,
                          ]}
                          onPress={() => setProjectStage(stage)}
                        >
                          <Text
                            style={[
                              styles.optionButtonText,
                              projectStage === stage && styles.optionButtonTextActive,
                            ]}
                          >
                            {stage}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Data Center Type</Text>
                  <View style={styles.optionsRow}>
                    {[
                      { key: 'hyperscale', label: 'Hyperscale Cloud' },
                      { key: 'colocation', label: 'Colocation' },
                      { key: 'enterprise', label: 'Enterprise' },
                      { key: 'ai-hpc', label: 'AI/HPC' },
                      { key: 'not-sure', label: 'Not Sure' },
                    ].map((type) => (
                      <TouchableOpacity
                        key={type.key}
                        style={[
                          styles.optionButton,
                          dataCenterType === type.key && styles.optionButtonActive,
                        ]}
                        onPress={() => setDataCenterType(type.key)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            dataCenterType === type.key && styles.optionButtonTextActive,
                          ]}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            <SectionHeader
              title="Size of Facility"
              sectionKey="size"
              icon={Home}
            />
            {expandedSection === 'size' && (
              <View style={styles.sectionContent}>
                <Text style={styles.helperText}>
                  Provide any of the following (if known):
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>IT Load (MW)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 150"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={itLoadMW}
                    onChangeText={setItLoadMW}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Total Facility Electrical Capacity (MW)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 225"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={facilityCapacityMW}
                    onChangeText={setFacilityCapacityMW}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>White Space / Server Area (sq ft)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 500000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={squareFeet}
                    onChangeText={setSquareFeet}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Or select rough scale:</Text>
                  <View style={styles.optionsRow}>
                    {[
                      { key: 'small', label: 'Small (1–5 MW)' },
                      { key: 'medium', label: 'Medium (5–50 MW)' },
                      { key: 'large', label: 'Large (50–200 MW)' },
                      { key: 'mega', label: 'Mega (200+ MW)' },
                    ].map((scale) => (
                      <TouchableOpacity
                        key={scale.key}
                        style={[
                          styles.optionButton,
                          roughScale === scale.key && styles.optionButtonActive,
                        ]}
                        onPress={() => setRoughScale(scale.key)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            roughScale === scale.key && styles.optionButtonTextActive,
                          ]}
                        >
                          {scale.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            <SectionHeader
              title="Efficiency & Utilization"
              sectionKey="efficiency"
              icon={Zap}
            />
            {expandedSection === 'efficiency' && (
              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Energy Efficiency (PUE)</Text>
                  <View style={styles.optionsRow}>
                    {[
                      { key: '1.2', label: 'Efficient (1.2)' },
                      { key: '1.5', label: 'Typical (1.5)' },
                      { key: '1.8', label: 'Older (1.8)' },
                    ].map((pueOption) => (
                      <TouchableOpacity
                        key={pueOption.key}
                        style={[
                          styles.optionButton,
                          pue === pueOption.key && styles.optionButtonActive,
                        ]}
                        onPress={() => setPue(pueOption.key)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            pue === pueOption.key && styles.optionButtonTextActive,
                          ]}
                        >
                          {pueOption.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>IT Utilization</Text>
                  <View style={styles.optionsRow}>
                    {[
                      { key: '0.3', label: 'Low (30%)' },
                      { key: '0.55', label: 'Typical (55%)' },
                      { key: '0.8', label: 'High (80%)' },
                    ].map((utilOption) => (
                      <TouchableOpacity
                        key={utilOption.key}
                        style={[
                          styles.optionButton,
                          itUtilization === utilOption.key && styles.optionButtonActive,
                        ]}
                        onPress={() => setItUtilization(utilOption.key)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            itUtilization === utilOption.key && styles.optionButtonTextActive,
                          ]}
                        >
                          {utilOption.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            <SectionHeader
              title="Cooling & Water"
              sectionKey="cooling"
              icon={Droplet}
            />
            {expandedSection === 'cooling' && (
              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Cooling System Type</Text>
                  <View style={styles.optionsRow}>
                    {[
                      { key: 'air-cooled', label: 'Air-cooled / Dry' },
                      { key: 'hybrid', label: 'Hybrid' },
                      { key: 'heavy-evaporative', label: 'Heavy Evaporative' },
                      { key: 'advanced-liquid', label: 'Advanced Liquid / Dry' },
                      { key: 'not-sure', label: 'Not Sure' },
                    ].map((cooling) => (
                      <TouchableOpacity
                        key={cooling.key}
                        style={[
                          styles.optionButton,
                          coolingSystem === cooling.key && styles.optionButtonActive,
                        ]}
                        onPress={() => setCoolingSystem(cooling.key)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            coolingSystem === cooling.key && styles.optionButtonTextActive,
                          ]}
                        >
                          {cooling.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            <SectionHeader
              title="Grid & Diesel"
              sectionKey="grid"
              icon={Cloud}
            />
            {expandedSection === 'grid' && (
              <View style={styles.sectionContent}>
                <Text style={styles.helperText}>
                  Grid emissions are estimated based on your selected state.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Expected diesel generator use beyond testing?
                  </Text>
                  <View style={styles.optionsRow}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        hasDieselUsage && styles.optionButtonActive,
                      ]}
                      onPress={() => setHasDieselUsage(true)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          hasDieselUsage && styles.optionButtonTextActive,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        !hasDieselUsage && styles.optionButtonActive,
                      ]}
                      onPress={() => setHasDieselUsage(false)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          !hasDieselUsage && styles.optionButtonTextActive,
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {hasDieselUsage && (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        Estimated hours of testing per year
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., 35"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        value={dieselHoursPerYear}
                        onChangeText={setDieselHoursPerYear}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>MW of backup generation</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., 150"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        value={dieselGenMW}
                        onChangeText={setDieselGenMW}
                      />
                    </View>
                  </>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={styles.submitButtonText}>Calculate Footprint</Text>
            </TouchableOpacity>
          </View>

          {showResults && calculateResults && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>
                {projectName || 'Project'} Estimated Range Only
              </Text>

              <View style={styles.resultsTable}>
                <View style={styles.resultsHeaderRow}>
                  <Text style={[styles.resultsHeaderCell, styles.resultsFirstCol]}>
                    Metric
                  </Text>
                  <Text style={styles.resultsHeaderCell}>Low</Text>
                  <Text style={styles.resultsHeaderCell}>Typical</Text>
                  <Text style={styles.resultsHeaderCell}>High</Text>
                </View>

                <View style={styles.resultsRow}>
                  <Text style={[styles.resultsCell, styles.resultsFirstCol]}>
                    Annual energy (MWh/year)
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.energyMWh.low)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.energyMWh.typical)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.energyMWh.high)}
                  </Text>
                </View>

                <View style={styles.resultsRow}>
                  <Text style={[styles.resultsCell, styles.resultsFirstCol]}>
                    Peak demand (MW)
                  </Text>
                  <Text style={styles.resultsCell}>
                    {calculateResults.peakMW.low.toFixed(1)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {calculateResults.peakMW.typical.toFixed(1)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {calculateResults.peakMW.high.toFixed(1)}
                  </Text>
                </View>

                <View style={styles.resultsRow}>
                  <Text style={[styles.resultsCell, styles.resultsFirstCol]}>
                    Water use (gal/year)
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.waterGal.low)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.waterGal.typical)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.waterGal.high)}
                  </Text>
                </View>

                <View style={styles.resultsRow}>
                  <Text style={[styles.resultsCell, styles.resultsFirstCol]}>
                    GHG emissions (tCO₂/year)
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.ghgTons.low)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.ghgTons.typical)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.ghgTons.high)}
                  </Text>
                </View>

                <View style={styles.resultsRow}>
                  <Text style={[styles.resultsCell, styles.resultsFirstCol]}>
                    Homes equivalent
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.homesEquiv.low)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.homesEquiv.typical)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.homesEquiv.high)}
                  </Text>
                </View>

                <View style={styles.resultsRow}>
                  <Text style={[styles.resultsCell, styles.resultsFirstCol]}>
                    People equiv. (water)
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.peopleEquivWater.low)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.peopleEquivWater.typical)}
                  </Text>
                  <Text style={styles.resultsCell}>
                    {formatNumber(calculateResults.peopleEquivWater.high)}
                  </Text>
                </View>

                {hasDieselUsage && calculateResults.dieselEmissions > 0 && (
                  <View style={styles.resultsRow}>
                    <Text style={[styles.resultsCell, styles.resultsFirstCol]}>
                      Diesel emissions (tCO₂/year)
                    </Text>
                    <Text style={[styles.resultsCell, styles.resultsSpan]}>
                      {formatNumber(calculateResults.dieselEmissions)}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.educationalBlock}>
                If you have more precise information (IT MW, cooling design, environmental
                study filings, or generator permits), you can plug it in to refine the
                estimates.
              </Text>

              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <RotateCcw size={18} color="#1E3A5F" />
                <Text style={styles.resetButtonText}>Reset / Calculate Another</Text>
              </TouchableOpacity>
            </View>
          )}
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
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 12,
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 48,
    maxWidth: 900,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 24,
  },
  assumptionsBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 24,
    gap: 12,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  assumptionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  assumptionsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#92400E',
    flex: 1,
  },
  assumptionsText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1E3A5F',
  },
  sectionContent: {
    padding: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
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
  stateScroll: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
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
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  optionButtonTextActive: {
    color: '#92400E',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#1E3A5F',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#1E3A5F',
    textAlign: 'center',
  },
  resultsTable: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1E3A5F',
  },
  resultsHeaderCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#F59E0B',
    textAlign: 'center',
  },
  resultsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resultsCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  resultsFirstCol: {
    flex: 1.5,
    textAlign: 'left',
    fontWeight: '600' as const,
    color: '#1E3A5F',
  },
  resultsSpan: {
    flex: 3,
  },
  educationalBlock: {
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
    alignSelf: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1E3A5F',
  },
});
