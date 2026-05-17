import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../styles/colors";

// List of available transport options
const transports = [
  { value: "car", label: "Car" },
  { value: "train", label: "Train" },
  { value: "bus", label: "Bus" },
  { value: "plane", label: "Plane" },
];

// Component for selecting preferred transport types
export default function PreferredTransportSelector({
  selected = [],
  onChange,
}) {
  // Adds or removes a transport option
  function toggleTransport(value) {
    if (selected.includes(value)) {
      // Remove transport if it is already selected
      onChange(selected.filter((item) => item !== value));
    } else {
      // Add transport if it is not selected yet
      onChange([...selected, value]);
    }
  }

  return (
    <View style={styles.container}>
      {/* Create one button for each transport option */}
      {transports.map((transport) => {
        // Check if this transport is currently selected
        const active = selected.includes(transport.value);

        return (
          <TouchableOpacity
            key={transport.value}
            style={[styles.button, active && styles.activeButton]}
            onPress={() => toggleTransport(transport.value)}
          >
            <Text style={[styles.buttonText, active && styles.activeText]}>
              {transport.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Styles for the transport selector
const styles = StyleSheet.create({
  // Container for buttons
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  //Def button style
  button: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.accent,
  },

  // Button style when transport is selected
  activeButton: {
    backgroundColor: COLORS.primary,
  },

  // Def button text style
  buttonText: {
    color: COLORS.text,
    fontWeight: "800",
  },

  // Text style when transport is selected
  activeText: {
    color: "#FFFFFF",
  },
});
