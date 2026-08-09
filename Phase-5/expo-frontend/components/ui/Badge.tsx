import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { ColorPalette } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'amber' | 'green';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;

  let bgColor = 'transparent';
  let borderColor = 'transparent';
  let textColor = t.textPrimary;

  switch (variant) {
    case 'primary':
      bgColor = ColorPalette.primaryMuted;
      textColor = ColorPalette.primary;
      break;
    case 'amber':
      bgColor = ColorPalette.amberLight;
      textColor = ColorPalette.amber;
      break;
    case 'green':
      bgColor = ColorPalette.greenLight;
      textColor = ColorPalette.green;
      break;
    case 'default':
    default:
      borderColor = t.borderStrong;
      textColor = t.textSecondary;
      break;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: variant === 'default' ? 1 : 0,
        },
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
