// LikeRouteButton.jsx
// Location: src/components/LikeRouteButton.jsx
// Heart button to save/unsave a route to favorites

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS } from '../styles/colors';
import { isFavorite, subscribeFavorites, toggleFavorite } from '../utils/favoritesStore';


export function LikeRouteButton({ route, size = 26 }) {
    const [liked, setLiked] = useState(() => isFavorite(route.id));

    useEffect(() => {
        const unsubscribe = subscribeFavorites(() => {
            setLiked(isFavorite(route.id));
        });
        return unsubscribe;
    }, [route.id]);

    const handlePress = () => {
        toggleFavorite(route);
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
                color={liked ? COLORS.primary : COLORS.text}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 6,
    },
});
