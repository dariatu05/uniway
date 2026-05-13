import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../styles/colors';

export const RouteMap = ({ startLocation, endLocation }) => {
    const initialRegion = {
        latitude: 48.2082,
        longitude: 16.3738,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
            >
                {startLocation && (
                    <Marker
                        coordinate={startLocation}
                        title="Start"
                        pinColor={COLORS.primary}
                    />
                )}

                {endLocation && (
                    <Marker
                        coordinate={endLocation}
                        title="Ziel"
                        pinColor={COLORS.secondary}
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.accent,
        minHeight: 300,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});