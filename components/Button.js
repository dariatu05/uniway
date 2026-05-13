import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';

export const Button = ({ title, onPress, variant = 'primary' }) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: isPrimary ? COLORS.primary : COLORS.secondary }
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[
                styles.text,
                { color: isPrimary ? COLORS.surface : COLORS.text }
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});