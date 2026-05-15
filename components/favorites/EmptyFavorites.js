import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../../styles/colors";
export default function EmptyFavorites() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>♡</Text>
      <Text style={styles.title}>Keine Favoriten</Text>
      <Text style={styles.text}>
        Gespeicherte Routen werden später hier angezeigt.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  icon: {
    fontSize: 42,
    color: COLORS.primary,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 21,
  },
});
