import { StyleSheet, View } from 'react-native';
import { COLORS } from '../styles/colors';

export const Card = ({ children }) => (
    <View style={styles.card}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    }
});