import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, useColorScheme, Platform } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useResponsive } from '../../hooks/useResponsive';
import { Sidebar } from '../../components/ui/Sidebar';

export default function TabLayout() {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;
  const { isDesktop } = useResponsive(); // Use isDesktop (>=1080px) for sidebar

  if (isDesktop) {
    // Desktop layout: Sidebar on the left, standard flex container on the right
    // We still use Tabs so the routing works, but we hide the tabBar entirely
    return (
      <View style={[styles.desktopContainer, { backgroundColor: t.bg }]}>
        <Sidebar />
        <View style={styles.desktopContent}>
          <Tabs
            screenOptions={{
              headerShown: false, // No header on desktop, sidebar is enough
              tabBarStyle: { display: 'none' }, // Hide bottom bar
            }}
          >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="recommendations" />
            <Tabs.Screen name="inspector" />
          </Tabs>
        </View>
      </View>
    );
  }

  // Mobile/Tablet layout: Standard bottom Tabs
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: t.bg,
        },
        headerTitleStyle: {
          color: t.textPrimary,
        },
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopColor: t.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 92 : 78,
          paddingBottom: Platform.OS === 'ios' ? 36 : 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarActiveTintColor: ColorPalette.primary,
        tabBarInactiveTintColor: t.textMuted,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'AI Assistant',
          tabBarLabel: 'Assistant',
          tabBarIcon: ({ color }) => <IconSymbol name="sparkles" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Browse Pros',
          tabBarLabel: 'Pros',
          tabBarIcon: ({ color }) => <IconSymbol name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color }) => <IconSymbol name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inspector"
        options={{
          title: 'How It Works',
          tabBarLabel: 'About',
          tabBarIcon: ({ color }) => <IconSymbol name="code-slash" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopContent: {
    flex: 1,
    // The screen (like ChatPromptInterface) will handle its own max-widths
  }
});
