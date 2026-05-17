import { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  clearExpiredRoutes,
  deleteFavoriteRoute,
  getExpiredRoutes,
  getFavoriteRoutes,
} from "../api/storageApi";

import { COLORS } from "../styles/colors";

export default function SavedPage() {
  // Stores all saved favorite routes
  const [favorites, setFavorites] = useState([]);

  // Stores only routes that are already expired
  const [expiredRoutes, setExpiredRoutes] = useState([]);

  // Runs once when the page is opened
  useEffect(() => {
    loadFavorites();
  }, []);

  // Loads saved routes and expired routes from storage
  function loadFavorites() {
    const savedRoutes = getFavoriteRoutes();
    const expired = getExpiredRoutes();

    setFavorites(savedRoutes);
    setExpiredRoutes(expired);
  }

  // Deletes one selected route from favorites
  function handleDelete(routeId) {
    const updatedFavorites = deleteFavoriteRoute(routeId);

    setFavorites(updatedFavorites);

    // Refresh expired routes after deleting
    setExpiredRoutes(getExpiredRoutes());
  }

  // Deletes all routes that are already expired
  function handleDeleteAllExpired() {
    const updatedFavorites = clearExpiredRoutes();

    setFavorites(updatedFavorites);

    // After deleting them, expired list is empty
    setExpiredRoutes([]);
  }

  // Checks if the route date is before today
  function isExpired(route) {
    const today = new Date();

    // Removes current time, so only the date is compared
    today.setHours(0, 0, 0, 0);

    const routeDate = new Date(route.date);

    // Also remove time from the route date
    routeDate.setHours(0, 0, 0, 0);

    return routeDate < today;
  }

  // Opens the booking link in the browser
  function openBookingUrl(url) {
    if (url) {
      Linking.openURL(url);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      {/* Page title */}
      <Text style={styles.title}>Saved Routes</Text>

      {/* Shows warning if expired routes exist */}
      {expiredRoutes.length > 0 ? (
        <View style={styles.expiredBanner}>
          <Text style={styles.expiredTitle}>
            {expiredRoutes.length} route(s) have expired.
          </Text>

          <Text style={styles.expiredText}>These routes are in the past.</Text>

          {/* Button for deleting all expired routes */}
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAllExpired}
          >
            <Text style={styles.buttonText}>Delete all expired </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Shows empty message if no saved routes exist */}
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No saved routes</Text>

          <Text style={styles.emptyText}>
            Saved trips will be displayed here once you save a route.
          </Text>
        </View>
      ) : (
        // Shows all saved routes
        favorites.map((route) => {
          const expired = isExpired(route);

          return (
            <View
              key={route.id}
              style={[styles.card, expired && styles.expiredCard]}
            >
              {/* Route information and price */}
              <View style={styles.cardHeader}>
                <View style={styles.routeInfo}>
                  {/* Start and destination */}
                  <Text
                    style={[styles.routeTitle, expired && styles.whiteText]}
                  >
                    {route.from} → {route.to}
                  </Text>

                  {/* Travel date */}
                  <Text style={[styles.infoText, expired && styles.whiteText]}>
                    Datum: {formatDate(route.date)}
                  </Text>

                  {/* Main transport type */}
                  <Text style={[styles.infoText, expired && styles.whiteText]}>
                    Verkehrsmittel: {route.mainTransport}
                  </Text>

                  {/* Travel duration */}
                  <Text style={[styles.infoText, expired && styles.whiteText]}>
                    Dauer: {route.durationMinutes} Minuten
                  </Text>
                </View>

                {/* Route price */}
                <View style={styles.priceBox}>
                  <Text style={[styles.price, expired && styles.whiteText]}>
                    {route.price} €
                  </Text>
                </View>
              </View>

              {/* Extra text for expired route */}
              {expired ? (
                <Text style={styles.expiredRouteText}>
                  Diese Route ist abgelaufen.
                </Text>
              ) : null}

              {/* Action buttons */}
              <View style={styles.buttonRow}>
                {/* Opens provider website if booking link exists */}
                {route.bookingUrl ? (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => openBookingUrl(route.bookingUrl)}
                  >
                    <Text style={styles.buttonText}>Anbieter öffnen</Text>
                  </TouchableOpacity>
                ) : null}

                {/* Deletes this route */}
                <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={() => handleDelete(route.id)}
                >
                  <Text style={styles.buttonText}>Löschen</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

// Formats date for Austrian display
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    color: COLORS.primary,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 16,
  },
  expiredBanner: {
    backgroundColor: "#ffe5e5",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  expiredTitle: {
    color: "#7a1f1f",
    fontSize: 16,
    fontWeight: "900",
  },
  expiredText: {
    color: "#7a1f1f",
    marginTop: 8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  expiredCard: {
    backgroundColor: "#3b1f1f",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    color: COLORS.text,
    marginBottom: 4,
  },
  priceBox: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },
  whiteText: {
    color: "#FFFFFF",
  },
  expiredRouteText: {
    marginTop: 10,
    color: "#ffb3b3",
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.primary,
  },
  dangerButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#b00020",
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.text,
    lineHeight: 21,
  },
});
