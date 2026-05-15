import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/colors";
export default function SettingRow({ label, description, children }) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      <View style={styles.control}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f7",
  },
  textBlock: {
    flex: 1,
  },
  label: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    color: "#64748b",
  },
  control: {
    alignItems: "flex-end",
  },
});
