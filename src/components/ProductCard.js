import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';

export default function ProductCard({ product, onPress, style }) {
  // Animation pour l'effet de like
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [liked, setLiked] = React.useState(false);

  const handleLikePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setLiked(!liked);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Badge de promotion */}
      {product.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </View>
      )}
      
      {/* Badge "Nouveau" */}
      {product.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>Nouveau</Text>
        </View>
      )}
      
      {/* Image du produit */}
      <View style={styles.imageContainer}>
        {product.image_url ? (
          <Image 
            source={{ uri: product.image_url }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="image-outline" size={40} color="#CCCCCC" />
          </View>
        )}
        
        {/* Bouton like */}
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={handleLikePress}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Icon 
              name={liked ? "heart" : "heart-outline"} 
              size={20} 
              color={liked ? "#FF6B6B" : "#FFFFFF"} 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Informations du produit */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        {/* Évaluation étoiles */}
        {product.rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount || 0})</Text>
          </View>
        )}
        
        {/* Prix */}
        <View style={styles.priceContainer}>
          {product.discount ? (
            <>
              <Text style={styles.discountedPrice}>
                {((product.price * (100 - product.discount)) / 100).toFixed(2)} DH
              </Text>
              <Text style={styles.originalPrice}>
                {product.price.toFixed(2)} DH
              </Text>
            </>
          ) : (
            <Text style={styles.price}>{product.price.toFixed(2)} DH</Text>
          )}
        </View>
        
        {/* Livraison gratuite */}
        {product.freeShipping && (
          <View style={styles.shippingBadge}>
            <Icon name="rocket-outline" size={12} color="#4ECDC4" />
            <Text style={styles.shippingText}>Livraison gratuite</Text>
          </View>
        )}
        
        {/* Stock limité */}
        {product.stock && product.stock < 10 && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>
              Plus que {product.stock} disponibles
            </Text>
          </View>
        )}
      </View>
      
      {/* Bouton d'ajout rapide au panier */}
      <TouchableOpacity 
        style={styles.addToCartButton}
        activeOpacity={0.7}
        onPress={(e) => {
          e.stopPropagation();
          // Ajouter au panier
        }}
      >
        <Icon name="add-outline" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card || '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: colors.background || '#F8F9FA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text || '#1A1A1A',
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 12,
    color: '#999',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary || '#FF6B6B',
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary || '#FF6B6B',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  shippingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  shippingText: {
    fontSize: 11,
    color: '#4ECDC4',
    fontWeight: '500',
    marginLeft: 4,
  },
  stockBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  stockText: {
    fontSize: 11,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary || '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.primary || '#FF6B6B',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});