import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { session, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <Text style={styles.label}>Email :</Text>
      <Text style={styles.value}>{session?.user?.email}</Text>

      <AppButton 
        title="Se déconnecter" 
        onPress={logout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600' },
  value: { marginBottom: 20, fontSize: 16 },
});
