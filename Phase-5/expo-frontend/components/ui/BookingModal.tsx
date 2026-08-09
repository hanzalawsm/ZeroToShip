import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, useColorScheme } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { Badge } from './Badge';
import { Provider } from '../../types';

interface BookingModalProps {
  visible: boolean;
  provider: Provider | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  provider,
  onClose,
}) => {
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? ColorPalette.dark : ColorPalette.light;

  if (!provider) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: t.surface }]}>
          <Text style={[styles.title, { color: t.textPrimary }]}>Booking preview</Text>
          <Text style={[styles.subtitle, { color: t.textSecondary }]}>
            This is a static preview. Network integration is scheduled for Phase 5.
          </Text>

          <View style={styles.providerSection}>
            <Text style={[styles.providerName, { color: t.textPrimary }]}>{provider.name}</Text>
            
            <View style={styles.badges}>
              <Badge label={provider.category} variant="primary" />
              <View style={styles.badgeSpacing} />
              <Badge label={provider.neighborhood_zone} variant="default" />
            </View>

            <View style={styles.stats}>
              <Text style={[styles.statText, { color: t.textSecondary }]}>
                ⭐ {provider.rating}
              </Text>
              <Text style={[styles.statText, { color: t.textSecondary }]}>
                • {provider.hourly_rate}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 24,
    lineHeight: 18,
  },
  providerSection: {
    marginBottom: 24,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badgeSpacing: {
    width: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: ColorPalette.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
