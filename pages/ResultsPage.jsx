// ResultsPage.jsx
// Location: src/pages/ResultsPage.jsx
//
// Rendered by SearchPage in State 4 (showRouteResults === true).
// Receives search params as props — no React Navigation needed here.
// If your team later adds a separate /results route, it also works via navigation params.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { RouteCard } from '../components/RouteCard';
import { MOCK_ROUTES } from '../data/mockRoutes';
import { COLORS } from '../styles/colors';
import { rankRoutes } from '../utils/routeRanking';
import { RouteDetailsPage } from './RouteDetailsPage';

const SORT_OPTIONS = [
    { key: 'cheapest', label: '🏷️ Price' },
    { key: 'fastest', label: '⚡ Speed' },
    { key: 'best', label: '⭐ Best' },
];

const TRANSPORT_MAP = {
    'Bus': 'bus',
    'Zug': 'train',
    'Auto': 'car',
    'Flugzeug': 'plane',
};

/**
 * @param {Object}   props
 * @param {string}   props.from                - departure city from SearchPage
 * @param {string}   props.to                  - destination city from SearchPage
 * @param {string}   props.selectedDate        - ISO date chosen in calendar (e.g. '2026-06-15')
 * @param {string}   props.maxBudget           - max budget string ('' = no limit)
 * @param {string[]} props.selectedTransports  - e.g. ['Bus', 'Zug'] or [] for all
 * @param {boolean}  props.directOnly          - show only routes with 0 transfers
 * @param {Function} props.onBack              - called when user presses back
 */
export default function ResultsPage({
    from = '',
    to = '',
    selectedDate = '',
    maxBudget = '',
    selectedTransports = [],
    directOnly = false,
    onBack,
}) {
    const [sortKey, setSortKey] = useState('cheapest');
    // null = list view; route object = detail view
    const [detailRoute, setDetailRoute] = useState(null);

    // ── Filter mock routes ──────────────────────────────────────────────────
    const budget = parseFloat(maxBudget) || Infinity;

    // Allowed transport types (empty selectedTransports = all allowed)
    const allowedTypes =
        selectedTransports.length === 0
            ? Object.values(TRANSPORT_MAP)
            : selectedTransports.map(t => TRANSPORT_MAP[t]).filter(Boolean);

    const filtered = MOCK_ROUTES.filter(r => {
        const fromMatch = from.trim() === '' || r.from.toLowerCase().includes(from.toLowerCase());
        const toMatch = to.trim() === '' || r.to.toLowerCase().includes(to.toLowerCase());
        const typeMatch = allowedTypes.includes(r.type);
        const budgetOk = r.price <= budget;
        const directOk = !directOnly || r.transfers === 0;
        return fromMatch && toMatch && typeMatch && budgetOk && directOk;
    });

    // ── Rank + sort ─────────────────────────────────────────────────────────
    const ranked = rankRoutes(filtered.length > 0 ? filtered : MOCK_ROUTES);

    const sorted = [...ranked].sort((a, b) => {
        if (sortKey === 'cheapest') return a.price - b.price;
        if (sortKey === 'fastest') return a.durationMinutes - b.durationMinutes;
        // 'best' — labelled best first, then by price
        if (a.label === 'best' && b.label !== 'best') return -1;
        if (b.label === 'best' && a.label !== 'best') return 1;
        return a.price - b.price;
    });

    // ── Detail view (replaces list) ─────────────────────────────────────────
    if (detailRoute) {
        return (
            <RouteDetailsPage
                route={detailRoute}
                onBack={() => setDetailRoute(null)}
            />
        );
    }

    // ── List view ───────────────────────────────────────────────────────────
    const subtitle =
        from && to
            ? `${from} → ${to}  ·  ${sorted.length} result${sorted.length !== 1 ? 's' : ''}`
            : `${sorted.length} result${sorted.length !== 1 ? 's' : ''} found`;

    return (
        <ScrollView style={styles.page} contentContainerStyle={styles.content}>
            {onBack && (
                <TouchableOpacity style={styles.backLink} onPress={onBack}>
                    <MaterialCommunityIcons name="chevron-left" size={28} color={COLORS.primary} />
                    <Text style={styles.backLinkText}>Zurück</Text>
                </TouchableOpacity>
            )}
            {/* ── Header ── */}
            <View style={styles.headerBlock}>
                <Text style={styles.title}>Results</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                {selectedDate !== '' && (
                    <Text style={styles.dateLabel}>📅 {selectedDate}</Text>
                )}
            </View>

            {/* ── Sort tabs ── */}
            <View style={styles.sortRow}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <View style={styles.sortOptions}>
                    {SORT_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt.key}
                            style={[
                                styles.sortButton,
                                sortKey === opt.key && styles.sortButtonActive,
                            ]}
                            onPress={() => setSortKey(opt.key)}
                        >
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

            {/* ── Route list / empty state ── */}
            {sorted.length > 0 ? (
                sorted.map((item) => (
                    <RouteCard
                        key={item.id}
                        route={item}
                        onPress={() => setDetailRoute(item)}
                    />
                ))
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

    backLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: -5
    },
    backLinkText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16
    },
    headerBlock: {
        marginBottom: 14,
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
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
        fontWeight: '600',
        marginTop: 4,
    },
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    sortLabel: {
        fontSize: 13,
        color: COLORS.text,
        opacity: 0.55,
        fontWeight: '500',
    },
    sortOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    sortButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    sortButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
    },
    sortButtonTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingBottom: 30,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        opacity: 0.6,
    },
    emptySubText: {
        fontSize: 13,
        color: COLORS.text,
        opacity: 0.4,
        textAlign: 'center',
    },
});
