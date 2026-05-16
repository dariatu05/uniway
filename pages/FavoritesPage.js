import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { deleteFavoriteRoute, getFavoriteRoutes } from "../api/storageApi";

import EmptyFavorites from "../components/favorites/EmptyFavorites";
import FavoriteRouteCard from "../components/favorites/FavoriteRouteCard";
import { COLORS } from "../styles/colors";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(() => getFavoriteRoutes());

  function handleDelete(routeId) {
    const updatedFavorites = deleteFavoriteRoute(routeId);
    setFavorites(updatedFavorites);
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Favoriten</Text>

      <Text style={styles.subtitle}>
        Hier findest du deine gespeicherten Routen.
      </Text>

      {favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        favorites.map((route) => (
          <FavoriteRouteCard
            key={route.id}
            route={route}
            onDelete={handleDelete}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingBottom: 80,
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 18,
  },
});
