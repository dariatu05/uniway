import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { isRouteExpired } from "../../data/expiredRoutes";
import { COLORS } from "../../styles/colors";

const transportLabels = {
  car: "Car",
  train: "Train",
  bus: "Bus",
  plane: "Plane",
};

const TRANSPORT_ICONS = {
  bus: 'bus',
  train: 'train',
  plane: 'airplane',
  car: 'car',
};

function formatDuration(minutes) {
  if (!minutes) return "No data";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} h`;

  return `${hours} h ${mins} min`;
}



export default function FavoriteRouteCard({ route, onDelete }) {
  const expired = isRouteExpired(route);

  const transportType = route.mainTransport?.toLowerCase();
  const iconName = TRANSPORT_ICONS[transportType] || "map-marker";

  return (
    <View style={[styles.card, expired && styles.expiredCard]}>
      {expired ? (
        <Text style={styles.expiredText}>This route has expired.</Text>
      ) : null}

      <View style={styles.topRow}>
        <View style={styles.transportWrap}>
          <MaterialCommunityIcons name={iconName} size={24} color={expired ? "#7f1d1d" : COLORS.primary} />
          <Text style={[styles.transportText, expired && styles.textMuted]}>
            {transportLabels[route.mainTransport] || route.mainTransport}
          </Text>
        </View>

        <TouchableOpacity onPress={() => onDelete(route.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color={expired ? "#ef4444" : "#64748b"} />
        </TouchableOpacity>
      </View>


      <Text style={styles.title}>
        {route.from} → {route.to}
      </Text>

      <View style={styles.dateRow}>
        <MaterialCommunityIcons 
          name="calendar-month" 
          size={20} 
          color={expired ? "#7f1d1d" : COLORS.secondary} 
          style={styles.calendarIcon} 
        />
        <Text style={[styles.info, styles.bold, expired ? styles.textMuted : { color: COLORS.secondary }, { marginBottom: 0 }]}>
          {route.date}
        </Text>
      </View>

      <View style={[styles.statsRow, expired && styles.statsRowExpired]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, expired && styles.textMuted]}>
            {route.price} €
          </Text>
          <Text style={[styles.statLabel, expired && styles.textMuted]}>Price</Text>
        </View>
        
        <View style={[styles.divider, expired && styles.dividerExpired]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, expired && styles.textMuted]}>
            {formatDuration(route.durationMinutes)}
          </Text>
          <Text style={[styles.statLabel, expired && styles.textMuted]}>Duration</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
   dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarIcon: {
    marginRight: 6,
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
   statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.5,
    marginTop: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transportText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  transportWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
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
  statsRowExpired: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#e2e8f0",
  },
  dividerExpired: {
    backgroundColor: "#eeb4b4", 
  },
  textMuted: {
    color: "#7f1d1d",
  },
});
