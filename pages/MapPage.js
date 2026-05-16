import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import MapPriceBox from "../components/map/MapPriceBox";
import MapTransportFilter from "../components/map/MapTransportFilter";
import RouteMap from "../components/map/RouteMap";

import {
  createPolyline,
  getCoordinatesForRoute,
  getRouteCenter,
} from "../api/mapApi";

import { COLORS } from "../styles/colors";

const mapRouteOptions = [
  {
    id: "map-1",
    from: "Wien",
    to: "Berlin",
    mainTransport: "bus",
    price: 39,
    durationMinutes: 510,
    transfers: 1,
    label: "Günstigste Option",
    routeCities: ["Wien", "Prag", "Berlin"],
  },
  {
    id: "map-2",
    from: "Wien",
    to: "Berlin",
    mainTransport: "train",
    price: 69,
    durationMinutes: 420,
    transfers: 0,
    label: "Zug-Option",
    routeCities: ["Wien", "Prag", "Berlin"],
  },
  {
    id: "map-3",
    from: "Wien",
    to: "Berlin",
    mainTransport: "plane",
    price: 99,
    durationMinutes: 95,
    transfers: 0,
    label: "Schnellste Option",
    routeCities: ["Wien", "Berlin"],
  },
  {
    id: "map-4",
    from: "Wien",
    to: "Berlin",
    mainTransport: "car",
    price: 58,
    durationMinutes: 390,
    transfers: 0,
    label: "Auto-Option",
    routeCities: ["Wien", "Prag", "Berlin"],
  },
];

function getSelectedOption(selectedTransport) {
  if (selectedTransport === "all") {
    return [...mapRouteOptions].sort((a, b) => a.price - b.price)[0];
  }

  return mapRouteOptions.find(
    (option) => option.mainTransport === selectedTransport,
  );
}

export default function MapPage() {
  const [selectedTransport, setSelectedTransport] = useState("all");

  const selectedOption = useMemo(() => {
    return getSelectedOption(selectedTransport);
  }, [selectedTransport]);

  const routePoints = useMemo(() => {
    if (!selectedOption) return [];
    return getCoordinatesForRoute(selectedOption.routeCities);
  }, [selectedOption]);

  const polyline = useMemo(() => createPolyline(routePoints), [routePoints]);
  const center = useMemo(() => getRouteCenter(routePoints), [routePoints]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.pageLabel}>UniWay Map</Text>
        <Text style={styles.title}>Reiseroute ansehen</Text>
        <Text style={styles.subtitle}>
          Wähle ein Verkehrsmittel. Bei „Alle“ wird automatisch die günstigste
          Option angezeigt.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verkehrsmittel</Text>

        <MapTransportFilter
          selectedTransport={selectedTransport}
          onChange={setSelectedTransport}
        />
      </View>

      <MapPriceBox option={selectedOption} />

      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Karte</Text>

        <View style={styles.mapWrapper}>
          <RouteMap points={routePoints} center={center} polyline={polyline} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  pageLabel: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 21,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 10,
  },
  mapSection: {
    marginTop: 4,
  },
  mapWrapper: {
    borderRadius: 24,
    overflow: "hidden",
  },
});
