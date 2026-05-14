// Kurzbeschreibung: Dieser Suchscreeen hat 3 Zustände:
// 1. Startbildschirm mit Suchleiste - führt zur detaillierten Suche
// 2. Detaillierte Suche mit erweiterten Optionen
// 3. Suchergebnisse in Kalenderform

// Externe Libraries
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Komponenten
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { PageContainer } from '../components/PageContainer';
import { SettingRow } from '../components/SettingRow';

// Farben
import { COLORS } from '../styles/colors';

// Mock-Daten
import { MOCK_CALENDAR_PRICES } from '../data/SearchScreenMockData';

// Importiere globale Variable aus ProfilePage
import { SHARED_DATA } from './ProfilePage';

export default function SearchScreen() {
    // später entfernen, wenn echte Daten geladen werden:
    console.log("Daten geladen:", MOCK_CALENDAR_PRICES);

    // Zustandssteuerung
    const [showDetails, setShowDetails] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false); 

    // Speicher für Suchparameter
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [dateOrRange, setDateOrRange] = useState('');
    const [roundTrip, setRoundTrip] = useState(false);
    const [maxBudget, setMaxBudget] = useState('');
    const [selectedTransports, setSelectedTransports] = useState([]);
    const [useDefaultBudget, setUseDefaultBudget] = useState(false);

    // Transportmöglichkeiten und Icons
    const transports = ['Bus', 'Zug', 'Auto', 'Flug'];
    const transportIcons = {
        'Bus': 'bus',
        'Zug': 'train',
        'Auto': 'car',
        'Flug': 'airplane'
    };

    const handleUseProfileLocation = () => {
        setStartLocation(SHARED_DATA.startort);
    };

    // Funktion zum Umschalten des Standardbudgets
    const handleToggleDefaultBudget = (value) => {
        setUseDefaultBudget(value);
        if (value) {
            // Übernimmt das Budget direkt aus den ProfilePage-Vorgaben
            setMaxBudget(SHARED_DATA.budget);
        } else {
            setMaxBudget('');
        }
    };

    const toggleTransport = (transport) => {
        setSelectedTransports(prev =>
            prev.includes(transport) ? prev.filter(t => t !== transport) : [...prev, transport]
        );
    };

    const onSearchBarPress = () => setShowDetails(true);
    
    const onBackPress = () => {
        if (showCalendar) {
            setShowCalendar(false);
        } else {
            setShowDetails(false);
        }
    };

    const onSubmit = () => {
        console.log('Suche gestartet mit:', { startLocation, destination, dateOrRange, roundTrip, maxBudget, selectedTransports });
        setShowCalendar(true);
    };

    return (
        <PageContainer>
            {/* ZUSTAND 1: Startbildschirm */}
            {!showDetails && !showCalendar && (
                <View style={styles.homeContainer}>
                    <Header 
                        title="UniWay" 
                        subtitle="Multifunktionaler Reiseplaner für Studierende" 
                    />
                    <TouchableOpacity style={styles.searchBar} onPress={onSearchBarPress} activeOpacity={0.8}>
                        <Text style={styles.placeholderText}>Wohin möchten Sie reisen?</Text>
                    </TouchableOpacity>
                    <Text style={styles.hintText}>Tippen Sie oben, um Details einzugeben.</Text>
                </View>
            )}

            {/* ZUSTAND 2: Detaillierte Suche */}
            {showDetails && !showCalendar && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Header 
                        title="Reise suchen" 
                        subtitle="Finde die günstigste Route für dein Budget" 
                    />

                    <Card>
                    <View style={{ marginBottom: 15 }}>
                                        <Input 
                                            label="Startort" 
                                            placeholder="z.B. Wien" 
                                            value={startLocation} 
                                            onChangeText={setStartLocation} 
                                        />
                                        
                                        {/* Logik: Nur anzeigen, wenn im Profil die Freigabe aktiv ist */}
                                        {SHARED_DATA.isLocationEnabled && (
                                            <TouchableOpacity 
                                                onPress={handleUseProfileLocation}
                                                style={{ marginTop: -10, paddingVertical: 5 }}
                                            >
                                                <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '600' }}>
                                                    <MaterialCommunityIcons name="map-marker" size={12} /> Profil-Standort nutzen ({SHARED_DATA.startort})
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                        
                        <Input 
                            label="Zielort" 
                            placeholder="z.B. Berlin" 
                            value={destination} 
                            onChangeText={setDestination} 
                        />

                        <Input 
                            label="Datum / Zeitraum (optional)" 
                            placeholder="z. B. Juni 2026" 
                            value={dateOrRange} 
                            onChangeText={setDateOrRange} 
                        />

                        {/* Toggle für Hin- und Rückreise */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.customLabel}>Reiseart</Text>
                            <Button 
                                title={roundTrip ? 'Rückreise gewünscht' : 'Nur Hinfahrt'} 
                                variant={roundTrip ? 'primary' : 'secondary'}
                                onPress={() => setRoundTrip(!roundTrip)}
                            />
                        </View>

                        {/* 1. Standardbudget Switch platziert VOR Max. Budget */}
                        <SettingRow 
                            label="Standardbudget übernehmen?" 
                            value={useDefaultBudget} 
                            onValueChange={handleToggleDefaultBudget} 
                        />

                        <Input 
                            label="Max. Budget (optional)" 
                            placeholder="z.B. 500 EUR" 
                            value={maxBudget} 
                            onChangeText={(text) => {
                                setMaxBudget(text);
                                if (useDefaultBudget) setUseDefaultBudget(false);
                            }}
                            keyboardType="numeric"
                        />

                        {/* Transportmöglichkeiten mit Icons */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.customLabel}>Transportmittel</Text>
                            <View style={styles.transportContainer}>
                                {transports.map(transport => {
                                    const isActive = selectedTransports.includes(transport) || selectedTransports.length === 0;
                                    return (
                                        <TouchableOpacity
                                            key={transport}
                                            style={[styles.transportOption, isActive && styles.transportOptionActive]}
                                            onPress={() => toggleTransport(transport)}
                                        >
                                            <MaterialCommunityIcons 
                                                name={transportIcons[transport]} 
                                                size={24} 
                                                color={isActive ? '#FFFFFF' : COLORS.primary} 
                                            />
                                            <Text style={[styles.transportText, isActive && styles.transportTextActive]}>
                                                {transport}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.mainActions}>
                            <Button 
                                title="Verbindungen suchen" 
                                onPress={onSubmit} 
                                variant="primary" 
                            />
                        </View>
                    </Card>

                    <View style={styles.secondaryAction}>
                        <Button 
                            title="Zurück" 
                            onPress={onBackPress} 
                            variant="secondary" 
                        />
                    </View>
                </ScrollView>
            )}

            {/* ZUSTAND 3: Kalenderansicht */}
            {showCalendar && (
                <View>
                    <Header title="Günstigste Preise" subtitle="Wähle den besten Tag für deine Reise" />
                    <Card>
                        <Text style={styles.hintText}>Hier wird dein Preis-Kalender angezeigt.</Text>
                        <View style={styles.mainActions}>
                            <Button title="Neue Suche" variant="secondary" onPress={onBackPress} />
                        </View>
                    </Card>
                </View>
            )}
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    searchBar: {
        backgroundColor: COLORS.surface || '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginTop: 20,
    },
    placeholderText: {
        color: '#6b7280',
        fontSize: 16,
    },
    hintText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#6b7280',
    },
    fieldGroup: {
        marginTop: 15,
        marginBottom: 10,
    },
    customLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text || '#333',
        marginBottom: 8,
    },
    transportContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    transportOption: {
        width: '48%',
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    transportOptionActive: {
        backgroundColor: COLORS.primary || '#5B5FDE',
        borderColor: COLORS.primary || '#5B5FDE',
    },
    transportText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
    },
    transportTextActive: {
        color: '#fff',
    },
    mainActions: {
        marginTop: 20,
    },
    secondaryAction: {
        marginTop: 15,
        marginBottom: 30,
    }
});