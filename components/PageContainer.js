import { SafeAreaView, StyleSheet, View } from 'react-native';
import { COLORS } from '../styles/colors';

export const PageContainer = ({ children }) => (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            {children}
        </View>
    </SafeAreaView>
);


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
    }
});