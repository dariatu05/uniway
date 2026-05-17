import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/colors";
export default function ProfileHeader({ name, defaultLocation }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name?.charAt(0)?.toUpperCase() || "U"}
        </Text>
      </View>

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.location}>
        Default Location: {defaultLocation || "Not set"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: 22,
    borderRadius: 24,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: "900",
  },
  name: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  location: {
    color: "#64748b",
    fontSize: 15,
  },
});
