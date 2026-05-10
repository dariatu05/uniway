import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/theme';

export default function RouteScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mehrere Reisepunkte</Text>
            <Text>Text</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    title: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold' }
});
