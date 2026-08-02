import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { ColorPalette } from '../../theme/colors';

export default function BookingsScreen() {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.textPrimary }]}>Bookings (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  }
});
