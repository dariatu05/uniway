// SearchPage.js
// Kurzbeschreibung: Dieser Suchscreeen hat 4 Zustände:
// 1. Startbildschirm mit Suchleiste
// 2. Detaillierte Suche mit erweiterten Optionen
// 3. Preisanzeige in Kalenderform
// 4. Anzeige der Routen-Ergebnisse

// Externe Libraries
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Komponenten
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { BackButton, ScreenLayout } from "../components/CommonLayout";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { PageContainer } from "../components/PageContainer";
import { SettingRow } from "../components/SettingRow";

// Farben
import { COLORS } from "../styles/colors";

// API & Mock-Daten
import { getProfileSettings } from "../api/storageApi";
import { MOCK_CALENDAR_PRICES } from "../data/mockSearch";

// Person 3 — Ergebnisliste
import ResultsPage from "./ResultsPage";

import { TextInput } from "react-native";

// Kalender Konfiguration
LocaleConfig.locales["de"] = {
  monthNames: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  monthNamesShort: [
    "Jan.",
    "Feb.",
    "Mrz.",
    "Apr.",
    "Mai",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sept.",
    "Okt.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  today: "Heute",
};
LocaleConfig.defaultLocale = "de";

//clear button component for input fields

function ClearableInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor="#9ca3af"
          style={styles.clearableTextInput}
        />

        {value ? (
          <TouchableOpacity
            style={styles.insideClearButton}
            onPress={() => onChangeText("")}
            activeOpacity={0.7}
          >
            <Text style={styles.insideClearButtonText}>×</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default function SearchScreen() {
  const route = useRoute();

  // Zustandssteuerung
  const [showDetails, setShowDetails] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRouteResults, setShowRouteResults] = useState(false);

  // Speicher für Suchparameter
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [directOnly, setDirectOnly] = useState(false);
  const [selectedTransports, setSelectedTransports] = useState([]);
  const [stops, setStops] = useState([]);
  const [useDefaultBudget, setUseDefaultBudget] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [fuelDistance, setFuelDistance] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [useDefaultFuelPrice, setUseDefaultFuelPrice] = useState(false);
  const [fuelCost, setFuelCost] = useState(null);

  const addStop = () => setStops((prev) => [...prev, ""]);
  const updateStop = (index, value) =>
    setStops((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  const removeStop = (index) =>
    setStops((prev) => prev.filter((_, idx) => idx !== index));

  // Transportmittel Optionen
  const transports = ["Bus", "Train", "Car", "Plane"];
  const transportIcons = {
    Bus: "bus",
    Train: "train",
    Car: "car",
    Plane: "airplane",
  };

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
      setMaxBudget("");
    }
  };

  // Logik für Transportmittel-Auswahl
  const toggleTransport = (transport) => {
    setSelectedTransports((prev) =>
      prev.includes(transport)
        ? prev.filter((t) => t !== transport)
        : [...prev, transport],
    );
  };

  const handleUseDefaultFuelPrice = () => {
    const currentSettings = getProfileSettings();
    const defaultPrice = currentSettings.defaultFuelPrice ?? "";
    setUseDefaultFuelPrice(true);
    setFuelPrice(defaultPrice.toString());
    calculateFuelCost(fuelDistance, fuelConsumption, defaultPrice.toString());
  };

  // Automatische Spritkosten-Berechnung
  const calculateFuelCost = (distance, consumption, price) => {
    if (distance && consumption && price) {
      const cost =
        (parseFloat(distance) / 100) *
        parseFloat(consumption) *
        parseFloat(price);
      setFuelCost(cost.toFixed(2));
    } else {
      setFuelCost(null);
    }
  };

  // Berechnung bei Änderung der Eingabefelder
  const handleDistanceChange = (value) => {
    setFuelDistance(value);
    calculateFuelCost(value, fuelConsumption, fuelPrice);
  };

  const handleConsumptionChange = (value) => {
    setFuelConsumption(value);
    calculateFuelCost(fuelDistance, value, fuelPrice);
  };

  const handleFuelPriceChange = (value) => {
    setFuelPrice(value);
    calculateFuelCost(fuelDistance, fuelConsumption, value);
  };

  const clearSearchFields = () => {
    setPassengers("1");
    setStartLocation("");
    setDestination("");
    setDateFrom("");
    setDateTo("");
    setMaxBudget("");
    setDirectOnly(false);
    setSelectedTransports([]);
    setStops([]);
    setUseDefaultBudget(false);
    setSelectedDate("");
    setFuelDistance("");
    setFuelConsumption("");
    setFuelPrice("");
    setUseDefaultFuelPrice(false);
    setFuelCost(null);
  };

  const resetSearchInputs = () => {
    setShowDetails(false);
    setShowCalendar(false);
    setShowRouteResults(false);

    setPassengers("1");
    setStartLocation("");
    setDestination("");
    setDateFrom("");
    setDateTo("");
    setMaxBudget("");
    setDirectOnly(false);
    setSelectedTransports([]);
    setStops([]);
    setUseDefaultBudget(false);
    setSelectedDate("");
    setFuelDistance("");
    setFuelConsumption("");
    setFuelPrice("");
    setUseDefaultFuelPrice(false);
    setFuelCost(null);
  };

  useEffect(() => {
    if (route.params?.resetSearch) {
      resetSearchInputs();
    }
  }, [route.params?.resetSearch]);

  // Hilfsfunktion für Preisfarben im Kalender
  const getPriceColor = (level) => {
    if (level === "cheap") return "#76943C";
    if (level === "medium") return "#D4A017";
    if (level === "expensive") return "#A52A2A";
    return "#999";
  };

  return (
    <View style={styles.page}>
      {/* ZUSTAND 1: Startseite */}
      {!showDetails && !showCalendar && !showRouteResults && (
        <PageContainer>
          <View style={styles.homeContainer}>
            <Header
              title="UniWay"
              subtitle="Multifunctional travel planner for students"
            />
            <TouchableOpacity
              style={styles.searchBar}
              onPress={() => setShowDetails(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.placeholderText}>
                Where do you want to go?
              </Text>
            </TouchableOpacity>
          </View>
        </PageContainer>
      )}

      {/* ZUSTAND 2: Detaillierte Suche */}
      {showDetails && !showCalendar && !showRouteResults && (
        <ScreenLayout>
          <BackButton onPress={onBackPress} />
          <Header title="Search Trip" subtitle="Find the cheapest route" />
          <Card>
            <ClearableInput
              label="Start location"
              value={startLocation}
              onChangeText={setStartLocation}
              placeholder="Enter start location"
            />
            <TouchableOpacity
              onPress={handleUseProfileLocation}
              style={styles.profileLocationLink}
            >
              <Text style={styles.profileLocationText}>
                <MaterialCommunityIcons name="map-marker" size={12} /> Use
                profile location
              </Text>
            </TouchableOpacity>
            <View style={styles.fieldGroup}>
              <View style={styles.stopHeaderRow}>
                <Text style={styles.customLabel}>Stopovers</Text>
                <TouchableOpacity onPress={addStop} activeOpacity={0.8}>
                  <Text style={styles.addStopText}>+ Add stopover</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.infoNote}>
                Optional: Add stopovers between start and destination.
              </Text>
              {stops.map((stop, index) => (
                <View key={`stop-${index}`} style={styles.stopRow}>
                  <ClearableInput
                    label={`Stopover ${index + 1}`}
                    value={stop}
                    onChangeText={(text) => updateStop(index, text)}
                    placeholder="Enter location"
                  />

                  <TouchableOpacity
                    style={styles.removeStopButton}
                    onPress={() => removeStop(index)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.removeStopText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <ClearableInput
              label="Destination"
              value={destination}
              onChangeText={setDestination}
              placeholder="Enter destination"
            />
            <View style={styles.fieldGroup}>
              <Text style={styles.customLabel}>Time period (optional)</Text>
              <View style={styles.rowContainer}>
                <View style={styles.halfInput}>
                  <Input
                    label="From"
                    placeholder="DD.MM"
                    value={dateFrom}
                    onChangeText={(text) =>
                      setDateFrom(text.replace(/[^0-9.]/g, ""))
                    }
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="To"
                    placeholder="DD.MM"
                    value={dateTo}
                    onChangeText={(text) =>
                      setDateTo(text.replace(/[^0-9.]/g, ""))
                    }
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
            <SettingRow
              label="Use default budget"
              value={useDefaultBudget}
              onValueChange={handleToggleDefaultBudget}
            />
            <Input
              label="Max. Budget"
              value={maxBudget}
              onChangeText={setMaxBudget}
              keyboardType="numeric"
            />
            <Input
              label="Passengers"
              value={passengers}
              onChangeText={(text) =>
                setPassengers(text.replace(/[^0-9]/g, ""))
              }
              keyboardType="numeric"
            />
            <SettingRow
              label="Direct connections only"
              value={directOnly}
              onValueChange={setDirectOnly}
            />
            <View style={styles.fieldGroup}>
              <Text style={styles.customLabel}>Type of transport</Text>
              <Text style={styles.infoNote}>
                If none are selected, all transport types will be included.
              </Text>
              <View style={styles.transportContainer}>
                {transports.map((t) => {
                  const isActive = selectedTransports.includes(t);
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.transportOption,
                        isActive && styles.transportOptionActive,
                      ]}
                      onPress={() => toggleTransport(t)}
                    >
                      <MaterialCommunityIcons
                        name={transportIcons[t]}
                        size={20}
                        color={isActive ? "#FFFFFF" : COLORS.primary}
                      />
                      <Text
                        style={[
                          styles.transportText,
                          isActive && styles.transportTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* Fuel Cost Calculator - nur wenn Car ausgewählt ist */}
            {selectedTransports.includes("Car") && (
              <View style={styles.fieldGroup}>
                <Text style={styles.customLabel}>Fuel Cost Calculator</Text>
                <Input
                  label="Distance"
                  placeholder="Enter kilometers to be driven"
                  value={fuelDistance}
                  onChangeText={handleDistanceChange}
                  keyboardType="decimal-pad"
                />
                <Input
                  label="Fuel Consumption"
                  placeholder="Enter liters per 100 km"
                  value={fuelConsumption}
                  onChangeText={handleConsumptionChange}
                  keyboardType="decimal-pad"
                />
                <Input
                  label="Fuel Price"
                  placeholder="Enter price per liter (€)"
                  value={fuelPrice}
                  onChangeText={handleFuelPriceChange}
                  keyboardType="decimal-pad"
                  editable={!useDefaultFuelPrice}
                />
                <TouchableOpacity
                  onPress={handleUseDefaultFuelPrice}
                  style={styles.profileLocationLink}
                >
                  <Text style={styles.profileLocationText}>
                    <MaterialCommunityIcons name="fuel" size={12} /> Use default
                    fuel price
                  </Text>
                </TouchableOpacity>
                <View style={styles.fuelCostResult}>
                  {fuelCost ? (
                    <>
                      <Text style={styles.fuelCostLabel}>
                        Estimated Fuel Cost
                      </Text>
                      <Text style={styles.fuelCostValue}>€{fuelCost}</Text>
                    </>
                  ) : (
                    <Text style={styles.fuelCostPlaceholder}>
                      Please fill in all fields to calculate costs
                    </Text>
                  )}
                </View>
              </View>
            )}
            <View style={styles.mainActions}>
              <TouchableOpacity
                onPress={clearSearchFields}
                style={styles.resetTextButton}
              >
                <Text style={styles.resetText}>Clear all</Text>
              </TouchableOpacity>
              <Button
                title="Show prices in calendar"
                onPress={() => setShowCalendar(true)}
                variant="primary"
              />
            </View>
          </Card>
        </ScreenLayout>
      )}

      {/* ZUSTAND 3: Kalenderansicht */}
      {showCalendar && !showRouteResults && (
        <ScreenLayout>
          <BackButton onPress={onBackPress} />
          <Header
            title="Price Calendar"
            subtitle={`${startLocation || "Start"}${stops.filter(Boolean).length > 0 ? " → " + stops.filter(Boolean).join(" → ") + " → " : " ➔ "}${destination || "Destination"}`}
          />
          <Card>
            <Calendar
              firstDay={1}
              theme={{
                calendarBackground: "transparent",
                textSectionTitleColor: COLORS.primary,
                monthTextColor: COLORS.primary,
                arrowColor: COLORS.primary,
              }}
              dayComponent={({ date, state }) => {
                const dateString = date.dateString;
                const item = MOCK_CALENDAR_PRICES[dateString];
                const isSelected = selectedDate === dateString;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedDate(dateString)}
                    style={[styles.dayBox, isSelected && styles.selectedDayBox]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        state === "disabled"
                          ? { color: "#d1d5db" }
                          : { color: COLORS.text },
                      ]}
                    >
                      {date.day}
                    </Text>
                    {item && (
                      <Text
                        style={[
                          styles.priceText,
                          { color: getPriceColor(item.level) },
                        ]}
                      >
                        {item.price}€
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#76943C" }]} />
                <Text style={styles.legendText}>Cheap</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#D4A017" }]} />
                <Text style={styles.legendText}>Average</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#A52A2A" }]} />
                <Text style={styles.legendText}>Expensive</Text>
              </View>
            </View>
            <View style={styles.mainActions}>
              <Button
                title="Select date"
                variant={selectedDate ? "primary" : "secondary"}
                onPress={() => selectedDate && setShowRouteResults(true)}
              />
            </View>
          </Card>
        </ScreenLayout>
      )}

      {/* ZUSTAND 4: Ergebnisanzeige (Person 3) */}
      {showRouteResults && (
        <ResultsPage
          from={startLocation}
          to={destination}
          stops={stops.filter((stop) => stop.trim() !== "")}
          selectedDate={selectedDate}
          maxBudget={maxBudget}
          selectedTransports={selectedTransports}
          directOnly={directOnly}
          passengers={parseInt(passengers) || 1}
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
  homeContainer: { flex: 1, justifyContent: "center" },
  searchBar: {
    backgroundColor: COLORS.surface || "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginTop: 20,
  },
  placeholderText: { color: "#6b7280", fontSize: 16 },
  fieldGroup: { marginTop: 15, marginBottom: 10 },
  customLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text || "#333",
    marginBottom: 8,
  },
  infoNote: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 10,
    fontStyle: "italic",
  },
  stopHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addStopText: { color: COLORS.primary, fontWeight: "700", fontSize: 13 },
  stopRow: { marginBottom: 12 },
  removeStopButton: {
    alignSelf: "flex-end",
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
  },
  removeStopText: { color: "#B91C1C", fontSize: 12, fontWeight: "700" },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfInput: { flex: 1 },
  transportContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  transportOption: {
    width: "48%",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  transportOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  transportText: { fontSize: 13, fontWeight: "500", color: COLORS.text },
  transportTextActive: { color: "#fff" },
  mainActions: { marginTop: 0 },
  profileLocationLink: { marginTop: -10, paddingVertical: 5 },
  profileLocationText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  dayBox: {
    width: 45,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  selectedDayBox: { borderColor: COLORS.primary, borderWidth: 2 },
  dayText: { fontSize: 15, fontWeight: "600" },
  priceText: { fontSize: 11, fontWeight: "bold", marginTop: 2 },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 15,
    gap: 15,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, color: "#4b5563", fontWeight: "500" },
  calculateButton: { marginTop: 10 },
  fuelCostResult: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#F0F9FF",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  fuelCostLabel: {
    fontSize: 12,
    color: "#0369A1",
    fontWeight: "500",
    marginBottom: 4,
  },
  fuelCostValue: { fontSize: 24, fontWeight: "700", color: COLORS.primary },
  fuelCostPlaceholder: {
    fontSize: 13,
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
  },
  inputBlock: {
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },

  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  clearableTextInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 42,
    fontSize: 15,
    color: COLORS.text,
  },

  insideClearButton: {
    position: "absolute",
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  insideClearButtonText: {
    color: "#6B7280",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 22,
  },

  resetTextButton: {
    alignSelf: "center",
    paddingVertical: 6,
  },

  resetText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});
