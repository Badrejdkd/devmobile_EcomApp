import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../../context/PanierContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase/client';

export default function CartScreen({ navigation }) {
  const { items, total, removeFromCart, clearCart, updateQuantity } = useCart();
  const { session } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [newQuantity, setNewQuantity] = useState('1');

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateSavings = () => {
    // Simuler des économies
    return items.length > 0 ? 45.50 : 0;
  };

  const calculateTotalWithPromo = () => {
    const subtotal = calculateSubtotal();
    let discount = 0;
    
    // Appliquer une réduction si code promo valide
    if (promoCode === 'shop123') {
      discount = subtotal * 0.10; // 10% de réduction
    } else if (promoCode === 'shop123') {
      discount = subtotal * 0.20; // 20% de réduction
    }
    
    return {
      subtotal,
      discount,
      delivery: items.length > 0 ? 19.99 : 0,
      total: Math.max(0, subtotal - discount + (items.length > 0 ? 19.99 : 0))
    };
  };

  const totals = calculateTotalWithPromo();

  const handleApplyPromo = () => {
    setIsApplyingPromo(true);
    setTimeout(() => {
      if (promoCode === 'shop123' || promoCode === 'shop123') {
        Alert.alert('Succès', 'Code promo appliqué avec succès !');
      } else if (promoCode) {
        Alert.alert('Erreur', 'Code promo invalide');
      }
      setIsApplyingPromo(false);
    }, 500);
  };

  const handleRemoveItem = (productId) => {
    Alert.alert(
      'Supprimer l\'article',
      'Êtes-vous sûr de vouloir supprimer cet article du panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => removeFromCart(productId) }
      ]
    );
  };

  const openQuantityModal = (item) => {
    setSelectedItem(item);
    setNewQuantity(String(item.quantity));
    setQuantityModalVisible(true);
  };

  const handleUpdateQuantity = () => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0 && quantity <= 99) {
      updateQuantity(selectedItem.product.id, quantity);
      setQuantityModalVisible(false);
    } else {
      Alert.alert('Erreur', 'La quantité doit être entre 1 et 99');
    }
  };

  const handleOrder = async () => {
    try {
      if (!session) {
        Alert.alert(
          'Connexion requise',
          'Vous devez être connecté pour passer commande.',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }

      if (items.length === 0) {
        Alert.alert('Panier vide', 'Votre panier est vide. Ajoutez des articles avant de commander.');
        return;
      }

      // Confirmation avant commande
      Alert.alert(
        'Confirmer la commande',
        `Total: ${totals.total.toFixed(2)} DH\n\nVoulez-vous confirmer votre commande ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Confirmer', 
            style: 'destructive',
            onPress: async () => {
              try {
                // 1️⃣ Créer la commande
                const { data: order, error: orderError } = await supabase
                  .from("orders")
                  .insert([
                    {
                      user_id: session.user.id,
                      total_amount: totals.total,
                      status: "pending",
                      subtotal: totals.subtotal,
                      discount: totals.discount,
                      delivery_fee: totals.delivery
                    }
                  ])
                  .select()
                  .single();

                if (orderError) throw orderError;

                // 2️⃣ Pour chaque produit → créer un enregistrement dans order_items
                for (const item of items) {
                  const { error: itemError } = await supabase
                    .from("order_items")
                    .insert([
                      {
                        order_id: order.id,
                        product_id: item.product.id,
                        quantity: item.quantity,
                        unit_price: item.product.price
                      }
                    ]);

                  if (itemError) throw itemError;
                }

                // 3️⃣ Vider le panier
                clearCart();

               Alert.alert(
  "Commande validée !", 
  `Votre commande #${String(order?.id ?? "???").slice(0, 8)} a été confirmée.\n\nVous recevrez une confirmation par email.`,
  [
    { 
      text: 'Voir mes commandes', 
      onPress: () => navigation.navigate('Orders') 
    },
    { text: 'Continuer les achats' }
  ]
);

              } catch (e) {
                console.log("ORDER ERROR:", e);
                Alert.alert("Erreur", "Une erreur est survenue lors de la commande. Veuillez réessayer.");
              }
            }
          }
        ]
      );
    } catch (e) {
      console.log("ORDER ERROR:", e);
      Alert.alert("Erreur", e.message);
    }
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="cart-outline" size={80} color="#DDDDDD" />
      </View>
      <Text style={styles.emptyTitle}>Votre panier est vide</Text>
      <Text style={styles.emptySubtitle}>
        Explorez nos produits et ajoutez vos articles préférés
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.emptyButtonText}>Découvrir les produits</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        {item.product.image_url ? (
          <Image 
            source={{ uri: item.product.image_url }} 
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image-outline" size={24} color="#CCCCCC" />
          </View>
        )}
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.itemPrice}>{item.product.price} DH</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => openQuantityModal(item)}
          >
            <Text style={styles.quantityText}>Qté: {item.quantity}</Text>
            <Icon name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.product.id)}
          >
            <Icon name="trash-outline" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalText}>
          {(item.product.price * item.quantity).toFixed(2)} DH
        </Text>
      </View>
    </View>
  );

  const renderCartSummary = () => (
    <View style={styles.summaryContainer}>
      {/* Code promo */}
      <View style={styles.promoContainer}>
        <TextInput
          style={styles.promoInput}
          placeholder="Code promo"
          value={promoCode}
          onChangeText={setPromoCode}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={[
            styles.promoButton,
            isApplyingPromo && styles.promoButtonDisabled
          ]}
          onPress={handleApplyPromo}
          disabled={isApplyingPromo}
        >
          <Text style={styles.promoButtonText}>
            {isApplyingPromo ? '...' : 'Appliquer'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Résumé des prix */}
      <View style={styles.pricesContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Sous-total</Text>
          <Text style={styles.priceValue}>{totals.subtotal.toFixed(2)} DH</Text>
        </View>
        
        {totals.discount > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Réduction</Text>
            <Text style={[styles.priceValue, styles.discountText]}>
              -{totals.discount.toFixed(2)} DH
            </Text>
          </View>
        )}
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Livraison</Text>
          <Text style={styles.priceValue}>
            {items.length > 0 ? `${totals.delivery.toFixed(2)} DH` : 'Gratuite'}
          </Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{totals.total.toFixed(2)} DH</Text>
        </View>
      </View>

      {/* Bouton commander */}
      <TouchableOpacity 
        style={[
          styles.checkoutButton,
          items.length === 0 && styles.checkoutButtonDisabled
        ]}
        onPress={handleOrder}
        disabled={items.length === 0}
      >
        <Text style={styles.checkoutButtonText}>
          {session ? 'Commander' : 'Se connecter pour commander'}
        </Text>
        <View style={styles.checkoutPriceContainer}>
          <Text style={styles.checkoutPriceText}>{totals.total.toFixed(2)} DH</Text>
        </View>
      </TouchableOpacity>

      {/* Options de paiement */}
      <View style={styles.paymentOptions}>
        <Text style={styles.paymentTitle}>Moyens de paiement sécurisés</Text>
        <View style={styles.paymentIcons}>
          <Icon name="card-outline" size={24} color="#666" style={styles.paymentIcon} />
          <Icon name="phone-portrait-outline" size={24} color="#666" style={styles.paymentIcon} />
          <Icon name="wallet-outline" size={24} color="#666" style={styles.paymentIcon} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => {
            if (items.length > 0) {
              Alert.alert(
                'Vider le panier',
                'Êtes-vous sûr de vouloir vider tout le panier ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Vider', style: 'destructive', onPress: clearCart }
                ]
              );
            }
          }}
          disabled={items.length === 0}
        >
          <Icon name="trash-outline" size={22} color={items.length === 0 ? "#CCC" : "#FF6B6B"} />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <View style={styles.itemCountContainer}>
            <Text style={styles.itemCountText}>
              {items.length} {items.length > 1 ? 'articles' : 'article'}
            </Text>
          </View>
          
          <ScrollView style={styles.scrollContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.product.id)}
              renderItem={renderCartItem}
              scrollEnabled={false}
              contentContainerStyle={styles.itemsList}
            />
            
            {renderCartSummary()}
          </ScrollView>
        </>
      )}

      {/* Modal pour modifier la quantité */}
      <Modal
        visible={quantityModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier la quantité</Text>
            <Text style={styles.modalSubtitle}>
              {selectedItem?.product.name}
            </Text>
            
            <View style={styles.quantityInputContainer}>
              <TextInput
                style={styles.quantityInput}
                value={newQuantity}
                onChangeText={setNewQuantity}
                keyboardType="numeric"
                maxLength={2}
                selectTextOnFocus
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setQuantityModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleUpdateQuantity}
              >
                <Text style={styles.confirmButtonText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  clearButton: {
    padding: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  itemCountContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  itemsList: {
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quantityText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  removeButton: {
    padding: 6,
  },
  itemTotal: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  promoContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  promoButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  promoButtonDisabled: {
    backgroundColor: '#FFB8B8',
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pricesContainer: {
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: '#666',
  },
  priceValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  discountText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#FFB8B8',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  checkoutPriceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  checkoutPriceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentOptions: {
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  paymentIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paymentIcon: {
    marginHorizontal: 12,
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
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  quantityInputContainer: {
    marginBottom: 24,
  },
  quantityInput: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    width: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});