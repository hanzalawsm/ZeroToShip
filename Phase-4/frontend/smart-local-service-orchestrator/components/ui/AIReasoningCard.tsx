import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { IconSymbol } from './IconSymbol';

interface AIReasoningCardProps {
  reasoningText: string;
}

export const AIReasoningCard: React.FC<AIReasoningCardProps> = ({ reasoningText }) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(13, 148, 136, 0.15)' : ColorPalette.primaryMuted }]}>
      <IconSymbol name="sparkles" size={14} color={ColorPalette.primary} />
      <Text style={[styles.text, { color: isDark ? '#5EEAD4' : ColorPalette.primary }]} numberOfLines={2}>
        {reasoningText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    flexShrink: 1,
  },
});
