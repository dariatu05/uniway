import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Divider } from '../components/Divider';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { PageContainer } from '../components/PageContainer';
import { SettingRow } from '../components/SettingRow';

export default function ProfilePage() {
    // Zustandsvariablen für Profilinformationen und Einstellungen
    const [name, setName] = useState('Max Mustermann');
    const [startort, setStartort] = useState('Wien');
    const [budget, setBudget] = useState('150');

    const [isLocationEnabled, setIsLocationEnabled] = useState(true);
    const [isPushEnabled, setIsPushEnabled] = useState(false);

    const handleSave = () => {
        console.log('Profil gespeichert:', { name, startort, budget, isLocationEnabled, isPushEnabled });
    };

    return (
        <PageContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header title="Profil" subtitle="Verwalte deine Einstellungen" />

                <Card>
                    <Input
                        label="Name"
                        placeholder="Dein Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        label="Standard-Startort"
                        placeholder="z.B. Wien"
                        value={startort}
                        onChangeText={setStartort}
                    />
                    <Input
                        label="Standardbudget (€)"
                        placeholder="z.B. 100"
                        value={budget}
                        onChangeText={setBudget}
                    />
                </Card>

                <Card>
                    <SettingRow
                        label="Standortfreigabe"
                        value={isLocationEnabled}
                        onValueChange={setIsLocationEnabled}
                    />

                    <Divider />

                    <SettingRow
                        label="Push-Benachrichtigungen"
                        value={isPushEnabled}
                        onValueChange={setIsPushEnabled}
                    />
                </Card>

                <View style={styles.buttonWrapper}>
                    <Button
                        title="Einstellungen speichern"
                        onPress={handleSave}
                        variant="primary"
                    />
                </View>

                <View style={styles.logoutWrapper}>
                    <Button
                        title="Abmelden"
                        onPress={() => console.log('Logout')}
                        variant="secondary"
                    />
                </View>
            </ScrollView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        marginTop: 20,
        marginBottom: 10,
    },
    logoutWrapper: {
        marginBottom: 30,
    }
});