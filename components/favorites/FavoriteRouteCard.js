import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { isRouteExpired } from "../../data/expiredRoutes";
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

export default function FavoriteRouteCard({ route, onDelete }) {
  const expired = isRouteExpired(route);

  return (
    <View style={[styles.card, expired && styles.expiredCard]}>
      {expired ? (
        <Text style={styles.expiredText}>Diese Route ist abgelaufen.</Text>
      ) : null}

      <Text style={styles.title}>
        {route.from} → {route.to}
      </Text>

      <Text style={styles.info}>
        Datum: <Text style={styles.bold}>{route.date}</Text>
      </Text>

      <Text style={styles.info}>
        Verkehrsmittel:{" "}
        <Text style={styles.bold}>
          {transportLabels[route.mainTransport] || route.mainTransport}
        </Text>
      </Text>

      <Text style={styles.info}>
        Dauer:{" "}
        <Text style={styles.bold}>{formatDuration(route.durationMinutes)}</Text>
      </Text>

      <Text style={styles.price}>{route.price} €</Text>

      <TouchableOpacity
        style={[styles.button, expired && styles.deleteButton]}
        onPress={() => onDelete(route.id)}
      >
        <Text style={styles.buttonText}>Löschen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  expiredCard: {
    backgroundColor: "#f3d1d1",
    borderWidth: 1,
    borderColor: "#c24141",
  },
  expiredText: {
    color: "#7f1d1d",
    fontWeight: "900",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 10,
  },
  info: {
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "800",
  },
  price: {
    color: COLORS.secondary,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 14,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  deleteButton: {
    backgroundColor: "#b91c1c",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
