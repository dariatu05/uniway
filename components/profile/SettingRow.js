import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/colors";

// Reusable row component for one setting item
export default function SettingRow({ label, description, children }) {
  return (
    <View style={styles.row}>
      {/* Left: setting name and description */}
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>

        {/* Show description only if exists */}
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      {/* Right : setting control, for example switch or button */}
      <View style={styles.control}>{children}</View>
    </View>
  );
}

// Styles for the setting row
const styles = StyleSheet.create({
  // Main row container
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f7",
  },

  // Text area on the left
  textBlock: {
    flex: 1,
  },

  // Setting title text
  label: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },

  // Smaller description text
  description: {
    marginTop: 5,
    fontSize: 14,
    color: "#64748b",
  },

  // Control area on the right
  control: {
    alignItems: "flex-end",
  },
});
