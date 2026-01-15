import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

export default function ContactScreen() {
  const [messages, setMessages] = useState([
    { id: "1", from: "bot", text: "👋 Bonjour ! Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");

  const botReply = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes("bonjour") || text.includes("salut")) {
      return "Bonjour 😊 Comment puis-je vous aider ?";
    }
    if (text.includes("commande")) {
      return "📦 Pour vos commandes, allez dans l’onglet *Mes commandes*.";
    }
    if (text.includes("livraison")) {
      return "🚚 La livraison prend entre 24h et 48h.";
    }
    if (text.includes("paiement")) {
      return "💳 Nous acceptons carte bancaire et paiement à la livraison.";
    }
    if (text.includes("admin")) {
      return "👑 Pour l’admin, veuillez contacter le support technique.";
    }
    if (text.includes("merci")) {
      return "🙏 Avec plaisir !";
    }
     if (text.includes("information")) {
      return "shopaddiction est un site e commerce ou tu peux acheter n'importe qu'est ce que tu veux avec un bon prix";
    }


    return "❓ Désolé, je n’ai pas compris. Essayez : commande, livraison, paiement.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      from: "user",
      text: input,
    };

    const botMsg = {
      id: (Date.now() + 1).toString(),
      from: "bot",
      text: botReply(input),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Contact / Assistance</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.from === "user" ? styles.userMsg : styles.botMsg,
            ]}
          >
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Écrivez votre message..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8F9FA" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 10 },

  message: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: "80%",
  },
  userMsg: {
    backgroundColor: "#FF6B6B",
    alignSelf: "flex-end",
  },
  botMsg: {
    backgroundColor: "#EAEAEA",
    alignSelf: "flex-start",
  },
  msgText: { color: "#000" },

  inputRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFF",
  },
  sendBtn: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    justifyContent: "center",
    marginLeft: 8,
    borderRadius: 10,
  },
  sendText: { color: "#FFF", fontWeight: "700" },
});
