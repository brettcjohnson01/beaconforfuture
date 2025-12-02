import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { Zap, Activity, Wind, Battery, AlertCircle, Server, Droplet } from 'lucide-react-native';
import { Link } from 'expo-router';

type ISO = 'CAISO' | 'PJM' | 'ERCOT' | 'MISO' | 'NYISO' | 'ISO-NE' | 'SPP' | 'BPA' | 'Other';
type RenewablePenetration = 'Low (<20%)' | 'Medium (20-40%)' | 'High (40-60%)' | 'Very High (60%+)';
type MarginalEmissions = 'Gas-dominated' | 'Coal/gas mix' | 'Hydro/wind heavy' | 'Solar-peaking' | 'Dynamically varies';
type UPSType = 'Double-conversion' | 'Line-interactive' | 'Eco-mode';
type RedundancyLevel = 'N' | 'N+1' | 'N+2' | '2N';
type CoolingType = 'Air-cooled DX' | 'Chilled water' | 'Evaporative cooling (indirect)' | 'Direct evaporative cooling' | 'Liquid cooling (direct-to-chip)' | 'Immersion cooling';

interface TrainingJobInput {
  companyName: string;
  jobName: string;
  contactEmail: string;
  gpuHours: string;
  powerPerGpu: string;
  concurrentGpus: string;
  earliestStart: string;
  deadline: string;
  canChunk: boolean;
  minChunkDuration: string;
  maxChunks: string;
  iso: ISO;
  isoSubregion: string;
  renewablePenetration: RenewablePenetration;
  marginalEmissions: MarginalEmissions;
  upsType: UPSType;
  redundancyLevel: RedundancyLevel;
  transformerEfficiency: string;
  coolingType: CoolingType;
  coolingSetpoint: string;
  hasEconomization: boolean;
  economizerHours: string;
  onsiteSolarMw: string;
  onsiteWindMw: string;
  batteryStorageMw: string;
  batteryStorageMwh: string;
  hasThermalStorage: boolean;
  hasPpas: boolean;
}

interface OptimizationResult {
  baseline: {
    totalEnergyMwh: number;
    co2Tonnes: number;
  };
  optimized: {
    totalEnergyMwh: number;
    co2Tonnes: number;
    blocks: { start: string; end: string }[];
  };
  reductionPercent: number;
}

const COLORS = {
  lodestarRust: '#B44A2A',
  lodestarClay: '#D77B42',
  lodestarEmber: '#EFA860',
  lodestarSandlight: '#F6E2C9',
  lodestarCharcoal: '#3B2F2A',
  lodestarEmberGlow: 'rgba(239,168,96,0.55)',
  lodestarInputBg: '#F9EBDD',
};

const isoOptions: ISO[] = ['CAISO', 'PJM', 'ERCOT', 'MISO', 'NYISO', 'ISO-NE', 'SPP', 'BPA', 'Other'];
const renewableOptions: RenewablePenetration[] = ['Low (<20%)', 'Medium (20-40%)', 'High (40-60%)', 'Very High (60%+)'];
const marginalOptions: MarginalEmissions[] = ['Gas-dominated', 'Coal/gas mix', 'Hydro/wind heavy', 'Solar-peaking', 'Dynamically varies'];
const upsOptions: UPSType[] = ['Double-conversion', 'Line-interactive', 'Eco-mode'];
const redundancyOptions: RedundancyLevel[] = ['N', 'N+1', 'N+2', '2N'];
const coolingOptions: CoolingType[] = ['Air-cooled DX', 'Chilled water', 'Evaporative cooling (indirect)', 'Direct evaporative cooling', 'Liquid cooling (direct-to-chip)', 'Immersion cooling'];

export default function LodestarPage() {
  const [formData, setFormData] = useState<TrainingJobInput>({
    companyName: '',
    jobName: '',
    contactEmail: '',
    gpuHours: '',
    powerPerGpu: '0.4',
    concurrentGpus: '',
    earliestStart: '',
    deadline: '',
    canChunk: true,
    minChunkDuration: '2',
    maxChunks: '3',
    iso: 'PJM',
    isoSubregion: '',
    renewablePenetration: 'Medium (20-40%)',
    marginalEmissions: 'Gas-dominated',
    upsType: 'Double-conversion',
    redundancyLevel: 'N+1',
    transformerEfficiency: '98',
    coolingType: 'Chilled water',
    coolingSetpoint: '75',
    hasEconomization: false,
    economizerHours: '0',
    onsiteSolarMw: '0',
    onsiteWindMw: '0',
    batteryStorageMw: '0',
    batteryStorageMwh: '0',
    hasThermalStorage: false,
    hasPpas: false,
  });

  const [result, setResult] = useState<OptimizationResult | null>(null);

  const updateField = <K extends keyof TrainingJobInput>(
    field: K,
    value: TrainingJobInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setToToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastDayStr = lastDayOfMonth.toISOString().split('T')[0];

    setFormData((prev) => ({
      ...prev,
      earliestStart: todayStr,
      deadline: lastDayStr,
    }));
  };

  const applyPreset = (presetName: string) => {
    let preset: Partial<TrainingJobInput> = {};

    switch (presetName) {
      case 'small-hyperscale':
        preset = {
          gpuHours: '5000',
          powerPerGpu: '0.35',
          concurrentGpus: '64',
          canChunk: true,
          minChunkDuration: '4',
          maxChunks: '4',
          iso: 'PJM',
          renewablePenetration: 'Medium (20-40%)',
          marginalEmissions: 'Gas-dominated',
          upsType: 'Eco-mode',
          redundancyLevel: 'N+1',
          transformerEfficiency: '98',
          coolingType: 'Chilled water',
          coolingSetpoint: '75',
          hasEconomization: true,
          economizerHours: '2000',
          onsiteSolarMw: '5',
          onsiteWindMw: '0',
          batteryStorageMw: '2',
          batteryStorageMwh: '4',
          hasThermalStorage: false,
          hasPpas: false,
        };
        break;

      case 'large-enterprise':
        preset = {
          gpuHours: '20000',
          powerPerGpu: '0.4',
          concurrentGpus: '256',
          canChunk: false,
          minChunkDuration: '4',
          maxChunks: '4',
          iso: 'ERCOT',
          renewablePenetration: 'High (40-60%)',
          marginalEmissions: 'Solar-peaking',
          upsType: 'Double-conversion',
          redundancyLevel: '2N',
          transformerEfficiency: '98.5',
          coolingType: 'Air-cooled DX',
          coolingSetpoint: '72',
          hasEconomization: false,
          economizerHours: '0',
          onsiteSolarMw: '0',
          onsiteWindMw: '0',
          batteryStorageMw: '0',
          batteryStorageMwh: '0',
          hasThermalStorage: false,
          hasPpas: true,
        };
        break;

      case 'ai-hpc-intensive':
        preset = {
          gpuHours: '50000',
          powerPerGpu: '0.7',
          concurrentGpus: '512',
          canChunk: true,
          minChunkDuration: '6',
          maxChunks: '6',
          iso: 'CAISO',
          renewablePenetration: 'Very High (60%+)',
          marginalEmissions: 'Hydro/wind heavy',
          upsType: 'Line-interactive',
          redundancyLevel: 'N+1',
          transformerEfficiency: '99',
          coolingType: 'Liquid cooling (direct-to-chip)',
          coolingSetpoint: '80',
          hasEconomization: true,
          economizerHours: '3500',
          onsiteSolarMw: '20',
          onsiteWindMw: '10',
          batteryStorageMw: '15',
          batteryStorageMwh: '60',
          hasThermalStorage: true,
          hasPpas: true,
        };
        break;

      case 'typical-cloud':
        preset = {
          gpuHours: '10000',
          powerPerGpu: '0.4',
          concurrentGpus: '128',
          canChunk: true,
          minChunkDuration: '4',
          maxChunks: '4',
          iso: 'MISO',
          renewablePenetration: 'Medium (20-40%)',
          marginalEmissions: 'Dynamically varies',
          upsType: 'Double-conversion',
          redundancyLevel: 'N+1',
          transformerEfficiency: '98',
          coolingType: 'Evaporative cooling (indirect)',
          coolingSetpoint: '75',
          hasEconomization: true,
          economizerHours: '2500',
          onsiteSolarMw: '10',
          onsiteWindMw: '0',
          batteryStorageMw: '5',
          batteryStorageMwh: '10',
          hasThermalStorage: false,
          hasPpas: true,
        };
        break;
    }

    setFormData((prev) => ({ ...prev, ...preset }));
  };

  const calculateOptimization = () => {
    const gpuHours = parseFloat(formData.gpuHours) || 0;
    const powerPerGpu = parseFloat(formData.powerPerGpu) || 0.4;
    let totalEnergyMwh = (gpuHours * powerPerGpu) / 1000;

    const transformerEff = parseFloat(formData.transformerEfficiency) || 98;
    totalEnergyMwh = totalEnergyMwh / (transformerEff / 100);

    const coolingMultipliers: Record<CoolingType, number> = {
      'Air-cooled DX': 1.25,
      'Chilled water': 1.15,
      'Evaporative cooling (indirect)': 1.12,
      'Direct evaporative cooling': 1.10,
      'Liquid cooling (direct-to-chip)': 1.08,
      'Immersion cooling': 1.05,
    };
    totalEnergyMwh = totalEnergyMwh * coolingMultipliers[formData.coolingType];

    const renewableFactors: Record<RenewablePenetration, number> = {
      'Low (<20%)': 0.65,
      'Medium (20-40%)': 0.45,
      'High (40-60%)': 0.30,
      'Very High (60%+)': 0.18,
    };

    const baselineCo2 = totalEnergyMwh * renewableFactors[formData.renewablePenetration];

    const onsiteSolar = parseFloat(formData.onsiteSolarMw) || 0;
    const onsiteWind = parseFloat(formData.onsiteWindMw) || 0;
    const batteryMw = parseFloat(formData.batteryStorageMw) || 0;
    const onsiteTotal = onsiteSolar + onsiteWind + batteryMw;

    let optimizationFactor = 1.0;
    if (formData.canChunk && onsiteTotal > 5) {
      optimizationFactor = 0.70;
    } else if (formData.canChunk) {
      optimizationFactor = 0.80;
    } else if (onsiteTotal > 5) {
      optimizationFactor = 0.88;
    } else if (formData.hasEconomization) {
      optimizationFactor = 0.92;
    }

    const optimizedCo2 = baselineCo2 * optimizationFactor;
    const reductionPercent = ((baselineCo2 - optimizedCo2) / baselineCo2) * 100;

    const blocks = formData.canChunk
      ? [
          { start: 'Jan 15, 02:00', end: 'Jan 15, 08:00' },
          { start: 'Jan 16, 12:00', end: 'Jan 16, 18:00' },
          { start: 'Jan 17, 12:00', end: 'Jan 17, 18:00' },
        ]
      : [{ start: 'Jan 15, 00:00', end: 'Jan 17, 23:59' }];

    setResult({
      baseline: {
        totalEnergyMwh,
        co2Tonnes: baselineCo2,
      },
      optimized: {
        totalEnergyMwh,
        co2Tonnes: optimizedCo2,
        blocks,
      },
      reductionPercent,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.labsBadge}>
            <Text style={styles.labsBadgeText}>BEACON LABS</Text>
          </View>

          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/jiq1hcopq2l86h1aregrf' }}
            style={styles.lodestarSymbol}
            resizeMode="contain"
          />

          <Text style={styles.title}>LODESTAR</Text>
          <Text style={styles.subtitle}>Grid-Aware AI Training Planner</Text>

          <Text style={styles.description}>
            Optimize when and where large-scale AI training runs occur by aligning workloads with hourly grid conditions, ISO market dynamics, and your data center&apos;s configuration.
          </Text>

          <Text style={styles.supportingText}>
            Built for AI developers, data center operators, and sustainability teams.
          </Text>

          <View style={styles.enterpriseBadge}>
            <Text style={styles.enterpriseBadgeText}>BEACON Labs · Developer Tool</Text>
          </View>

          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>About LODESTAR</Text>
            <Text style={styles.aboutText}>
              LODESTAR analyzes ISO market behavior, renewable generation forecasts, and your facility&apos;s cooling and electrical configuration to recommend the cleanest and most efficient training windows.
            </Text>
            <Text style={[styles.aboutText, { marginTop: 12 }]}>
              By scheduling AI training during cleaner grid hours, operators can lower emissions, reduce operational strain, and demonstrate transparent environmental responsibility.
            </Text>
          </View>

          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back to BEACON</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.presetsCard}>
          <View style={styles.presetsHeader}>
            <Zap size={20} color={COLORS.lodestarEmber} />
            <Text style={styles.presetsTitle}>Quick Presets</Text>
          </View>
          <Text style={styles.presetsSubtitle}>
            Select a typical scenario to auto-fill the form with reasonable defaults
          </Text>
          <View style={styles.presetsGrid}>
            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => applyPreset('small-hyperscale')}
            >
              <Text style={styles.presetButtonTitle}>Small Hyperscale</Text>
              <Text style={styles.presetButtonDesc}>5K GPU-hrs, chunking enabled, some renewables</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => applyPreset('large-enterprise')}
            >
              <Text style={styles.presetButtonTitle}>Large Enterprise</Text>
              <Text style={styles.presetButtonDesc}>20K GPU-hrs, continuous run, high redundancy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => applyPreset('ai-hpc-intensive')}
            >
              <Text style={styles.presetButtonTitle}>AI/HPC Intensive</Text>
              <Text style={styles.presetButtonDesc}>50K GPU-hrs, liquid cooling, major on-site renewables</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => applyPreset('typical-cloud')}
            >
              <Text style={styles.presetButtonTitle}>Typical Cloud</Text>
              <Text style={styles.presetButtonDesc}>10K GPU-hrs, standard config, moderate renewables</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.presetsNote}>
            After selecting a preset, you can customize any individual field below.
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.formColumn}>
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Job & Company Info</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Company Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.companyName}
                  onChangeText={(val) => updateField('companyName', val)}
                  placeholder="e.g., Acme AI Labs"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Model / Training Job Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.jobName}
                  onChangeText={(val) => updateField('jobName', val)}
                  placeholder="e.g., GPT-Next-v2"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contactEmail}
                  onChangeText={(val) => updateField('contactEmail', val)}
                  placeholder="contact@example.com"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Training Job Characteristics</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Total GPU-hours</Text>
                <TextInput
                  style={styles.input}
                  value={formData.gpuHours}
                  onChangeText={(val) => updateField('gpuHours', val)}
                  placeholder="e.g., 10000"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Estimated Power per GPU (kW)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.powerPerGpu}
                  onChangeText={(val) => updateField('powerPerGpu', val)}
                  placeholder="0.4"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Number of GPUs Running Concurrently</Text>
                <TextInput
                  style={styles.input}
                  value={formData.concurrentGpus}
                  onChangeText={(val) => updateField('concurrentGpus', val)}
                  placeholder="e.g., 128"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Earliest Start Date</Text>
                <TextInput
                  style={styles.input}
                  value={formData.earliestStart}
                  onChangeText={(val) => updateField('earliestStart', val)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                />
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={setToToday}
                >
                  <Text style={styles.quickDateButtonText}>Set to Today</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Deadline</Text>
                <TextInput
                  style={styles.input}
                  value={formData.deadline}
                  onChangeText={(val) => updateField('deadline', val)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                />
              </View>

              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => updateField('canChunk', !formData.canChunk)}
                >
                  <View
                    style={[
                      styles.checkboxInner,
                      formData.canChunk && styles.checkboxChecked,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Job can be chunked</Text>
              </View>

              {formData.canChunk && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Min Chunk Duration (hours)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.minChunkDuration}
                      onChangeText={(val) => updateField('minChunkDuration', val)}
                      placeholder="4"
                      placeholderTextColor={COLORS.lodestarCharcoal}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Max Number of Chunks</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.maxChunks}
                      onChangeText={(val) => updateField('maxChunks', val)}
                      placeholder="4"
                      placeholderTextColor={COLORS.lodestarCharcoal}
                      keyboardType="numeric"
                    />
                  </View>
                </>
              )}
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>ISO & Grid Context</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ISO</Text>
                <View style={styles.radioGroup}>
                  {isoOptions.map((iso) => (
                    <TouchableOpacity
                      key={iso}
                      style={styles.radioRow}
                      onPress={() => updateField('iso', iso)}
                    >
                      <View
                        style={[
                          styles.radio,
                          formData.iso === iso && styles.radioSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{iso}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ISO Subregion / Load Zone</Text>
                <TextInput
                  style={styles.input}
                  value={formData.isoSubregion}
                  onChangeText={(val) => updateField('isoSubregion', val)}
                  placeholder="e.g., EMAAC, NP15, Houston, etc."
                  placeholderTextColor={COLORS.lodestarCharcoal}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Expected Renewable Penetration</Text>
                <View style={styles.radioGroup}>
                  {renewableOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioRow}
                      onPress={() => updateField('renewablePenetration', option)}
                    >
                      <View
                        style={[
                          styles.radio,
                          formData.renewablePenetration === option && styles.radioSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Marginal Emissions Tendency</Text>
                <View style={styles.radioGroup}>
                  {marginalOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioRow}
                      onPress={() => updateField('marginalEmissions', option)}
                    >
                      <View
                        style={[
                          styles.radio,
                          formData.marginalEmissions === option && styles.radioSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Data Center Configuration</Text>

              <View style={styles.subsectionHeader}>
                <Server size={18} color={COLORS.lodestarEmber} />
                <Text style={styles.subsectionTitle}>Electrical Characteristics</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>UPS Type</Text>
                <View style={styles.radioGroup}>
                  {upsOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioRow}
                      onPress={() => updateField('upsType', option)}
                    >
                      <View
                        style={[
                          styles.radio,
                          formData.upsType === option && styles.radioSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Redundancy Level</Text>
                <View style={styles.radioGroup}>
                  {redundancyOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioRow}
                      onPress={() => updateField('redundancyLevel', option)}
                    >
                      <View
                        style={[
                          styles.radio,
                          formData.redundancyLevel === option && styles.radioSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Transformer Efficiency (%)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.transformerEfficiency}
                  onChangeText={(val) => updateField('transformerEfficiency', val)}
                  placeholder="98"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.subsectionHeader}>
                <Droplet size={18} color={COLORS.lodestarEmber} />
                <Text style={styles.subsectionTitle}>Cooling Technology</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cooling System Type</Text>
                <View style={styles.radioGroup}>
                  {coolingOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioRow}
                      onPress={() => updateField('coolingType', option)}
                    >
                      <View
                        style={[
                          styles.radio,
                          formData.coolingType === option && styles.radioSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cooling Setpoint (°F)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.coolingSetpoint}
                  onChangeText={(val) => updateField('coolingSetpoint', val)}
                  placeholder="75"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => updateField('hasEconomization', !formData.hasEconomization)}
                >
                  <View
                    style={[
                      styles.checkboxInner,
                      formData.hasEconomization && styles.checkboxChecked,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Economization capability</Text>
              </View>

              {formData.hasEconomization && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Expected economizer hours per year</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.economizerHours}
                    onChangeText={(val) => updateField('economizerHours', val)}
                    placeholder="e.g., 2000"
                    placeholderTextColor={COLORS.lodestarCharcoal}
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>On-Site Energy & Storage</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>On-site Solar (MWdc)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.onsiteSolarMw}
                  onChangeText={(val) => updateField('onsiteSolarMw', val)}
                  placeholder="0"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>On-site Wind (MW)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.onsiteWindMw}
                  onChangeText={(val) => updateField('onsiteWindMw', val)}
                  placeholder="0"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Battery Storage – Power Rating (MW)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.batteryStorageMw}
                  onChangeText={(val) => updateField('batteryStorageMw', val)}
                  placeholder="0"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Battery Storage – Energy Capacity (MWh)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.batteryStorageMwh}
                  onChangeText={(val) => updateField('batteryStorageMwh', val)}
                  placeholder="0"
                  placeholderTextColor={COLORS.lodestarCharcoal}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => updateField('hasThermalStorage', !formData.hasThermalStorage)}
                >
                  <View
                    style={[
                      styles.checkboxInner,
                      formData.hasThermalStorage && styles.checkboxChecked,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Thermal storage</Text>
              </View>

              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => updateField('hasPpas', !formData.hasPpas)}
                >
                  <View
                    style={[
                      styles.checkboxInner,
                      formData.hasPpas && styles.checkboxChecked,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Corporate PPAs</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.calculateButton} onPress={calculateOptimization}>
              <Activity size={20} color={COLORS.lodestarCharcoal} />
              <Text style={styles.calculateButtonText}>Calculate Optimization</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultsColumn}>
            {result ? (
              <View style={styles.resultsCard}>
                <Text style={styles.resultsTitle}>Optimization Results</Text>

                <View style={styles.resultsSection}>
                  <View style={styles.resultsSectionHeader}>
                    <Zap size={24} color={COLORS.lodestarEmber} />
                    <Text style={styles.resultsSectionTitle}>
                      Recommended Optimized Schedule
                    </Text>
                  </View>

                  {result.optimized.blocks.map((block, idx) => (
                    <View key={idx} style={styles.blockItem}>
                      <Text style={styles.blockText}>
                        Block {idx + 1}: {block.start} – {block.end}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.resultsSection}>
                  <View style={styles.resultsSectionHeader}>
                    <Activity size={24} color={COLORS.lodestarEmber} />
                    <Text style={styles.resultsSectionTitle}>Emissions Comparison</Text>
                  </View>

                  <View style={styles.comparisonTable}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderCell}>Metric</Text>
                      <Text style={styles.tableHeaderCell}>Baseline</Text>
                      <Text style={styles.tableHeaderCell}>Optimized</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Total job energy (MWh)</Text>
                      <Text style={styles.tableCell}>
                        {result.baseline.totalEnergyMwh.toFixed(1)}
                      </Text>
                      <Text style={styles.tableCell}>
                        {result.optimized.totalEnergyMwh.toFixed(1)}
                      </Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>Estimated CO₂e (tonnes)</Text>
                      <Text style={styles.tableCell}>{result.baseline.co2Tonnes.toFixed(1)}</Text>
                      <Text style={styles.tableCell}>
                        {result.optimized.co2Tonnes.toFixed(1)}
                      </Text>
                    </View>

                    <View style={[styles.tableRow, styles.highlightRow]}>
                      <Text style={styles.tableCell}>Emissions reduction</Text>
                      <Text style={styles.tableCell}>—</Text>
                      <Text style={[styles.tableCell, styles.highlightText]}>
                        {result.reductionPercent.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>

                {formData.canChunk && (
                  <View style={styles.resultsSection}>
                    <View style={styles.resultsSectionHeader}>
                      <Battery size={24} color={COLORS.lodestarEmber} />
                      <Text style={styles.resultsSectionTitle}>Chunking Recommendation</Text>
                    </View>
                    <Text style={styles.chunkingText}>
                      By splitting your training job into {result.optimized.blocks.length} chunks
                      aligned with clean energy windows, you can reduce emissions by{' '}
                      {result.reductionPercent.toFixed(0)}% while maintaining performance targets.
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.placeholderCard}>
                <AlertCircle size={48} color={COLORS.lodestarCharcoal} />
                <Text style={styles.placeholderText}>
                  Fill in the form and click &ldquo;Calculate Optimization&rdquo; to see results
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.howItWorksSection}>
          <Text style={styles.howItWorksTitle}>How LODESTAR Calculates Clean Training Windows</Text>
          <View style={styles.bulletContainer}>
            <View style={styles.bulletRow}>
              <Wind size={20} color={COLORS.lodestarEmber} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletBold}>ISO market analysis:</Text> Evaluates regional grid operator data, including marginal emissions and renewable penetration patterns.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Activity size={20} color={COLORS.lodestarEmber} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletBold}>Hourly scoring:</Text> Divides the training window
                into hourly slots, assigning cleanliness scores based on grid conditions and renewable generation.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Server size={20} color={COLORS.lodestarEmber} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletBold}>Facility modeling:</Text> Accounts for
                UPS efficiency, cooling system type, transformer losses, and economization capabilities.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Zap size={20} color={COLORS.lodestarEmber} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletBold}>On-site resource optimization:</Text> Prioritizes
                on-site solar, wind, and battery storage windows to maximize self-generation.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Battery size={20} color={COLORS.lodestarEmber} />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletBold}>Chunk optimization:</Text> If chunking is enabled,
                schedules training blocks during the cleanest hours to minimize total emissions.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.enterpriseSection}>
          <Text style={styles.enterpriseTitle}>Future Enterprise Licensing</Text>
          <Text style={styles.enterpriseDescription}>
            LODESTAR will eventually support API access, automated multi-region optimization, and
            certification for companies demonstrating low-carbon AI training practices.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact BEACON Labs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lodestarRust,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.lodestarClay,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lodestarEmber,
  },
  labsBadge: {
    backgroundColor: COLORS.lodestarClay,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 20,
  },
  labsBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: COLORS.lodestarSandlight,
    letterSpacing: 1.2,
  },
  lodestarSymbol: {
    width: 200,
    height: 200,
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: '900' as const,
    color: COLORS.lodestarEmber,
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.lodestarCharcoal,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  description: {
    fontSize: 16,
    color: COLORS.lodestarSandlight,
    lineHeight: 24,
    textAlign: 'center' as const,
    maxWidth: 700,
    marginBottom: 12,
  },
  supportingText: {
    fontSize: 14,
    color: COLORS.lodestarCharcoal,
    textAlign: 'center' as const,
    marginBottom: 20,
  },
  enterpriseBadge: {
    backgroundColor: COLORS.lodestarClay,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lodestarEmber,
    marginBottom: 24,
  },
  enterpriseBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: COLORS.lodestarEmber,
  },
  aboutCard: {
    backgroundColor: COLORS.lodestarEmberGlow,
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    maxWidth: 700,
    borderWidth: 1,
    borderColor: COLORS.lodestarEmber,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.lodestarEmber,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#2E2A28',
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.lodestarCharcoal,
    fontWeight: '600' as const,
  },
  presetsCard: {
    backgroundColor: COLORS.lodestarSandlight,
    marginHorizontal: 24,
    marginTop: 40,
    padding: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.lodestarEmber,
    maxWidth: 1400,
    width: '100%',
    marginLeft: 'auto' as const,
    marginRight: 'auto' as const,
  },
  presetsHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    marginBottom: 8,
  },
  presetsTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: COLORS.lodestarEmber,
  },
  presetsSubtitle: {
    fontSize: 14,
    color: COLORS.lodestarCharcoal,
    marginBottom: 20,
    lineHeight: 20,
  },
  presetsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
    marginBottom: 16,
  },
  presetButton: {
    flex: 1,
    minWidth: 150,
    backgroundColor: COLORS.lodestarInputBg,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.lodestarEmber,
  },
  presetButtonTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.lodestarEmber,
    marginBottom: 6,
  },
  presetButtonDesc: {
    fontSize: 13,
    color: COLORS.lodestarCharcoal,
    lineHeight: 18,
  },
  presetsNote: {
    fontSize: 12,
    color: COLORS.lodestarCharcoal,
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
  },
  contentContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 24,
    maxWidth: 1400,
    width: '100%',
    marginHorizontal: 'auto' as const,
  },
  formColumn: {
    flex: 1,
    minWidth: 300,
    maxWidth: 600,
  },
  resultsColumn: {
    flex: 1,
    minWidth: 300,
    maxWidth: 600,
  },
  formCard: {
    backgroundColor: COLORS.lodestarSandlight,
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.lodestarEmber,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.lodestarEmber,
    marginBottom: 20,
  },
  subsectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.lodestarCharcoal,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.lodestarCharcoal,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lodestarInputBg,
    borderWidth: 1,
    borderColor: COLORS.lodestarEmber,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.lodestarCharcoal,
  },
  checkboxRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.lodestarEmber,
    borderRadius: 4,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.lodestarInputBg,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.lodestarEmber,
  },
  checkboxLabel: {
    fontSize: 15,
    color: COLORS.lodestarCharcoal,
  },
  radioGroup: {
    gap: 12,
  },
  radioRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lodestarEmber,
    backgroundColor: COLORS.lodestarInputBg,
  },
  radioSelected: {
    backgroundColor: COLORS.lodestarEmber,
  },
  radioLabel: {
    fontSize: 15,
    color: COLORS.lodestarCharcoal,
  },
  calculateButton: {
    backgroundColor: COLORS.lodestarEmber,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 10,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: COLORS.lodestarEmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: COLORS.lodestarCharcoal,
  },
  resultsCard: {
    backgroundColor: COLORS.lodestarSandlight,
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.lodestarEmber,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: COLORS.lodestarEmber,
    marginBottom: 24,
  },
  resultsSection: {
    marginBottom: 32,
  },
  resultsSectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 16,
  },
  resultsSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.lodestarCharcoal,
  },
  blockItem: {
    backgroundColor: COLORS.lodestarInputBg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.lodestarEmber,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 4,
  },
  blockText: {
    fontSize: 15,
    color: COLORS.lodestarCharcoal,
    fontWeight: '600' as const,
  },
  comparisonTable: {
    backgroundColor: COLORS.lodestarInputBg,
    borderRadius: 6,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: COLORS.lodestarEmber,
  },
  tableHeader: {
    flexDirection: 'row' as const,
    backgroundColor: COLORS.lodestarClay,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700' as const,
    color: COLORS.lodestarSandlight,
    textTransform: 'uppercase' as const,
  },
  tableRow: {
    flexDirection: 'row' as const,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lodestarEmber,
  },
  highlightRow: {
    backgroundColor: COLORS.lodestarEmberGlow,
    borderBottomWidth: 0,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: COLORS.lodestarCharcoal,
  },
  highlightText: {
    color: COLORS.lodestarEmber,
    fontWeight: '800' as const,
    fontSize: 16,
  },
  chunkingText: {
    fontSize: 15,
    color: COLORS.lodestarCharcoal,
    lineHeight: 22,
  },
  placeholderCard: {
    backgroundColor: COLORS.lodestarSandlight,
    borderRadius: 8,
    padding: 60,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 2,
    borderColor: COLORS.lodestarEmber,
    borderStyle: 'dashed' as const,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.lodestarCharcoal,
    textAlign: 'center' as const,
    marginTop: 20,
    maxWidth: 300,
  },
  howItWorksSection: {
    backgroundColor: COLORS.lodestarSandlight,
    marginTop: 40,
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lodestarEmber,
    maxWidth: 1400,
    marginLeft: 'auto' as const,
    marginRight: 'auto' as const,
    width: '100%',
  },
  howItWorksTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: COLORS.lodestarEmber,
    marginBottom: 24,
  },
  bulletContainer: {
    gap: 20,
  },
  bulletRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 16,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.lodestarCharcoal,
    lineHeight: 22,
  },
  bulletBold: {
    fontWeight: '700' as const,
    color: COLORS.lodestarCharcoal,
  },
  enterpriseSection: {
    backgroundColor: COLORS.lodestarSandlight,
    marginTop: 40,
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.lodestarEmber,
    alignItems: 'center' as const,
    maxWidth: 1400,
    marginLeft: 'auto' as const,
    marginRight: 'auto' as const,
    width: '100%',
  },
  enterpriseTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: COLORS.lodestarEmber,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  enterpriseDescription: {
    fontSize: 16,
    color: COLORS.lodestarCharcoal,
    lineHeight: 24,
    textAlign: 'center' as const,
    maxWidth: 700,
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: COLORS.lodestarEmber,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: COLORS.lodestarEmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: COLORS.lodestarCharcoal,
  },
  quickDateButton: {
    backgroundColor: COLORS.lodestarClay,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.lodestarEmber,
    alignSelf: 'flex-start' as const,
  },
  quickDateButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: COLORS.lodestarCharcoal,
  },
});
