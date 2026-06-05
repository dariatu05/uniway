import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../styles/colors';

export const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    editable = true,
}) => (
    <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#999999"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            editable={editable}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: COLORS.text,
    }
});