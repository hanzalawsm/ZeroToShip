import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';

interface ConfirmBookingBtnProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}

export const ConfirmBookingBtn: React.FC<ConfirmBookingBtnProps> = ({
  onPress,
  disabled = false,
  label = 'Book',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorPalette.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
