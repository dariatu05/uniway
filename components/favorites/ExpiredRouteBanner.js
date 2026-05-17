import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../styles/colors";

// Shows a warning banner when there are expired saved routes
export default function ExpiredRouteBanner({ expiredCount, onDeleteAll }) {
  if (expiredCount === 0) return null;

  return (
    <View style={styles.banner}>
      {/* Banner title with number of expired routes */}
      <Text style={styles.title}>
        {expiredCount} expired route(s) have expired.
      </Text>

      <Text style={styles.text}>These routes can be deleted.</Text>

      {/* Button to delete all expired routes */}
      <TouchableOpacity style={styles.button} onPress={onDeleteAll}>
        <Text style={styles.buttonText}>All expired routes</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // Main container
  banner: {
    backgroundColor: "#fde2e2",
    borderColor: "#f5a3a3",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  // Title text inside banner
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  // text inside banner
  text: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 14,
  },

  // Delete button
  button: {
    backgroundColor: "#b91c1c",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  // Text inside delete button
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
