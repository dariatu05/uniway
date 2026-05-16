import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        padding: 24,
        backgroundColor: COLORS.background,
    },
});