// Kurzbeschreibung: Dieser Suchscreeen hat 4 Zustände:
// 1. Startbildschirm mit Suchleiste
// 2. Detaillierte Suche mit erweiterten Optionen
// 3. Preisanzeige in Kalenderform
// 4. Anzeige der Routen-Ergebnisse

// Externe Libraries
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Komponenten
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { PageContainer } from '../components/PageContainer';
import { SettingRow } from '../components/SettingRow';

// Farben
import { COLORS } from '../styles/colors';

// API & Mock-Daten
import { getProfileSettings } from '../api/storageApi';
import { MOCK_CALENDAR_PRICES } from '../data/SearchScreenMockData';

// Person 3 — Ergebnisliste
import ResultsPage from './ResultsPage';

// Kalender Konfiguration
LocaleConfig.locales['de'] = {
    monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthNamesShort: ['Jan.', 'Feb.', 'Mrz.', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
    dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    today: 'Heute'
};
LocaleConfig.defaultLocale = 'de';

export default function SearchScreen() {
    // Zustandssteuerung
    const [showDetails, setShowDetails] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showRouteResults, setShowRouteResults] = useState(false);

    // Speicher für Suchparameter
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [directOnly, setDirectOnly] = useState(false);
    const [selectedTransports, setSelectedTransports] = useState([]);
    const [stops, setStops] = useState([]);
    const [useDefaultBudget, setUseDefaultBudget] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const addStop = () => setStops(prev => [...prev, '']);
    const updateStop = (index, value) => setStops(prev => prev.map((item, idx) => idx === index ? value : item));
    const removeStop = (index) => setStops(prev => prev.filter((_, idx) => idx !== index));

    // Transportmittel Optionen
    const transports = ['Bus', 'Zug', 'Auto', 'Flugzeug'];
    const transportIcons = { 'Bus': 'bus', 'Zug': 'train', 'Auto': 'car', 'Flugzeug': 'airplane' };

    // Logik für Zurück-Button
    const onBackPress = () => {
        if (showRouteResults) {
            setShowRouteResults(false);
            setShowCalendar(true);
        } else if (showCalendar) {
            setShowCalendar(false);
            setShowDetails(true);
        } else if (showDetails) {
            setShowDetails(false);
        }
    };

    // Hilfsfunktion, um den Profil-Standort live zu übernehmen
    const handleUseProfileLocation = () => {
        const currentSettings = getProfileSettings();
        if (currentSettings.defaultLocation) {
            setStartLocation(currentSettings.defaultLocation);
        }
    };

    // Hilfsfunktion, um das Standard-Budget live aus der API zu holen
    const handleToggleDefaultBudget = (value) => {
        setUseDefaultBudget(value);
        if (value) {
            const currentSettings = getProfileSettings();
            // Nutzt den aktuellen Wert aus der storageApi (standardBudget)
            setMaxBudget(currentSettings.standardBudget.toString());
        } else {
            setMaxBudget('');
        }
    };

    // Logik für Transportmittel-Auswahl
    const toggleTransport = (transport) => {
        setSelectedTransports(prev =>
            prev.includes(transport) ? prev.filter(t => t !== transport) : [...prev, transport]
        );
    };

    const resetSearchInputs = () => {
        setStartLocation('');
        setDestination('');
        setDateFrom('');
        setDateTo('');
        setMaxBudget('');
        setDirectOnly(false);
        setSelectedTransports([]);
        setStops([]);
        setUseDefaultBudget(false);
        setSelectedDate('');
    };

    // Hilfsfunktion für Preisfarben im Kalender
    const getPriceColor = (level) => {
        if (level === 'cheap') return '#76943C';
        if (level === 'medium') return '#D4A017';
        if (level === 'expensive') return '#A52A2A';
        return '#999';
    };

    // Komponente für den Zurück-Link
    const BackLink = () => (
        <TouchableOpacity style={styles.backLink} onPress={onBackPress}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={COLORS.primary} />
            <Text style={styles.backLinkText}>Zurück</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.page}>
            {/* ZUSTAND 1: Startseite */}
            {!showDetails && !showCalendar && !showRouteResults && (
                <PageContainer>
                <View style={styles.homeContainer}>
                    <Header title="UniWay" subtitle="Multifunktionaler Reiseplaner für Studierende" />
                    <TouchableOpacity style={styles.searchBar} onPress={() => setShowDetails(true)} activeOpacity={0.8}>
                        <Text style={styles.placeholderText}>Wohin möchten Sie reisen?</Text>
                    </TouchableOpacity>
                </View>
                </PageContainer>
            )}

            {/* ZUSTAND 2: Detaillierte Suche */}
            {showDetails && !showCalendar && !showRouteResults && (
                <ScrollView ScrollView style={styles.page} contentContainerStyle={styles.content}>
                    <BackLink />
                    <Header title="Reise suchen" subtitle="Finde die günstigste Route" />
                    <Card>
                        <Input label="Startort" value={startLocation} onChangeText={setStartLocation} />
                        <TouchableOpacity onPress={handleUseProfileLocation} style={styles.profileLocationLink}>
                            <Text style={styles.profileLocationText}>
                                <MaterialCommunityIcons name="map-marker" size={12} /> Profil-Standort nutzen
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.fieldGroup}>
                            <View style={styles.stopHeaderRow}>
                                <Text style={styles.customLabel}>Zwischenstopps</Text>
                                <TouchableOpacity onPress={addStop} activeOpacity={0.8}>
                                    <Text style={styles.addStopText}>+ Stop hinzufügen</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.infoNote}>Optional: Füge Zwischenstopps zwischen Start und Ziel hinzu.</Text>
                            {stops.map((stop, index) => (
                                <View key={`stop-${index}`} style={styles.stopRow}>
                                    <Input
                                        label={`Zwischenstopp ${index + 1}`}
                                        value={stop}
                                        onChangeText={(text) => updateStop(index, text)}
                                        placeholder="Ort eingeben"
                                    />
                                    <TouchableOpacity style={styles.removeStopButton} onPress={() => removeStop(index)} activeOpacity={0.8}>
                                        <Text style={styles.removeStopText}>Entfernen</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <Input label="Zielort" value={destination} onChangeText={setDestination} />

                        <View style={styles.fieldGroup}>
                            <Text style={styles.customLabel}>Zeitraum (optional)</Text>
                            <View style={styles.rowContainer}>
                                <View style={styles.halfInput}>
                                    <Input
                                        label="Von"
                                        placeholder="TT.MM"
                                        value={dateFrom}
                                        onChangeText={(text) => setDateFrom(text.replace(/[^0-9.]/g, ''))}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                                <View style={styles.halfInput}>
                                    <Input
                                        label="Bis"
                                        placeholder="TT.MM"
                                        value={dateTo}
                                        onChangeText={(text) => setDateTo(text.replace(/[^0-9.]/g, ''))}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                            </View>
                        </View>

                        <SettingRow label="Standardbudget übernehmen" value={useDefaultBudget} onValueChange={handleToggleDefaultBudget} />
                        <Input label="Max. Budget" value={maxBudget} onChangeText={setMaxBudget} keyboardType="numeric" />

                        <SettingRow
                            label="Nur Direktverbindungen"
                            value={directOnly}
                            onValueChange={setDirectOnly}
                        />

                        <View style={styles.fieldGroup}>
                            <Text style={styles.customLabel}>Transportmittel</Text>
                            <Text style={styles.infoNote}>Wenn nichts ausgewählt ist, werden alle übernommen.</Text>
                            <View style={styles.transportContainer}>
                                {transports.map(t => {
                                    const isActive = selectedTransports.includes(t);
                                    return (
                                        <TouchableOpacity key={t} style={[styles.transportOption, isActive && styles.transportOptionActive]} onPress={() => toggleTransport(t)}>
                                            <MaterialCommunityIcons name={transportIcons[t]} size={20} color={isActive ? '#FFFFFF' : COLORS.primary} />
                                            <Text style={[styles.transportText, isActive && styles.transportTextActive]}>{t}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.mainActions}>
                            <Button title="Zurücksetzen" onPress={resetSearchInputs} variant="secondary" />
                            <Button title="Preise im Kalender anzeigen" onPress={() => setShowCalendar(true)} variant="primary" />
                        </View>
                    </Card>
                </ScrollView>
            )}

            {/* ZUSTAND 3: Kalenderansicht */}
            {showCalendar && !showRouteResults && (
                <ScrollView style={styles.page} contentContainerStyle={styles.content}>
                    <BackLink />
                    <Header
                        title="Preis-Kalender"
                        subtitle={`${startLocation || 'Start'}${stops.filter(Boolean).length > 0 ? ' → ' + stops.filter(Boolean).join(' → ') + ' → ' : ' ➔ '}${destination || 'Ziel'}`}
                    />
                    <Card>
                        <Calendar
                            firstDay={1}
                            theme={{ calendarBackground: 'transparent', textSectionTitleColor: COLORS.primary, monthTextColor: COLORS.primary, arrowColor: COLORS.primary }}
                            dayComponent={({ date, state }) => {
                                const dateString = date.dateString;
                                const item = MOCK_CALENDAR_PRICES[dateString];
                                const isSelected = selectedDate === dateString;
                                return (
                                    <TouchableOpacity onPress={() => setSelectedDate(dateString)} style={[styles.dayBox, isSelected && styles.selectedDayBox]}>
                                        <Text style={[styles.dayText, state === 'disabled' ? { color: '#d1d5db' } : { color: COLORS.text }]}>{date.day}</Text>
                                        {item && <Text style={[styles.priceText, { color: getPriceColor(item.level) }]}>{item.price}€</Text>}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <View style={styles.legendContainer}>
                            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#76943C' }]} /><Text style={styles.legendText}>Günstig</Text></View>
                            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#D4A017' }]} /><Text style={styles.legendText}>Mittel</Text></View>
                            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#A52A2A' }]} /><Text style={styles.legendText}>Teuer</Text></View>
                        </View>
                        <View style={styles.mainActions}>
                            <Button title="Tag auswählen" variant={selectedDate ? "primary" : "secondary"} onPress={() => selectedDate && setShowRouteResults(true)} />
                        </View>
                    </Card>
                </ScrollView>
            )}

            {/* ZUSTAND 4: Ergebnisanzeige (Person 3) */}
            {showRouteResults && (
                <ResultsPage
                    from={startLocation}
                    to={destination}
                    stops={stops.filter(stop => stop.trim() !== '')}
                    selectedDate={selectedDate}
                    maxBudget={maxBudget}
                    selectedTransports={selectedTransports}
                    directOnly={directOnly}
                    onBack={onBackPress}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 24,
        paddingBottom: 80,
    },
    homeContainer: { flex: 1, justifyContent: 'center' },
    backLink: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: -5 },
    backLinkText: { color: COLORS.primary, fontWeight: '600', fontSize: 16 },
    searchBar: { backgroundColor: COLORS.surface || '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#d1d5db', marginTop: 20 },
    placeholderText: { color: '#6b7280', fontSize: 16 },
    fieldGroup: { marginTop: 15, marginBottom: 10 },
    customLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text || '#333', marginBottom: 8 },
    infoNote: { fontSize: 12, color: '#6b7280', marginBottom: 10, fontStyle: 'italic' },
    stopHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    addStopText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
    stopRow: { marginBottom: 12 },
    removeStopButton: { alignSelf: 'flex-end', marginTop: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#FEE2E2' },
    removeStopText: { color: '#B91C1C', fontSize: 12, fontWeight: '700' },
    rowContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    halfInput: { flex: 1 },
    transportContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
    transportOption: { width: '48%', backgroundColor: '#f3f4f6', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderColor: '#e5e7eb' },
    transportOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    transportText: { fontSize: 13, fontWeight: '500', color: COLORS.text },
    transportTextActive: { color: '#fff' },
    mainActions: { marginTop: 20 },
    profileLocationLink: { marginTop: -10, paddingVertical: 5 },
    profileLocationText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
    dayBox: { width: 45, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
    selectedDayBox: { borderColor: COLORS.primary, borderWidth: 2 },
    dayText: { fontSize: 15, fontWeight: '600' },
    priceText: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
    legendContainer: { flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 15, gap: 15 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 12, height: 12, borderRadius: 6 },
    legendText: { fontSize: 13, color: '#4b5563', fontWeight: '500' }
});