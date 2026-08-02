import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ColorPalette } from '../../theme/colors';
import { IconSymbol, IconSymbolName } from './IconSymbol';

interface NavItem {
  name: string;
  path: string;
  icon: IconSymbolName;
}

const topNavItems: NavItem[] = [
  { name: 'AI Assistant', path: '/', icon: 'sparkles' as any },
  { name: 'Browse Pros', path: '/recommendations', icon: 'people' },
  { name: 'How It Works', path: '/inspector', icon: 'code-slash' },
];

const bottomNavItems: NavItem[] = [
  { name: 'Bookings', path: '/bookings', icon: 'calendar' as any },
  { name: 'Profile', path: '/profile', icon: 'person' as any },
];

export function Sidebar() {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[styles.container, { backgroundColor: t.bg, borderRightColor: t.border }]}>
      <View style={styles.header}>
        <Text style={[styles.logoText, { color: t.textPrimary }]}>LocalService</Text>
      </View>
      
      <View style={styles.navSection}>
        {topNavItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/' && pathname === '/index');
          return (
            <TouchableOpacity
              key={item.path}
              style={[
                styles.navItem,
                isActive && { backgroundColor: t.surfaceRaised }
              ]}
              onPress={() => router.navigate(item.path as any)}
            >
              <IconSymbol 
                name={item.icon} 
                size={20} 
                color={isActive ? ColorPalette.primary : t.textSecondary} 
              />
              <Text 
                style={[
                  styles.navLabel,
                  { color: isActive ? ColorPalette.primary : t.textSecondary, fontWeight: isActive ? '600' : '500' }
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.navSection}>
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <TouchableOpacity
              key={item.path}
              style={[
                styles.navItem,
                isActive && { backgroundColor: t.surfaceRaised }
              ]}
              onPress={() => router.navigate(item.path as any)}
            >
              <IconSymbol 
                name={item.icon} 
                size={20} 
                color={isActive ? ColorPalette.primary : t.textSecondary} 
              />
              <Text 
                style={[
                  styles.navLabel,
                  { color: isActive ? ColorPalette.primary : t.textSecondary, fontWeight: isActive ? '600' : '500' }
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: '100%',
    borderRightWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  header: {
    paddingHorizontal: 12,
    marginBottom: 24,
    marginTop: Platform.OS === 'web' ? 8 : 40, // Avoid safe area on native if forced to render
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  navSection: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 12,
  },
  navLabel: {
    fontSize: 14,
  },
});
