import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../styles/colors";

const transportLabels = {
  car: "Auto",
  train: "Zug",
  bus: "Bus",
  plane: "Flugzeug",
};

function formatDuration(minutes) {
  if (!minutes) return "Keine Angabe";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} h`;

  return `${hours} h ${mins} min`;
}

export default function MapPriceBox({ option }) {
  if (!option) {
    return (
      <View style={styles.box}>
        <Text style={styles.emptyText}>Keine Route gefunden.</Text>
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Text style={styles.label}>{option.label}</Text>

      <Text style={styles.price}>{option.price} €</Text>

      <Text style={styles.text}>
        Route:{" "}
        <Text style={styles.bold}>
          {option.from} → {option.to}
        </Text>
      </Text>

      <Text style={styles.text}>
        Verkehrsmittel:{" "}
        <Text style={styles.transport}>
          {transportLabels[option.mainTransport] || option.mainTransport}
        </Text>
      </Text>

      <Text style={styles.text}>
        Dauer:{" "}
        <Text style={styles.bold}>
          {formatDuration(option.durationMinutes)}
        </Text>
      </Text>

      <Text style={styles.text}>
        Umstiege: <Text style={styles.bold}>{option.transfers}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  label: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  price: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
  },
  text: {
    color: COLORS.text,
    fontSize: 15,
    marginTop: 4,
  },
  bold: {
    fontWeight: "800",
  },
  transport: {
    color: COLORS.secondary,
    fontWeight: "900",
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 15,
  },
});
