import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import {
  Search,
  Calculator,
  Cloud,
  FileText,
  Users,
  X,
  BarChart3,
} from 'lucide-react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useRouter } from 'expo-router';

interface ToolCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
  onPress: () => void;
}

function ToolCard({ icon: Icon, title, description, onPress }: ToolCardProps) {
  return (
    <TouchableOpacity style={styles.toolCard} onPress={onPress}>
      <Icon size={40} color="#F59E0B" />
      <Text style={styles.toolTitle}>{title}</Text>
      <Text style={styles.toolDescription}>{description}</Text>
      <View style={styles.launchButton}>
        <Text style={styles.launchButtonText}>Launch Tool</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ToolsPage() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [llcCompanyName, setLlcCompanyName] = useState('');
  const [llcState, setLlcState] = useState('');

  const [emissionsMW, setEmissionsMW] = useState('');
  const [emissionsGridMix, setEmissionsGridMix] = useState('mixed');
  const [emissionsResult, setEmissionsResult] = useState<string | null>(null);

  const [cbaSize, setCbaSize] = useState('');
  const [cbaIncentives, setCbaIncentives] = useState('');
  const [cbaEJLevel, setCbaEJLevel] = useState('');
  const [cbaResult, setCbaResult] = useState<string[]>([]);

  const calculateEmissions = () => {
    const mw = parseFloat(emissionsMW);
    if (isNaN(mw)) return;

    const emissionFactors: Record<string, number> = {
      coal: 0.95,
      gas: 0.55,
      mixed: 0.5,
      renewables: 0.1,
    };

    const factor = emissionFactors[emissionsGridMix] || 0.5;
    const annualMWh = mw * 8760;
    const annualCO2 = Math.round(annualMWh * factor);

    setEmissionsResult(
      `Annual Energy: ${annualMWh.toLocaleString()} MWh\n` +
      `Emission Factor: ${factor} tons CO₂/MWh\n` +
      `Annual CO₂ Emissions: ${annualCO2.toLocaleString()} tons\n\n` +
      `Assumptions: PUE 1.5, ${emissionsGridMix} grid mix`
    );
  };

  const generateCBARecommendations = () => {
    const size = parseFloat(cbaSize);
    const incentives = parseFloat(cbaIncentives);
    const ejLevel = parseFloat(cbaEJLevel);

    const recommendations = [];

    if (size > 100) {
      recommendations.push('Require local hiring targets (minimum 30% of workforce)');
      recommendations.push('Mandate workforce development partnerships with local schools');
    }

    if (incentives > 10000000) {
      recommendations.push('Infrastructure contributions (roads, utilities, schools)');
      recommendations.push('Annual community benefit fund ($500k minimum)');
    }

    if (ejLevel > 70) {
      recommendations.push('Air quality monitoring equipment and reporting');
      recommendations.push('Priority hiring from affected census tracts');
      recommendations.push('Health impact study and mitigation plan');
    }

    recommendations.push('Water usage reporting and conservation targets');
    recommendations.push('Renewable energy procurement targets (50% minimum)');
    recommendations.push('Quarterly community meetings with full transparency');

    setCbaResult(recommendations);
  };

  return (
    <View style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>BEACON Tools</Text>
          <Text style={styles.pageSubtitle}>
            Tools to help communities, journalists, and advocates analyze proposed and
            existing data center projects
          </Text>
        </View>

        <View style={styles.toolsGrid}>
          <ToolCard
            icon={Search}
            title="BEACON LLC Tracker"
            description="Tracks limited liability companies and shell entities commonly used in data center deals, helping communities connect projects to parent companies and previous developments."
            onPress={() => setActiveModal('llc')}
          />

          <ToolCard
            icon={Calculator}
            title="BEACON Susceptibility Calculator"
            description="Scores locations based on existing tax exclusions, proximity to transmission and fiber, permitting reforms, and available land to assess susceptibility to future data centers."
            onPress={() => router.push('/susceptibility')}
          />

          <ToolCard
            icon={Cloud}
            title="BEACON Emissions Calculator"
            description="Estimates annual CO₂ emissions and air pollution from a data center based on MW load, grid mix (coal/gas/renewables), and PUE."
            onPress={() => setActiveModal('emissions')}
          />

          <ToolCard
            icon={FileText}
            title="BEACON CBA AI Tool"
            description="Community Benefit Agreement AI Helper that guides communities on possible CBA elements based on project size, incentives received, and local burdens."
            onPress={() => router.push('/cba-tool')}
          />

          <ToolCard
            icon={Users}
            title="Community Network"
            description="Connect with communities facing similar data center projects. Share strategies, resources, and organizing tactics with organizers nationwide."
            onPress={() => router.push('/network')}
          />

          <ToolCard
            icon={BarChart3}
            title="Footprint Calculator"
            description="Estimate screening-level environmental impacts including electricity use, water consumption, and carbon emissions for data center projects."
            onPress={() => router.push('/footprint-calculator')}
          />

          <ToolCard
            icon={Users}
            title="BEACON Community Capability Builder"
            description="A coalition and community capability builder that aggregates resources, talking points, and example campaigns for those opposing or reshaping data center proposals."
            onPress={() => setActiveModal('coalition')}
          />
        </View>

        <Footer />
      </ScrollView>

      <Modal
        visible={activeModal === 'llc'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>BEACON LLC Tracker</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Northstar Development LLC"
                value={llcCompanyName}
                onChangeText={setLlcCompanyName}
              />

              <Text style={styles.inputLabel}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Virginia"
                value={llcState}
                onChangeText={setLlcState}
              />

              <TouchableOpacity style={styles.calculateButton}>
                <Text style={styles.calculateButtonText}>Search Filings</Text>
              </TouchableOpacity>

              <View style={styles.resultBox}>
                <Text style={styles.resultText}>
                  [Mock Results]{'\n\n'}
                  This tool would search state business registries, property records, and
                  environmental permits to identify shell companies and their connections
                  to known data center operators.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>



      <Modal
        visible={activeModal === 'emissions'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>BEACON Emissions Calculator</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Power Load (MW)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 150"
                keyboardType="numeric"
                value={emissionsMW}
                onChangeText={setEmissionsMW}
              />

              <Text style={styles.inputLabel}>Grid Mix</Text>
              <View style={styles.optionButtons}>
                {[
                  { key: 'coal', label: 'Coal' },
                  { key: 'gas', label: 'Gas' },
                  { key: 'mixed', label: 'Mixed' },
                  { key: 'renewables', label: 'Renewables' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionButton,
                      emissionsGridMix === option.key && styles.optionButtonActive,
                    ]}
                    onPress={() => setEmissionsGridMix(option.key)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        emissionsGridMix === option.key && styles.optionButtonTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.calculateButton}
                onPress={calculateEmissions}
              >
                <Text style={styles.calculateButtonText}>Calculate</Text>
              </TouchableOpacity>

              {emissionsResult && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultText}>{emissionsResult}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={activeModal === 'cba'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>BEACON CBA AI Tool</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.subtitle}>Community Benefit Agreement Helper</Text>

              <Text style={styles.inputLabel}>Facility Size (MW)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 200"
                keyboardType="numeric"
                value={cbaSize}
                onChangeText={setCbaSize}
              />

              <Text style={styles.inputLabel}>Incentives Amount ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 50000000"
                keyboardType="numeric"
                value={cbaIncentives}
                onChangeText={setCbaIncentives}
              />

              <Text style={styles.inputLabel}>EJ Percentile</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 85"
                keyboardType="numeric"
                value={cbaEJLevel}
                onChangeText={setCbaEJLevel}
              />

              <TouchableOpacity
                style={styles.calculateButton}
                onPress={generateCBARecommendations}
              >
                <Text style={styles.calculateButtonText}>Generate Recommendations</Text>
              </TouchableOpacity>

              {cbaResult.length > 0 && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultTitle}>
                    Recommended CBA Elements:
                  </Text>
                  {cbaResult.map((rec, index) => (
                    <Text key={index} style={styles.listItem}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={activeModal === 'coalition'}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>BEACON Community Capability Builder</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.subtitle}>
                Resources for Community Organizing & Advocacy
              </Text>

              <View style={styles.resourceSection}>
                <Text style={styles.resourceTitle}>Organizing Resources</Text>
                <Text style={styles.resourceItem}>
                  • Template: Community petition against data center proposal
                </Text>
                <Text style={styles.resourceItem}>
                  • Guide: Organizing public comment campaigns
                </Text>
                <Text style={styles.resourceItem}>
                  • Sample: Press release for local media
                </Text>
              </View>

              <View style={styles.resourceSection}>
                <Text style={styles.resourceTitle}>Legal Tools</Text>
                <Text style={styles.resourceItem}>
                  • FOIA request templates for tax incentive data
                </Text>
                <Text style={styles.resourceItem}>
                  • Environmental impact assessment checklist
                </Text>
                <Text style={styles.resourceItem}>
                  • Model ordinances for data center regulations
                </Text>
              </View>

              <View style={styles.resourceSection}>
                <Text style={styles.resourceTitle}>Technical Assistance</Text>
                <Text style={styles.resourceItem}>
                  • Water usage impact calculator
                </Text>
                <Text style={styles.resourceItem}>
                  • Energy grid impact assessment tool
                </Text>
                <Text style={styles.resourceItem}>
                  • Tax incentive cost-benefit analysis template
                </Text>
              </View>

              <View style={styles.resourceSection}>
                <Text style={styles.resourceTitle}>Example Campaigns</Text>
                <Text style={styles.resourceItem}>
                  • Case Study: Successful CBA negotiation in Prince William County, VA
                </Text>
                <Text style={styles.resourceItem}>
                  • Case Study: Community coalition stops data center in residential area
                </Text>
                <Text style={styles.resourceItem}>
                  • Case Study: Local government reforms data center tax policy
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 48,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 12,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 24,
  },
  toolsGrid: {
    paddingHorizontal: 16,
    paddingVertical: 48,
    gap: 16,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  toolCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  toolTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A5F',
    marginTop: 16,
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  launchButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  launchButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
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
    maxHeight: '85%',
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
    flex: 1,
  },
  modalScroll: {
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  optionButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  optionButtonTextActive: {
    color: '#1E3A5F',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  checkboxBoxActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  checkboxText: {
    fontSize: 14,
    color: '#4B5563',
  },
  calculateButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  resultBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 4,
  },
  resourceSection: {
    marginBottom: 24,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  resourceItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 24,
  },
});
