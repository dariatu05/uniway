// RouteCard.jsx
// Location: src/components/RouteCard.jsx
//
// Tappable card that shows one route in the results list.
// Rendered by ResultsPage; navigates to RouteDetailsPage on press.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../styles/colors';
import { getLabelColor, getLabelText } from '../utils/routeRanking';
import { LikeRouteButton } from './LikeRouteButton';

const TRANSPORT_ICONS = {
    bus: 'bus',
    train: 'train',
    plane: 'airplane',
    car: 'car',
};

export function RouteCard({ route, onPress }) {
    const icon = TRANSPORT_ICONS[route.type] || 'bus';
    const labelText = getLabelText(route.label);
    const labelColor = getLabelColor(route.label);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`${route.from} to ${route.to}, ${route.price} euros`}
        >
            {/* ── Top row: transport + label badge + heart ── */}
            <View style={styles.topRow}>
                <View style={styles.iconRow}>
                    <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} />
                    <Text style={styles.transportText}>
                        {route.type.charAt(0).toUpperCase() + route.type.slice(1)}
                    </Text>
                </View>

                <View style={styles.topRight}>
                    {labelText && (
                        <View style={[
                            styles.badge,
                            {
                                backgroundColor: labelColor?.backgroundColor,
                                borderColor: labelColor?.borderColor,
                                borderWidth: labelColor?.borderWidth ?? 0
                            }
                        ]}>
                            <MaterialCommunityIcons
                                name={labelColor?.iconName}
                                size={13}
                                color={labelColor?.iconColor}
                                style={styles.badgeIcon}
                            />
                            <Text style={styles.badgeText}>{labelText}</Text>
                        </View>
                    )}
                    <LikeRouteButton route={route} size={22} />
                </View>
            </View>

            {/* ── Route name ── */}
            <Text style={styles.routeTitle}>
                {route.from} → {route.to}
            </Text>

            {/* ── Stats: price / duration / transfers ── */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>€{route.price}</Text>
                    <Text style={styles.statLabel}>Price</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{route.duration}</Text>
                    <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{route.transfers ?? 0}</Text>
                    <Text style={styles.statLabel}>
                        {route.transfers === 1 ? 'Transfer' : 'Transfers'}
                    </Text>
                </View>
            </View>

            {/* ── Time row ── */}
            <View style={styles.timeRow}>
                <MaterialCommunityIcons
                    name="clock-outline"
                    size={13}
                    color={COLORS.text}
                    style={{ opacity: 0.45 }}
                />
                <Text style={styles.timeText}>
                    {route.departure}  →  {route.arrival}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    transportText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },
    topRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    routeTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.text,
        opacity: 0.5,
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 28,
        backgroundColor: '#e5e7eb',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.text,
        opacity: 0.5,
    },
});
