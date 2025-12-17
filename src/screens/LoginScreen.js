import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre email.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre mot de passe.');
      return;
    }

    // Regex email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez saisir un email valide.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert(
        'Échec de connexion',
        e.message || 'Email ou mot de passe incorrect.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Mot de passe oublié',
      'Un lien de réinitialisation sera envoyé à votre email.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Envoyer', 
          onPress: () => {
            // Ici, vous intégreriez la logique de réinitialisation
            Alert.alert('Succès', 'Email de réinitialisation envoyé !');
          }
        }
      ]
    );
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(
      'Connexion avec ' + provider,
      'Cette fonctionnalité sera disponible prochainement.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo et bienvenue */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Icon name="cart" size={40} color="#FF6B6B" />
              </View>
              <Text style={styles.logoText}>Shop<Text style={styles.logoHighlight}>Addiction</Text></Text>
            </View>
            <Text style={styles.welcomeText}>Bienvenue !</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            <AppInput 
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="exemple@email.com"
              leftIcon={<Icon name="mail-outline" size={20} color="#999" />}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <AppInput 
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Votre mot de passe"
              leftIcon={<Icon name="lock-closed-outline" size={20} color="#999" />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              }
            />

            {/* Mot de passe oublié */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            {/* Bouton connexion */}
            <AppButton 
              title={loading ? "Connexion en cours..." : "Se connecter"}
              onPress={handleLogin}
              disabled={loading}
              loading={loading}
              style={styles.loginButton}
            />

            {/* Séparateur */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>Ou continuer avec</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Connexion sociale */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('Google')}
              >
                <Icon name="logo-google" size={22} color="#DB4437" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <Icon name="logo-facebook" size={22} color="#4267B2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Lien d'inscription */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Pas encore de compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>S'inscrire</Text>
              </TouchableOpacity>
            </View>

            {/* Conditions */}
            <Text style={styles.termsText}>
              En vous connectant, vous acceptez nos{' '}
              <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{' '}
              <Text style={styles.termsLink}>Politique de confidentialité</Text>.
            </Text>
          </View>

          {/* Version */}
          <Text style={styles.versionText}>ShopAddiction v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  logoHighlight: {
    color: '#FF6B6B',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  facebookButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 15,
    color: '#666',
  },
  registerLink: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    color: '#CCC',
    textAlign: 'center',
    marginTop: 10,
  },
});