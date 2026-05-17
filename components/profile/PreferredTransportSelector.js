import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../styles/colors";
const transports = [
  { value: "car", label: "Car" },
  { value: "train", label: "Train" },
  { value: "bus", label: "Bus" },
  { value: "plane", label: "Plane" },
];

export default function PreferredTransportSelector({
  selected = [],
  onChange,
}) {
  function toggleTransport(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <View style={styles.container}>
      {transports.map((transport) => {
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.accent,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "800",
  },
  activeText: {
    color: "#FFFFFF",
  },
});
