import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function IndexScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Header avec logo et message d'accueil */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="cart" size={32} color="#fff" />
            </View>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoBrand}>ShopAddiction</Text>
              <Text style={styles.logoSlogan}>Premium Tech Store</Text>
            </View>
          </View>
          <View style={styles.welcomeBadge}>
            <MaterialIcons name="stars" size={16} color="#FFD700" />
            <Text style={styles.welcomeText}>Bienvenue !</Text>
          </View>
        </View>

        {/* Hero Section avec offre spéciale */}
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.heroContent}>
            <View>
              <Text style={styles.heroTitle}>🎁 Offre de lancement</Text>
              <Text style={styles.heroSubtitle}>-15% sur toute la boutique</Text>
              <Text style={styles.heroCode}>CODE: WELCOME15</Text>
            </View>
            <View style={styles.discountCircle}>
              <Text style={styles.discountText}>-15%</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <Text style={styles.sectionTitle}>Pourquoi nous choisir ?</Text>
          <View style={styles.gridContainer}>
            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.featureTitle}>Paiement sécurisé</Text>
              <Text style={styles.featureDesc}>100% protégé</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="rocket" size={24} color="#2196F3" />
              </View>
              <Text style={styles.featureTitle}>Livraison rapide</Text>
              <Text style={styles.featureDesc}>24-48h</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
                <Ionicons name="refresh-circle" size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.featureTitle}>Retour facile</Text>
              <Text style={styles.featureDesc}>30 jours</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                <Ionicons name="headset" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.featureTitle}>Support 24/7</Text>
              <Text style={styles.featureDesc}>Assistance</Text>
            </View>
          </View>
        </View>

        {/* Catégories populaires */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Catégories populaires</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {['📱 Smartphones', '💻 Ordinateurs', '🎮 Gaming', '🎧 Audio', '⌚ Smartwatch', '📸 Photo'].map((cat, index) => (
              <View key={index} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Produits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Évaluation</Text>
          </View>
        </View>

        {/* Call to Action Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Rejoignez notre communauté</Text>
          <Text style={styles.ctaSubtitle}>
            Accédez à des offres exclusives, suivez vos commandes 
            et découvrez les nouveautés en premier
          </Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="person-add" size={22} color="#fff" />
              <Text style={styles.primaryButtonText}>Créer un compte gratuit</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <View style={styles.secondaryButtonContent}>
              <Ionicons name="log-in" size={22} color="#FF6B6B" />
              <Text style={styles.secondaryButtonText}>Se connecter</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton}>
            <Text style={styles.guestButtonText}>
              Continuer sans compte
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            En continuant, vous acceptez nos
            <Text style={styles.footerLink}> Conditions d'utilisation </Text>
            et notre
            <Text style={styles.footerLink}> Politique de confidentialité</Text>
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoTextContainer: {
    justifyContent: 'center',
  },
  logoBrand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  logoSlogan: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginTop: 2,
  },
  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  welcomeText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  heroCard: {
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  heroCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  discountCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  discountText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  featuresGrid: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  categoriesSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  categoriesScroll: {
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 16,
    marginBottom: 16,
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  guestButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '500',
    marginRight: 6,
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});