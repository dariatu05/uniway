import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/colors";

// Component for showing basic user profile information
export default function ProfileHeader({ name, defaultLocation }) {
  return (
    <View style={styles.card}>
      {/* Avatar circle with the first letter of the name */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name?.charAt(0)?.toUpperCase() || "U"}
        </Text>
      </View>

      {/* User name */}
      <Text style={styles.name}>{name}</Text>

      {/* User's def location */}
      <Text style={styles.location}>
        Default Location: {defaultLocation || "Not set"}
      </Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // Main profile card
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

  // Avatar circle
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  // Letter inside the avatar
  avatarText: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: "900",
  },

  // User name
  name: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },

  // Def location text
  location: {
    color: "#64748b",
    fontSize: 15,
  },
});
