import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../styles/colors";
export default function ExpiredRouteBanner({ expiredCount, onDeleteAll }) {
  if (expiredCount === 0) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>
        {expiredCount} gespeicherte Route(n) sind abgelaufen.
      </Text>

      <Text style={styles.text}>Diese Routen können gelöscht werden.</Text>

      <TouchableOpacity style={styles.button} onPress={onDeleteAll}>
        <Text style={styles.buttonText}>Alle abgelaufenen löschen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#fde2e2",
    borderColor: "#f5a3a3",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  text: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#b91c1c",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
