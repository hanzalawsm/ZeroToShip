import React from 'react';
import { View, Text, StyleSheet, Image, useColorScheme } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { Provider } from '../../types';
import { IconSymbol } from './IconSymbol';
import { AIReasoningCard } from './AIReasoningCard';
import { ConfirmBookingBtn } from './ConfirmBookingBtn';

interface ProviderCardProps {
  provider: Provider;
  onConfirmBooking: (p: Provider) => void;
  reasoningSnippet?: string;
  isTopMatch?: boolean;
}

export function ProviderCard({ provider, onConfirmBooking, reasoningSnippet, isTopMatch }: ProviderCardProps) {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.recommendedLabel, { color: ColorPalette.primary, opacity: isTopMatch ? 1 : 0 }]}>
        Recommended
      </Text>
      <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
        {/* ROW 1 */}
        <View style={styles.row1}>
          <Image source={{ uri: provider.avatar_url }} style={styles.avatar} />
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: t.textPrimary }]}>{provider.name}</Text>
              {provider.verified && (
                <IconSymbol name="checkmark-circle" size={16} color={ColorPalette.green} style={styles.verifiedIcon} />
              )}
            </View>
            <View style={styles.ratingRow}>
              <Text style={[styles.ratingText, { color: ColorPalette.amber }]}>★ {provider.rating}</Text>
              <Text style={[styles.reviewsText, { color: t.textMuted }]}> ({provider.review_count} reviews)</Text>
            </View>
          </View>
        </View>

        {/* TRUST BADGES */}
        <View style={styles.trustBadgesRow}>
          {provider.verified && (
            <View style={[styles.trustBadge, { backgroundColor: isDark ? 'rgba(21, 128, 61, 0.2)' : ColorPalette.greenLight }]}>
              <Text style={[styles.trustBadgeText, { color: isDark ? '#4ADE80' : ColorPalette.green }]}>🛡️ Verified Pro</Text>
            </View>
          )}
          <View style={[styles.trustBadge, { backgroundColor: t.surfaceRaised }]}>
            <Text style={[styles.trustBadgeText, { color: t.textSecondary }]}>💼 100+ Jobs Completed</Text>
          </View>
        </View>

        {/* ROW 2 */}
        <View style={styles.row2}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: t.textPrimary }]}>{provider.hourly_rate}</Text>
            <Text style={[styles.statLabel, { color: t.textMuted }]}>Rate</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: t.textPrimary }]}>{provider.response_time}</Text>
            <Text style={[styles.statLabel, { color: t.textMuted }]}>Response</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: t.textPrimary }]}>{provider.completion_rate}%</Text>
            <Text style={[styles.statLabel, { color: t.textMuted }]}>Completion</Text>
          </View>
        </View>

        {/* ROW 3 */}
        <View style={styles.row3}>
          {reasoningSnippet ? (
            <View style={styles.reasoningContainer}>
              <AIReasoningCard reasoningText={reasoningSnippet} />
            </View>
          ) : <View style={{flex: 1}} />}
          <ConfirmBookingBtn onPress={() => onConfirmBooking(provider)} label="Book Now" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    flex: 1, // Ensures wrapper stretches in grid
  },
  recommendedLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    flex: 1, // Ensures card stretches in wrapper
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedIcon: {
    marginLeft: 4,
    marginTop: 2, // Visual alignment tweak for text baseline
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 13,
  },
  trustBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  trustBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E7E5E4',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E7E5E4',
  },
  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto', // Pushes row3 to the bottom
  },
  reasoningContainer: {
    flex: 1,
    marginRight: 12,
  },
});
