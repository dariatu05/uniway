import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { COLORS } from "../../styles/colors";
export default function RouteMap({ points = [], center, polyline = [] }) {
  const initialRegion = {
    latitude: center?.[0] || 48.2082,
    longitude: center?.[1] || 16.3738,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  const lineCoordinates = polyline.map(([lat, lon]) => ({
    latitude: lat,
    longitude: lon,
  }));

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {points.map((point, index) => (
          <Marker
            key={`${point.name}-${index}`}
            coordinate={{
              latitude: point.lat,
              longitude: point.lon,
            }}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}

        {lineCoordinates.length > 1 && (
          <Polyline
            coordinates={lineCoordinates}
            strokeColor={COLORS.secondary}
            strokeWidth={5}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 420,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  markerText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
