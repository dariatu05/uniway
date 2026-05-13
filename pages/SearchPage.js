import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { PageContainer } from '../components/PageContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function SearchPage() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = () => {
        console.log('Suche nach Route:', from, '->', to, 'auf Datum:', date);
    };

    return (
        <PageContainer>
            <Header 
                title="Reise suchen" 
                subtitle="Finde die günstigste Route für dein Budget" 
            />

            <Card>
                <Input 
                    label="Startort" 
                    placeholder="z.B. Wien" 
                    value={from} 
                    onChangeText={setFrom} 
                />
                
                <Input 
                    label="Zielort" 
                    placeholder="z.B. Berlin" 
                    value={to} 
                    onChangeText={setTo} 
                />

                <Input 
                    label="Datum" 
                    placeholder="TT.MM.JJJJ" 
                    value={date} 
                    onChangeText={setDate} 
                />

                <View style={styles.buttonWrapper}>
                    <Button 
                        title="Verbindungen suchen" 
                        onPress={handleSearch} 
                        variant="primary" 
                    />
                </View>
            </Card>
            
            <View style={styles.secondaryAction}>
                <Button 
                    title="Letzte Suchen anzeigen" 
                    onPress={() => console.log('История')} 
                    variant="secondary" 
                />
            </View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        marginTop: 10,
    },
    secondaryAction: {
        marginTop: 20,
    }
});