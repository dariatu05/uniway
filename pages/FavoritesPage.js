import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';

export default function FavoritesPage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favoriten</Text>
            <Text>Noch keine Favoriten gespeichert</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    },
});
