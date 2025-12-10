import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function AppButton({ title, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
