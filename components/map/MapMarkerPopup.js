import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/colors";
export default function MapMarkerPopup({ label, type }) {
  return (
    <View style={styles.popup}>
      <Text style={styles.title}>{label}</Text>
      {type ? <Text style={styles.type}>{type}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
  },
  title: {
    color: COLORS.text,
    fontWeight: "800",
  },
  type: {
    marginTop: 4,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
