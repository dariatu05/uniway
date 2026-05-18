// Component for displaying a badge indicating the type of transport (e.g., train, bus, car, plane)
// TransportBadge.js
// Location: src/components/TransportBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

export const TransportBadge = ({ type }) => {
    let label = 'Route';
    let bgColor = COLORS.primary;

    switch(type) {
        case 'train': 
            label = 'Zug'; 
            bgColor = COLORS.secondary; 
            break;
        case 'bus': 
            label = 'Bus'; 
            bgColor = COLORS.primary; 
            break;
        case 'car': 
            label = 'Auto'; 
            bgColor = COLORS.text; 
            break;
        case 'plane': 
            label = 'Flugzeug'; 
            bgColor = '#FFB74D'; 
            break;
    }

    return (
        <View style={[styles.badge, { backgroundColor: bgColor }]}>
            <Text style={styles.text}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    text: {
        color: COLORS.surface,
        fontSize: 12,
        fontWeight: 'bold',
    }
});