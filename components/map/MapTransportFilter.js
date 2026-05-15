import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../styles/colors";
const transports = [
  { value: "all", label: "Alle" },
  { value: "car", label: "Auto" },
  { value: "train", label: "Zug" },
  { value: "bus", label: "Bus" },
  { value: "plane", label: "Flugzeug" },
];

export default function MapTransportFilter({ selectedTransport, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {transports.map((transport) => {
        const active = selectedTransport === transport.value;

        return (
          <TouchableOpacity
            key={transport.value}
            style={[styles.button, active && styles.activeButton]}
            onPress={() => onChange(transport.value)}
          >
            <Text style={[styles.buttonText, active && styles.activeText]}>
              {transport.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 16,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
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
