import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre nom complet.');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre email.');
      return false;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez saisir un email valide.');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un mot de passe.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return false;
    }

    if (!acceptTerms) {
      Alert.alert('Erreur', 'Veuillez accepter les conditions d\'utilisation.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(fullName, email, password);
      Alert.alert(
        'Inscription réussie !',
        'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
        [
          { 
            text: 'Se connecter', 
            onPress: () => navigation.navigate('Login') 
          }
        ]
      );
    } catch (e) {
      Alert.alert(
        'Erreur d\'inscription',
        e.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderTermsModal = () => (
    <Modal
      visible={showTermsModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Conditions d'utilisation</Text>
            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <Text style={styles.termsText}>
              En créant un compte sur ShopPro, vous acceptez les conditions suivantes :
              {"\n\n"}
              1. Vous êtes responsable de la confidentialité de votre compte.
              {"\n\n"}
              2. Vous ne devez pas utiliser le service à des fins illégales.
              {"\n\n"}
              3. ShopPro se réserve le droit de suspendre tout compte violant les conditions.
              {"\n\n"}
              4. Vos données personnelles sont protégées conformément à notre politique de confidentialité.
              {"\n\n"}
              5. Vous pouvez supprimer votre compte à tout moment depuis les paramètres.
            </Text>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setShowTermsModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>J'ai compris</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Icon name="person-add" size={30} color="#FF6B6B" />
              </View>
              <Text style={styles.logoText}>Créer un compte</Text>
            </View>
            
            <View style={styles.headerRight} />
          </View>

          <Text style={styles.welcomeText}>
            Rejoignez la communauté ShopPro
          </Text>
          <Text style={styles.subtitle}>
            Créez votre compte pour commencer à shopper
          </Text>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            <AppInput 
              label="Nom complet"
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              leftIcon={<Icon name="person-outline" size={20} color="#999" />}
              autoCapitalize="words"
            />

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
              placeholder="Minimum 6 caractères"
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

            <AppInput 
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="Répétez votre mot de passe"
              leftIcon={<Icon name="lock-closed-outline" size={20} color="#999" />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              }
            />

            {/* Indicateur de force du mot de passe */}
            {password.length > 0 && (
              <View style={styles.passwordStrength}>
                <View style={[
                  styles.strengthBar, 
                  { 
                    flex: 1,
                    backgroundColor: password.length < 6 ? '#FF6B6B' : 
                                    password.length < 10 ? '#FFA62E' : '#4CAF50'
                  }
                ]} />
                <Text style={styles.strengthText}>
                  {password.length < 6 ? 'Faible' : 
                   password.length < 10 ? 'Moyen' : 'Fort'}
                </Text>
              </View>
            )}

            {/* Conditions */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkbox,
                acceptTerms && styles.checkboxChecked
              ]}>
                {acceptTerms && <Icon name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                J'accepte les{' '}
                <Text 
                  style={styles.termsLink}
                  onPress={() => setShowTermsModal(true)}
                >
                  conditions d'utilisation
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Bouton d'inscription */}
            <AppButton 
              title={loading ? "Création du compte..." : "Créer mon compte"}
              onPress={handleRegister}
              disabled={loading}
              loading={loading}
              style={styles.registerButton}
            />

            {/* Lien vers connexion */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Vous avez déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>

            {/* Séparateur */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>Ou s'inscrire avec</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Connexion sociale */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => Alert.alert('Inscription Google', 'Bientôt disponible')}
              >
                <Icon name="logo-google" size={22} color="#DB4437" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => Alert.alert('Inscription Facebook', 'Bientôt disponible')}
              >
                <Icon name="logo-facebook" size={22} color="#4267B2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Version */}
          <Text style={styles.versionText}>ShopPro v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderTermsModal()}
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    minWidth: 50,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  registerButton: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 15,
    color: '#666',
  },
  loginLink: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: '700',
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
  versionText: {
    fontSize: 12,
    color: '#CCC',
    textAlign: 'center',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalBody: {
    padding: 20,
  },
  modalCloseButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});