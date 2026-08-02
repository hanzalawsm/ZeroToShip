import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { ColorPalette } from '../theme/colors';
import { useResponsive } from '../hooks/useResponsive';
import { MOCK_PROVIDERS } from '../mock/mockData';
import { ProviderCard } from './ui/ProviderCard';
import { AIReasoningCard } from './ui/AIReasoningCard';
import { BookingModal } from './ui/BookingModal';
import { Provider } from '../types';

const CATEGORIES = ['All', 'plumber', 'electrician', 'carpenter', 'painter', 'cleaner'];
const ZONES = ['All', 'Gulshan', 'Johar', 'Clifton', 'DHA', 'Nazimabad', 'PECHS', 'Malir'];

export function RecommendationsWorkspace() {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;
  const { listWidth, gridColumns, isWide, isDesktop } = useResponsive();

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeZone, setActiveZone] = useState('All');
  const [activeSort, setActiveSort] = useState<'rating' | 'completion'>('rating');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  const filtered = MOCK_PROVIDERS
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => activeZone === 'All' || p.neighborhood_zone === activeZone)
    .sort((a, b) => activeSort === 'rating' ? b.rating - a.rating : b.completion_rate - a.completion_rate);

  const topProvider = filtered[0] || MOCK_PROVIDERS[0];

  const handleConfirmBooking = (provider: Provider) => {
    setSelectedProvider(provider);
    setBookingModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <ScrollView contentContainerStyle={[styles.scrollInner, isWide && { maxWidth: listWidth, alignSelf: 'center', width: '100%' }, isDesktop && { paddingTop: 40 }]}>
        {/* Header (Hide title on desktop since sidebar has it, just show results count) */}
        <View style={styles.header}>
          {!isDesktop && <Text style={[styles.title, { color: t.textPrimary }]}>Providers</Text>}
          <Text style={[styles.subtitle, { color: t.textSecondary }]}>
            {filtered.length} results for {activeCategory === 'All' ? 'all services' : activeCategory} in {activeZone === 'All' ? 'all zones' : activeZone}
          </Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersBlock}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, active ? { backgroundColor: ColorPalette.primary, borderColor: ColorPalette.primary } : { backgroundColor: t.surfaceRaised, borderColor: t.border }]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.chipLabel, { color: active ? '#FFF' : t.textPrimary }]}>{cat === 'All' ? 'All categories' : cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {ZONES.map(zone => {
              const active = activeZone === zone;
              return (
                <TouchableOpacity
                  key={zone}
                  style={[styles.chip, active ? { backgroundColor: ColorPalette.green, borderColor: ColorPalette.green } : { backgroundColor: t.surfaceRaised, borderColor: t.border }]}
                  onPress={() => setActiveZone(zone)}
                >
                  <Text style={[styles.chipLabel, { color: active ? '#FFF' : t.textPrimary }]}>{zone === 'All' ? 'All zones' : zone}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Sort */}
        <View style={[styles.sortRow, { borderBottomColor: t.border }]}>
          {(['rating', 'completion'] as const).map(key => (
            <TouchableOpacity key={key} onPress={() => setActiveSort(key)} style={styles.sortBtn}>
              <Text style={[styles.sortLabel, { color: activeSort === key ? ColorPalette.primary : t.textMuted, fontWeight: activeSort === key ? '600' : '400' }]}>
                {key === 'rating' ? 'Rating' : 'Success rate'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI reasoning */}
        {(activeCategory !== 'All' || activeZone !== 'All') && (
          <View style={styles.reasoningBlock}>
            <AIReasoningCard reasoningText={`Top result is '${topProvider.name}' — ${topProvider.rating} ★ rating, ${topProvider.completion_rate}% completion in ${topProvider.neighborhood_zone}.`} />
          </View>
        )}

        {/* Cards grid */}
        <View style={gridColumns === 2 ? styles.grid : undefined}>
          {filtered.map((provider, idx) => (
            <View key={provider.provider_id} style={gridColumns === 2 ? styles.gridCell : undefined}>
              <ProviderCard
                provider={provider}
                onConfirmBooking={handleConfirmBooking}
                isTopMatch={idx === 0}
                reasoningSnippet={idx === 0 ? `Highest-rated ${provider.category} in ${provider.neighborhood_zone}.` : undefined}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <BookingModal
        visible={bookingModalVisible}
        provider={selectedProvider}
        onClose={() => setBookingModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollInner: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 2 },
  subtitle: { fontSize: 13 },
  filtersBlock: { gap: 8, marginBottom: 12 },
  chipRow: { gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
  chipLabel: { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  sortRow: { flexDirection: 'row', gap: 20, paddingBottom: 12, borderBottomWidth: 1, marginBottom: 16 },
  sortBtn: {},
  sortLabel: { fontSize: 13 },
  reasoningBlock: { marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridCell: { width: '48%' },
});
