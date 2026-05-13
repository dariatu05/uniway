import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';

export const FilterChip = ({ label, isSelected, onPress }) => (
    <TouchableOpacity
        style={[
            styles.chip,
            { backgroundColor: isSelected ? COLORS.primary : COLORS.background }
        ]}
        onPress={onPress}
    >
        <Text style={[
            styles.text,
            { color: isSelected ? COLORS.surface : COLORS.text }
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginRight: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
    }
});