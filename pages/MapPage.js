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

  const selectedOption = getSelectedOption(selectedTransport);

  const routePoints = useMemo(() => {
    if (!selectedOption) return [];
    return getCoordinatesForRoute(selectedOption.routeCities);
  }, [selectedOption]);

  const polyline = useMemo(() => createPolyline(routePoints), [routePoints]);
  const center = useMemo(() => getRouteCenter(routePoints), [routePoints]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.subtitle}>
        Wähle ein Verkehrsmittel oder lasse „Alle“ aktiv.
      </Text>

      <MapTransportFilter
        selectedTransport={selectedTransport}
        onChange={setSelectedTransport}
      />

      <MapPriceBox option={selectedOption} />

      <View style={styles.mapWrapper}>
        <RouteMap points={routePoints} center={center} polyline={polyline} />
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
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 16,
  },
  mapWrapper: {
    marginTop: 16,
  },
});
