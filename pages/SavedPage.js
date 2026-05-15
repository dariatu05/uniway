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
  const [favorites, setFavorites] = useState([]);
  const [expiredRoutes, setExpiredRoutes] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  function loadFavorites() {
    const savedRoutes = getFavoriteRoutes();
    const expired = getExpiredRoutes();

    setFavorites(savedRoutes);
    setExpiredRoutes(expired);
  }

  function handleDelete(routeId) {
    const updatedFavorites = deleteFavoriteRoute(routeId);
    setFavorites(updatedFavorites);
    setExpiredRoutes(getExpiredRoutes());
  }

  function handleDeleteAllExpired() {
    const updatedFavorites = clearExpiredRoutes();
    setFavorites(updatedFavorites);
    setExpiredRoutes([]);
  }

  function isExpired(route) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const routeDate = new Date(route.date);
    routeDate.setHours(0, 0, 0, 0);

    return routeDate < today;
  }

  function openBookingUrl(url) {
    if (url) {
      Linking.openURL(url);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Gespeicherte Routen</Text>

      {expiredRoutes.length > 0 ? (
        <View style={styles.expiredBanner}>
          <Text style={styles.expiredTitle}>
            {expiredRoutes.length} Route(n) sind abgelaufen.
          </Text>

          <Text style={styles.expiredText}>
            Diese Routen liegen in der Vergangenheit.
          </Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAllExpired}
          >
            <Text style={styles.buttonText}>Alle abgelaufenen löschen</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Keine gespeicherten Routen</Text>
          <Text style={styles.emptyText}>
            Gespeicherte Reisen werden hier angezeigt, sobald du eine Route
            speicherst.
          </Text>
        </View>
      ) : (
        favorites.map((route) => {
          const expired = isExpired(route);

          return (
            <View
              key={route.id}
              style={[styles.card, expired && styles.expiredCard]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.routeInfo}>
                  <Text
                    style={[styles.routeTitle, expired && styles.whiteText]}
                  >
                    {route.from} → {route.to}
                  </Text>

                  <Text style={[styles.infoText, expired && styles.whiteText]}>
                    Datum: {formatDate(route.date)}
                  </Text>

                  <Text style={[styles.infoText, expired && styles.whiteText]}>
                    Verkehrsmittel: {route.mainTransport}
                  </Text>

                  <Text style={[styles.infoText, expired && styles.whiteText]}>
                    Dauer: {route.durationMinutes} Minuten
                  </Text>
                </View>

                <View style={styles.priceBox}>
                  <Text style={[styles.price, expired && styles.whiteText]}>
                    {route.price} €
                  </Text>
                </View>
              </View>

              {expired ? (
                <Text style={styles.expiredRouteText}>
                  Diese Route ist abgelaufen.
                </Text>
              ) : null}

              <View style={styles.buttonRow}>
                {route.bookingUrl ? (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => openBookingUrl(route.bookingUrl)}
                  >
                    <Text style={styles.buttonText}>Anbieter öffnen</Text>
                  </TouchableOpacity>
                ) : null}

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
