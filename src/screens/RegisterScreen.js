import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register(fullName, email, password);
      Alert.alert('Succès', 'Compte créé ! Vérifiez votre email.');
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <AppInput label="Nom complet" value={fullName} onChangeText={setFullName} />

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

      <AppButton title="Créer un compte" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 20 }
});
