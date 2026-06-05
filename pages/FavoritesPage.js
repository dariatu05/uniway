// FavoritesPage.js
// Page for displaying user's favorite routes
// Location: src/pages/FavoritesPage.js

import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { deleteFavoriteRoute, getFavoriteRoutes } from "../api/storageApi";

import EmptyFavorites from "../components/favorites/EmptyFavorites";
import FavoriteRouteCard from "../components/favorites/FavoriteRouteCard";
import { COLORS } from "../styles/colors";

export default function FavoritesPage() {
  // Stores all saved favorite routes
  const [favorites, setFavorites] = useState([]);

  // Loads favorites every time the Favorites tab is opened
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  // Reads saved routes from AsyncStorage
  async function loadFavorites() {
    try {
      const savedRoutes = await getFavoriteRoutes();

      setFavorites(Array.isArray(savedRoutes) ? savedRoutes : []);
    } catch (error) {
      console.error("Failed to load favorite routes:", error);
      setFavorites([]);
    }
  }

  // Deletes one selected favorite route
  async function handleDelete(routeId) {
    try {
      const updatedFavorites = await deleteFavoriteRoute(routeId);

      setFavorites(Array.isArray(updatedFavorites) ? updatedFavorites : []);
    } catch (error) {
      console.error("Failed to delete favorite route:", error);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Favorites</Text>

      <Text style={styles.subtitle}>Here you can find your saved routes.</Text>

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
    color: COLORS.primary,
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
