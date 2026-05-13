import { StyleSheet, View } from 'react-native';
import { COLORS } from '../styles/colors';

export const Divider = () => (
    <View style={styles.line} />
);

const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: COLORS.accent,
        width: '100%',
        marginVertical: 15,
    }
});