import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { PageContainer } from '../components/PageContainer';
import { TransportBadge } from '../components/TransportBadge';
import { COLORS } from '../styles/colors';

// Testdaten fuer gespeicherte Routen (in Zukunft von API oder lokalem Speicher)
const SAVED_ROUTES = [
    {
        id: '1',
        from: 'Wien',
        to: 'Prag',
        price: '15 EUR',
        duration: '4h 00m',
        type: 'bus'
    },
    {
        id: '2',
        from: 'Salzburg',
        to: 'München',
        price: '19 EUR',
        duration: '1h 30m',
        type: 'train'
    }
];

export default function FavoritesPage() {

    const renderRoute = ({ item }) => (
        <Card>
            <View style={styles.routeHeader}>
                <TransportBadge type={item.type} />
                <Text style={styles.price}>{item.price}</Text>
            </View>

            <Text style={styles.routeTitle}>{item.from} - {item.to}</Text>
            <Text style={styles.duration}>Dauer: {item.duration}</Text>

            <View style={styles.actions}>
                <Button
                    title="Details"
                    onPress={() => console.log('Open details')}
                    variant="secondary"
                />
            </View>
        </Card>
    );

    return (
        <PageContainer>
            <Header
                title="Favoriten"
                subtitle="Deine gespeicherten Reisen"
            />

            {SAVED_ROUTES.length > 0 ? (
                <FlatList
                    data={SAVED_ROUTES}
                    renderItem={renderRoute}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Noch keine Favoriten gespeichert.</Text>
                </View>
            )}
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    routeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    routeTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 5,
    },
    duration: {
        fontSize: 14,
        color: COLORS.text,
        opacity: 0.6,
        marginBottom: 15,
    },
    actions: {
        marginTop: 5,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.text,
        opacity: 0.5,
        fontSize: 16,
    }
});