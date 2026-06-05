// ResultsPage.jsx
// Location: src/pages/ResultsPage.jsx
//
// Shows list of routes matching search criteria, with sorting options and detail view.
// M4 update: receives stops[] from SearchPage and passes them to RouteCard so the full route is visible on each card.

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { saveFavoriteRoute } from "../api/storageApi";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BackButton, ScreenLayout } from "../components/CommonLayout";
import { RouteCard } from "../components/RouteCard";
import { MOCK_ROUTES } from "../data/mockRoutes";
import { COLORS } from "../styles/colors";
import { rankRoutes } from "../utils/routeRanking";
import { RouteDetailsPage } from "./RouteDetailsPage";

const SORT_OPTIONS = [
  { key: "cheapest", label: " Price", icon: "tag" },
  { key: "fastest",  label: " Speed", icon: "flash" },
  { key: "best",     label: " Best",  icon: "crown" },
];

const TRANSPORT_MAP = {
  Bus:   "bus",
  Train: "train",
  Car:   "car",
  Plane: "plane",
};

export default function ResultsPage({
  from = "",
  to = "",
  stops = [],           // M4: stopover cities from SearchPage
  selectedDate = "",
  maxBudget = "",
  selectedTransports = [],
  directOnly = false,
  passengers = 1,
  fuelCost,
  onBack,
}) {
  const [sortKey, setSortKey] = useState("cheapest");
  const [detailRoute, setDetailRoute] = useState(null);

  async function handleSaveFavorite(route) {
    const favoriteRoute = {
      ...route,
      date: selectedDate || new Date().toISOString(),
      mainTransport: route.type,
      bookingUrl: route.bookingUrl || null,
    };
    await saveFavoriteRoute(favoriteRoute);
  }

  function getRoutePrice(route) {
    if (route.type?.toLowerCase() === "car" && fuelCost) {
      return parseFloat(fuelCost);
    }
    return route.price * passengerCount;
  }

  //  Filter 
  const budget = parseFloat(maxBudget) || Infinity;
  const passengerCount = Math.max(1, passengers);

  const allowedTypes =
    selectedTransports.length === 0
      ? Object.values(TRANSPORT_MAP)
      : selectedTransports.map((t) => TRANSPORT_MAP[t]).filter(Boolean);

  const filtered = MOCK_ROUTES.filter((r) => {
    const fromMatch =
      from.trim() === "" || r.from.toLowerCase().includes(from.toLowerCase());
    const toMatch =
      to.trim() === "" || r.to.toLowerCase().includes(to.toLowerCase());
    const typeMatch = allowedTypes.includes(r.type?.toLowerCase());
    const budgetOk  = getRoutePrice(r) <= budget;
    const directOk  = !directOnly || r.transfers === 0;
    return fromMatch && toMatch && typeMatch && budgetOk && directOk;
  });

  //  Rank + sort 
  const ranked = rankRoutes(filtered.length > 0 ? filtered : MOCK_ROUTES);

  const sorted = [...ranked].sort((a, b) => {
    if (sortKey === "cheapest") return a.price - b.price;
    if (sortKey === "fastest")  return a.durationMinutes - b.durationMinutes;
    if (a.label === "best" && b.label !== "best") return -1;
    if (b.label === "best" && a.label !== "best") return  1;
    return a.price - b.price;
  });

  //  Detail view 
  if (detailRoute) {
    return (
      <RouteDetailsPage
        route={detailRoute}
        onBack={() => setDetailRoute(null)}
      />
    );
  }

  //  Subtitle: full route string including stopovers
  const validStops = stops.filter((s) => s.trim() !== "");
  const routeString =
    from && to
      ? [from, ...validStops, to].join(" → ")
      : "";

  const subtitle = routeString
    ? `${routeString}  ·  ${sorted.length} result${sorted.length !== 1 ? "s" : ""}`
    : `${sorted.length} result${sorted.length !== 1 ? "s" : ""} found`;

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={styles.headerBlock}>
        {onBack && <BackButton onPress={onBack} />}
        <Text style={styles.title}>Results</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {selectedDate !== "" && (
          <View style={styles.dateRow}>
            <MaterialCommunityIcons
              name="calendar-month"
              size={14}
              color={COLORS.secondary}
            />
            <Text style={styles.dateLabel}>{selectedDate}</Text>
          </View>
        )}
      </View>

      {/* Sort tabs */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortOptions}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.sortButton,
                sortKey === opt.key && styles.sortButtonActive,
              ]}
              onPress={() => setSortKey(opt.key)}
            >
              <MaterialCommunityIcons
                name={opt.icon}
                size={16}
                color={sortKey === opt.key ? "#fff" : COLORS.secondary}
                style={styles.sortIcon}
              />
              <Text
                style={[
                  styles.sortButtonText,
                  sortKey === opt.key && styles.sortButtonTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Route list / empty state */}
      {sorted.length > 0 ? (
        sorted.map((item) => {
          const routeWithPrice = {
            ...item,
            price: getRoutePrice(item),
            pricePerPerson: item.price,
            passengers: passengerCount,
            stops: validStops,   // M4: pass stopovers into each card
          };
          return (
            <RouteCard
              key={item.id}
              route={routeWithPrice}
              onPress={() => setDetailRoute(routeWithPrice)}
              onFavorite={() => handleSaveFavorite(routeWithPrice)}
            />
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="map-search-outline"
            size={48}
            color={COLORS.primary}
            style={{ opacity: 0.35 }}
          />
          <Text style={styles.emptyText}>No routes found.</Text>
          <Text style={styles.emptySubText}>
            Try adjusting your filters or budget.
          </Text>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginBottom: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    marginTop: 2,
  },
  dateLabel: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: "600",
    marginTop: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  sortLabel: {
    fontSize: 13,
    color: COLORS.text,
    opacity: 0.55,
    fontWeight: "500",
  },
  sortOptions: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortIcon: {
    marginRight: 2,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  sortButtonTextActive: {
    color: "#fff",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    opacity: 0.6,
  },
  emptySubText: {
    fontSize: 13,
    color: COLORS.text,
    opacity: 0.4,
    textAlign: "center",
  },
});
