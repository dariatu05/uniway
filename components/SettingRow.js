import { StyleSheet, Switch, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';

export const SettingRow = ({ label, value, onValueChange }) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <Switch
            trackColor={{ false: COLORS.gray, true: COLORS.secondary }}
            thumbColor={COLORS.surface}
            value={value}
            onValueChange={onValueChange}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.accent,
    },
    label: {
        fontSize: 16,
        color: COLORS.text,
    }
});