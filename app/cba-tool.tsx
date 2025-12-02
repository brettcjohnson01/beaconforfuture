import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { FileText, ExternalLink, Tag } from 'lucide-react-native';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { cbaDocuments, CbaSector, CbaDocument } from '@/mocks/cbaDocuments';

type DocTypeFilter = CbaDocument['docType'] | 'All';

export default function CbaToolPage() {
  const [sectorFilter, setSectorFilter] = useState<CbaSector | 'All'>('All');
  const [docTypeFilter, setDocTypeFilter] = useState<DocTypeFilter>('All');

  const filteredDocuments = useMemo(() => {
    return cbaDocuments.filter((doc) => {
      const matchesSector = sectorFilter === 'All' || doc.sector === sectorFilter;
      const matchesDocType = docTypeFilter === 'All' || doc.docType === docTypeFilter;
      return matchesSector && matchesDocType;
    });
  }, [sectorFilter, docTypeFilter]);

  const openPDF = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>CBA AI Tool (In Development)</Text>
        </View>

        <View style={styles.devMessage}>
          <Text style={styles.devTitle}>This tool is currently in development.</Text>
          <Text style={styles.devText}>
            BEACON is building an AI assistant that will help communities draft and review
            Community Benefits Agreements (CBAs) for data centers and other large energy
            projects.
          </Text>
          <Text style={styles.devText}>
            In the meantime, we&apos;ve curated a set of public CBAs, host community agreements,
            and guides that the AI will be trained on. These documents can already help you
            understand what is possible to negotiate and how other communities have
            structured their agreements.
          </Text>
        </View>

        <View style={styles.librarySection}>
          <Text style={styles.sectionTitle}>CBA Document Library</Text>

          <View style={styles.filters}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Sector</Text>
              <View style={styles.filterButtons}>
                {(['All', 'Data Center', 'Wind', 'Solar', 'Cross-Sector'] as const).map(
                  (sector) => (
                    <TouchableOpacity
                      key={sector}
                      style={[
                        styles.filterButton,
                        sectorFilter === sector && styles.filterButtonActive,
                      ]}
                      onPress={() => setSectorFilter(sector)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          sectorFilter === sector && styles.filterButtonTextActive,
                        ]}
                      >
                        {sector}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Document Type</Text>
              <View style={styles.filterButtons}>
                {([
                  'All',
                  'CBA',
                  'Host Community Agreement',
                  'Guide / Toolkit',
                  'Report / Case Studies',
                ] as const).map((docType) => (
                  <TouchableOpacity
                    key={docType}
                    style={[
                      styles.filterButton,
                      docTypeFilter === docType && styles.filterButtonActive,
                    ]}
                    onPress={() => setDocTypeFilter(docType)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        docTypeFilter === docType && styles.filterButtonTextActive,
                      ]}
                    >
                      {docType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.documentsGrid}>
            {filteredDocuments.map((doc) => (
              <View key={doc.id} style={styles.docCard}>
                <View style={styles.docHeader}>
                  <FileText size={32} color="#F59E0B" />
                  <View style={styles.docMeta}>
                    <Text style={styles.docMetaText}>
                      {doc.sector} · {doc.docType}
                    </Text>
                    {doc.year && (
                      <Text style={styles.docMetaText}>{doc.year}</Text>
                    )}
                  </View>
                </View>

                <Text style={styles.docTitle}>{doc.title}</Text>

                {doc.location && (
                  <Text style={styles.docLocation}>{doc.location}</Text>
                )}

                {doc.parties && (
                  <Text style={styles.docParties}>{doc.parties}</Text>
                )}

                <Text style={styles.docSummary}>{doc.summary}</Text>

                {doc.tags && doc.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {doc.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Tag size={12} color="#92400E" />
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => openPDF(doc.url)}
                >
                  <Text style={styles.openButtonText}>Open PDF</Text>
                  <ExternalLink size={16} color="#1E3A5F" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {filteredDocuments.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No documents match the selected filters.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonTitle}>Coming Soon: AI Drafting Assistant</Text>
          <Text style={styles.comingSoonText}>
            A CBA drafting assistant that can search across these documents and help you
            generate tailored language for your community.
          </Text>
          <TouchableOpacity style={styles.notifyButton}>
            <Text style={styles.notifyButtonText}>
              Notify me when the AI tool launches
            </Text>
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
    textAlign: 'center',
  },
  devMessage: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 24,
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 8,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  devTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  devText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  librarySection: {
    paddingHorizontal: 16,
    paddingVertical: 48,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 32,
    textAlign: 'center',
  },
  filters: {
    marginBottom: 32,
    gap: 24,
  },
  filterGroup: {
    gap: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  filterButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterButtonTextActive: {
    color: '#1E3A5F',
  },
  documentsGrid: {
    gap: 16,
  },
  docCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  docMeta: {
    flex: 1,
    gap: 4,
  },
  docMetaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  docTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 8,
    lineHeight: 28,
  },
  docLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  docParties: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  docSummary: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  comingSoon: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 16,
    paddingVertical: 48,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 16,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 600,
    marginBottom: 24,
  },
  notifyButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  notifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
  },
});
