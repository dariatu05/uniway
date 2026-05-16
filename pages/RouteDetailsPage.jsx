// RouteDetailsPage.jsx
// Location: src/pages/RouteDetailsPage.jsx
//
// Full detail view for one selected route.
// Used inline inside ResultsPage (no React Navigation needed).
// Props: route (object), onBack (function)

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LikeRouteButton } from "../components/LikeRouteButton";
import { COLORS } from "../styles/colors";
import {
  openBookingForRoute,
  openBookingForSegment,
} from "../utils/bookingUtils";
import { getLabelColor, getLabelText } from "../utils/routeRanking";
import { ScreenLayout, BackButton } from '../components/CommonLayout';

const TRANSPORT_ICONS = {
  bus: "bus",
  train: "train",
  plane: "airplane",
  car: "car",
};

/**
 * @param {Object}   props
 * @param {Object}   props.route   - the selected route object
 * @param {Function} props.onBack  - go back to results list
 */
export function RouteDetailsPage({ route, onBack }) {
  if (!route) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No route selected.</Text>
      </View>
    );
  }

  const {
    from,
    to,
    price,
    duration,
    departure,
    arrival,
    transfers,
    type,
    label,
    segments = [],
  } = route;

  const labelText = getLabelText(label);
  const labelColor = getLabelColor(label);
  const icon = TRANSPORT_ICONS[type] || "bus";

  return (
    <ScreenLayout>
      {/* Back link */}
      {onBack && <BackButton onPress={onBack} />}
      {/*  Page title */}
      <Text style={styles.pageTitle}>Route Details</Text>
      <Text style={styles.pageSubtitle}>
        {from} → {to}
      </Text>

      {/* ── Summary card ── */}
      <View style={styles.summaryCard}>
        {/* Transport + label + heart */}
        <View style={styles.topRow}>
          <View style={styles.iconRow}>
            <MaterialCommunityIcons
              name={icon}
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.transportText}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </View>
          <View style={styles.topRight}>
            {labelText && (
              <View style={[styles.badge, { backgroundColor: labelColor }]}>
                <Text style={styles.badgeText}>{labelText}</Text>
              </View>
            )}
            <LikeRouteButton route={route} size={24} />
          </View>
        </View>

        {/* Route name */}
        <Text style={styles.routeTitle}>
          {from} → {to}
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>€{price}</Text>
            <Text style={styles.statLabel}>Total Price</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transfers ?? 0}</Text>
            <Text style={styles.statLabel}>
              {transfers === 1 ? "Transfer" : "Transfers"}
            </Text>
          </View>
        </View>

        {/* Departure / arrival */}
        <View style={styles.timeRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={14}
            color={COLORS.text}
            style={{ opacity: 0.45 }}
          />
          <Text style={styles.timeText}>
            Departs {departure} · Arrives {arrival}
          </Text>
        </View>
      </View>

      {/* ── Journey breakdown ── */}
      {segments.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Journey Breakdown</Text>

          {segments.map((seg, idx) => {
            const segIcon = TRANSPORT_ICONS[seg.type] || "bus";
            return (
              <View key={seg.id} style={styles.segCard}>
                {/* Segment header */}
                <View style={styles.segHeader}>
                  <View style={styles.iconRow}>
                    <MaterialCommunityIcons
                      name={segIcon}
                      size={16}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.segTransport}>
                      {seg.type.charAt(0).toUpperCase() + seg.type.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.segOperator}>{seg.operator}</Text>
                </View>

                {/* From → To */}
                <Text style={styles.segRoute}>
                  {seg.from} → {seg.to}
                </Text>

                {/* Time + price */}
                <View style={styles.segMeta}>
                  <View style={styles.segMetaItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={12}
                      color={COLORS.text}
                      style={{ opacity: 0.45 }}
                    />
                    <Text style={styles.segMetaText}>
                      {seg.departure} → {seg.arrival}
                    </Text>
                  </View>
                  <View style={styles.segMetaItem}>
                    <MaterialCommunityIcons
                      name="timer-outline"
                      size={12}
                      color={COLORS.text}
                      style={{ opacity: 0.45 }}
                    />
                    <Text style={styles.segMetaText}>{seg.duration}</Text>
                  </View>
                  <Text style={styles.segPrice}>€{seg.price}</Text>
                </View>

                {/* Book this leg */}
                <TouchableOpacity
                  style={styles.segBookBtn}
                  onPress={() => openBookingForSegment(seg)}
                  activeOpacity={0.75}
                >
                  <MaterialCommunityIcons
                    name="open-in-new"
                    size={13}
                    color={COLORS.primary}
                  />
                  <Text style={styles.segBookText}>Book this leg</Text>
                </TouchableOpacity>

                {/* Transfer divider between segments */}
                {idx < segments.length - 1 && (
                  <View style={styles.transferRow}>
                    <View style={styles.transferLine} />
                    <Text style={styles.transferLabel}>Transfer</Text>
                    <View style={styles.transferLine} />
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}

      {/* ── Book entire route ── */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => openBookingForRoute(route)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="ticket-outline" size={20} color="#fff" />
        <Text style={styles.bookBtnText}>Book This Route</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
   pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.55,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  transportText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  routeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.text, opacity: 0.5, marginTop: 3 },
  statDivider: { width: 1, height: 30, backgroundColor: "#e5e7eb" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  timeText: { fontSize: 13, color: COLORS.text, opacity: 0.5 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  segCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  segHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  segTransport: { fontSize: 13, fontWeight: "600", color: COLORS.secondary },
  segOperator: { fontSize: 12, color: COLORS.text, opacity: 0.45 },
  segRoute: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  segMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  segMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  segMetaText: { fontSize: 12, color: COLORS.text, opacity: 0.55 },
  segPrice: {
    marginLeft: "auto",
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  segBookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  segBookText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  transferRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 8,
  },
  transferLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  transferLabel: {
    fontSize: 11,
    color: COLORS.text,
    opacity: 0.4,
    fontWeight: "500",
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  bookBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: COLORS.text, opacity: 0.5, fontSize: 16 },
});