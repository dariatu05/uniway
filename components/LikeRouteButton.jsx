// LikeRouteButton.jsx
// Location: src/components/LikeRouteButton.jsx
// Heart button to save/unsave a route to favorites

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { isFavorite, subscribeFavorites, toggleFavorite } from '../utils/favoritesStore';
import { COLORS } from '../styles/colors';

/**
 * @param {Object} props
 * @param {Object} props.route - the full route object to save
 * @param {number} [props.size=26] - icon size
 */
export function LikeRouteButton({ route, size = 26 }) {
    const [liked, setLiked] = useState(() => isFavorite(route.id));

    // Stay in sync if favorites change elsewhere (e.g., removed on FavoritesPage)
    useEffect(() => {
        const unsubscribe = subscribeFavorites(() => {
            setLiked(isFavorite(route.id));
        });
        return unsubscribe;
    }, [route.id]);

    const handlePress = () => {
        toggleFavorite(route);
        // state updates via subscription above
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={styles.button}
            activeOpacity={0.7}
            accessibilityLabel={liked ? 'Remove from favorites' : 'Save to favorites'}
            accessibilityRole="button"
        >
            <MaterialCommunityIcons
                name={liked ? 'heart' : 'heart-outline'}
                size={size}
                color={liked ? '#E53E3E' : COLORS.text}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 6,
    },
});
