import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getCheapestPrice, mockPriceCalendar } from "../data/mockPriceCalendar";
import { COLORS } from "../styles/colors";

const transportLabels = {
  bus: "Bus",
  train: "Zug",
  car: "Auto",
  plane: "Flugzeug",
};

export default function PriceCalendar({
  selectedTransports = [],
  onSelectDay,
}) {
  const [viewMode, setViewMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(null);

  function handleDayClick(day) {
    setSelectedDate(day.date);

    if (onSelectDay) {
      onSelectDay(day);
    }
  }

  function getVisibleDays() {
    if (viewMode === "day") {
      return mockPriceCalendar.slice(0, 1);
    }

    if (viewMode === "week") {
      return mockPriceCalendar.slice(0, 7);
    }

    return mockPriceCalendar;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Preisübersicht</Text>

      <View style={styles.viewButtons}>
        <ViewButton
          label="Tag"
          active={viewMode === "day"}
          onPress={() => setViewMode("day")}
        />
        <ViewButton
          label="Woche"
          active={viewMode === "week"}
          onPress={() => setViewMode("week")}
        />
        <ViewButton
          label="Monat"
          active={viewMode === "month"}
          onPress={() => setViewMode("month")}
        />
      </View>

      <View style={styles.grid}>
        {getVisibleDays().map((day) => {
          const cheapest = getCheapestPrice(day, selectedTransports);
          const isSelected = selectedDate === day.date;
          const isVeryCheap = cheapest.price <= 35;

          return (
            <Pressable
              key={day.id}
              onPress={() => handleDayClick(day)}
              style={[
                styles.dayButton,
                isVeryCheap && styles.cheapDay,
                isSelected && styles.selectedDay,
              ]}
            >
              <Text
                style={[styles.dateText, isSelected && styles.selectedText]}
              >
                {formatDate(day.date)}
              </Text>

              <Text
                style={[styles.priceText, isSelected && styles.selectedText]}
              >
                {cheapest.price} €
              </Text>

              <Text
                style={[
                  styles.transportText,
                  isSelected && styles.selectedText,
                ]}
              >
                {transportLabels[cheapest.transport]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ViewButton({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.viewButton, active && styles.activeViewButton]}
    >
      <Text
        style={[styles.viewButtonText, active && styles.activeViewButtonText]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
  });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  title: {
    marginBottom: 12,
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
  },
  viewButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  viewButton: {
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: COLORS.accent,
  },
  activeViewButton: {
    backgroundColor: COLORS.primary,
  },
  viewButtonText: {
    color: COLORS.text,
    fontWeight: "800",
  },
  activeViewButtonText: {
    color: "#FFFFFF",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dayButton: {
    width: "48%",
    borderRadius: 14,
    padding: 12,
    backgroundColor: COLORS.background,
  },
  cheapDay: {
    backgroundColor: COLORS.accent,
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
  },
  dateText: {
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 6,
  },
  priceText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "900",
  },
  transportText: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: 4,
  },
  selectedText: {
    color: "#FFFFFF",
  },
});
