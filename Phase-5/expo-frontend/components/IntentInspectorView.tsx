import React from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme, Platform } from 'react-native';
import { ColorPalette } from '../theme/colors';
import { useResponsive } from '../hooks/useResponsive';
import { Badge } from './ui/Badge';
import { IconSymbol } from './ui/IconSymbol';

// Mock data removed to hide backend details

export function IntentInspectorView() {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;
  const { articleWidth, isWide, isDesktop } = useResponsive();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={[styles.inner, isWide && { maxWidth: articleWidth, alignSelf: 'center', width: '100%' }, isDesktop && { paddingTop: 40 }]}
    >
      <Text style={[styles.title, { color: t.textPrimary }]}>How it works</Text>
      <Text style={[styles.body, { color: t.textSecondary }]}>
        A natural-language prompt is parsed into a structured intent, then matched against the provider database ranked by rating and zone.
      </Text>

      <View style={isDesktop ? styles.desktopRow : undefined}>
        <View style={isDesktop ? styles.desktopCol : undefined}>
          {/* Visual Stepper */}
          <View style={styles.stepperContainer}>
            {[
              { step: 1, text: 'Describe your task in natural language' },
              { step: 2, text: 'AI matches you with top-rated local pros' },
              { step: 3, text: 'Book & schedule your service instantly' }
            ].map((item) => (
              <View key={item.step} style={styles.stepItem}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>{item.step}</Text>
                </View>
                <Text style={[styles.stepText, { color: t.textPrimary }]}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {isDesktop && (
          <View style={[styles.desktopCol, styles.previewCard, { backgroundColor: t.surfaceRaised, borderColor: t.border }]}>
            <IconSymbol name="flash" size={40} color={ColorPalette.primary} />
            <Text style={[styles.previewTitle, { color: t.textPrimary }]}>Real-time Orchestration</Text>
            <Text style={[styles.previewBody, { color: t.textSecondary }]}>
              The orchestrator handles NLP intent parsing, query matching, and real-time scheduling in milliseconds.
            </Text>
          </View>
        )}
      </View>

      {/* Categories */}
      <Text style={[styles.sectionLabel, { color: t.textPrimary }]}>Supported categories</Text>
      <View style={styles.tagRow}>
        {['plumber', 'electrician', 'carpenter', 'painter', 'cleaner'].map(c => (
          <Badge key={c} label={c} variant="green" />
        ))}
      </View>

      {/* Zones */}
      <Text style={[styles.sectionLabel, { color: t.textPrimary, marginTop: 16 }]}>Neighborhood zones</Text>
      <View style={styles.tagRow}>
        {['Gulshan', 'Johar', 'Clifton', 'DHA', 'Nazimabad', 'PECHS', 'Malir'].map(z => (
          <Badge key={z} label={z} variant="green" />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 21, marginBottom: 24 },
  stepperContainer: { marginBottom: 32, gap: 16 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: ColorPalette.primary, justifyContent: 'center', alignItems: 'center' },
  stepNumber: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  stepText: { fontSize: 15, fontWeight: '500', flexShrink: 1 },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  desktopRow: { flexDirection: 'row', gap: 40, alignItems: 'center', marginBottom: 32 },
  desktopCol: { flex: 1 },
  previewCard: { padding: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  previewTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  previewBody: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
});
