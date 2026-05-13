import { StyleSheet, View } from 'react-native';

import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { RouteMap } from '../components/RouteMap';

export default function MapPage() {
    return (
        <PageContainer>
            <Header title="Karte" subtitle="Finde Routen in deiner Umgebung" />

            <View style={styles.mapWrapper}>
                <RouteMap />
            </View>

        </PageContainer>
    );
}

const styles = StyleSheet.create({
    mapWrapper: {
        flex: 1,
        marginTop: 10,
    }
});