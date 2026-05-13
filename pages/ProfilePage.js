import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';

export default function ProfilePage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil</Text>
            <Text>Benutzerprofil wird hier angezeigt</Text>
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
