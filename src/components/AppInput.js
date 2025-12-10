import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function AppInput({ label, ...props }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textLight}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.white,
  },
});
