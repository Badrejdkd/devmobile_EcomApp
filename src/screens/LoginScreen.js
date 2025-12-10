import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <AppInput 
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <AppInput 
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <AppButton title="Se connecter" onPress={handleLogin} />

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Pas de compte ? Créer un compte
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  link: { textAlign: 'center', marginTop: 15, color: '#1e88e5' }
});
