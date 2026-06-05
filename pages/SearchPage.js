// SearchPage.js
// Kurzbeschreibung: Dieser Suchscreeen hat 4 Zustände:
// 1. Startbildschirm mit Suchleiste
// 2. Detaillierte Suche mit erweiterten Optionen
// 3. Preisanzeige in Kalenderform
// 4. Anzeige der Routen-Ergebnisse
// M4 update: date picker calendar added to form (State 2)

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { BackButton, ScreenLayout } from "../components/CommonLayout";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { PageContainer } from "../components/PageContainer";
import { SettingRow } from "../components/SettingRow";

import { COLORS } from "../styles/colors";
import { getProfileSettings } from "../api/storageApi";
import { MOCK_CALENDAR_PRICES } from "../data/mockSearch";
import ResultsPage from "./ResultsPage";

LocaleConfig.locales["de"] = {
  monthNames: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
  monthNamesShort: ["Jan.","Feb.","Mrz.","Apr.","Mai","Jun.","Jul.","Aug.","Sept.","Okt.","Nov.","Dez."],
  dayNames: ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
  dayNamesShort: ["So","Mo","Di","Mi","Do","Fr","Sa"],
  today: "Heute",
};
LocaleConfig.defaultLocale = "de";

// Format ISO date - DD.MM.YYYY
function formatDateDisplay(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

// Clearable text input with × button
function ClearableInput({ label, value, onChangeText, placeholder, keyboardType }) {
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
          <TouchableOpacity style={styles.insideClearButton} onPress={() => onChangeText("")} activeOpacity={0.7}>
            <Text style={styles.insideClearButtonText}>×</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

// M4: tappable date button that opens calendar picker modal
function DatePickerButton({ label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.datePickerButton} onPress={onPress} activeOpacity={0.8}>
      <MaterialCommunityIcons name="calendar" size={16} color={COLORS.primary} />
      <View style={styles.datePickerContent}>
        <Text style={styles.datePickerLabel}>{label}</Text>
        <Text style={[styles.datePickerValue, !value && styles.datePickerPlaceholder]}>
          {value ? formatDateDisplay(value) : "Select date"}
        </Text>
      </View>
      {value
        ? <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.secondary} />
        : <MaterialCommunityIcons name="chevron-right" size={16} color="#9ca3af" />
      }
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const route = useRoute();

  // Screen state
  const [showDetails,      setShowDetails]      = useState(false);
  const [showCalendar,     setShowCalendar]      = useState(false);
  const [showRouteResults, setShowRouteResults]  = useState(false);

  // M4: which date field is being picked ('departure' | 'return' | null)
  const [pickerTarget, setPickerTarget] = useState(null);

  // Search params
  const [startLocation,      setStartLocation]      = useState("");
  const [destination,        setDestination]        = useState("");
  const [isRoundTrip,        setIsRoundTrip]        = useState(false);
  const [dateFrom,           setDateFrom]           = useState(""); // ISO
  const [returnDateFrom,     setReturnDateFrom]     = useState(""); // ISO
  const [maxBudget,          setMaxBudget]          = useState("");
  const [passengers,         setPassengers]         = useState("1");
  const [directOnly,         setDirectOnly]         = useState(false);
  const [selectedTransports, setSelectedTransports] = useState([]);
  const [stops,              setStops]              = useState([]);
  const [useDefaultBudget,   setUseDefaultBudget]   = useState(false);
  const [selectedDate,       setSelectedDate]       = useState("");
  const [fuelDistance,       setFuelDistance]       = useState("");
  const [fuelConsumption,    setFuelConsumption]    = useState("");
  const [fuelPrice,          setFuelPrice]          = useState("");
  const [useDefaultFuelPrice,setUseDefaultFuelPrice]= useState(false);
  const [fuelCost,           setFuelCost]           = useState(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState("");
  const [calendarSelectionMode, setCalendarSelectionMode] = useState("departure");

  const addStop    = () => setStops((p) => [...p, ""]);
  const updateStop = (i, v) => setStops((p) => p.map((item, idx) => (idx === i ? v : item)));
  const removeStop = (i) => setStops((p) => p.filter((_, idx) => idx !== i));

  const transports     = ["Bus", "Train", "Car", "Plane"];
  const transportIcons = { Bus: "bus", Train: "train", Car: "car", Plane: "airplane" };

  // M4: picker day press handler
  const handlePickerDayPress = (day) => {
    if (pickerTarget === "departure") setDateFrom(day.dateString);
    else if (pickerTarget === "return") setReturnDateFrom(day.dateString);
    setPickerTarget(null);
  };

  const pickerMarkedDates = (() => {
    const current = pickerTarget === "departure" ? dateFrom : returnDateFrom;
    return current ? { [current]: { selected: true, selectedColor: COLORS.primary } } : {};
  })();

  // Navigation
  const onBackPress = () => {
    if (showRouteResults)  { setShowRouteResults(false); setShowCalendar(true); }
    else if (showCalendar) { setShowCalendar(false);     setShowDetails(true);  }
    else if (showDetails)  { setShowDetails(false); }
  };

  // Profile helpers
  const handleUseProfileLocation = async () => {
    const s = await getProfileSettings();
    if (s.defaultLocation) setStartLocation(s.defaultLocation);
  };

  const handleToggleDefaultBudget = async (value) => {
    setUseDefaultBudget(value);
    if (value) {
      const s = await getProfileSettings();
      setMaxBudget((s.standardBudget ?? "").toString());
    } else { setMaxBudget(""); }
  };

  const handleUseDefaultFuelPrice = async () => {
    const s = await getProfileSettings();
    const p = s.defaultFuelPrice ?? "";
    setUseDefaultFuelPrice(true);
    setFuelPrice(p.toString());
    calculateFuelCost(fuelDistance, fuelConsumption, p.toString());
  };

  const toggleTransport = (t) =>
    setSelectedTransports((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  // Fuel calculator
  const calculateFuelCost = (d, c, p) => {
    if (d && c && p) setFuelCost(((parseFloat(d) / 100) * parseFloat(c) * parseFloat(p)).toFixed(2));
    else setFuelCost(null);
  };
  const handleDistanceChange    = (v) => { setFuelDistance(v);    calculateFuelCost(v, fuelConsumption, fuelPrice); };
  const handleConsumptionChange = (v) => { setFuelConsumption(v); calculateFuelCost(fuelDistance, v, fuelPrice); };
  const handleFuelPriceChange   = (v) => { setFuelPrice(v);       calculateFuelCost(fuelDistance, fuelConsumption, v); };

  const clearSearchFields = () => {
    setPassengers("1"); setStartLocation(""); setDestination("");
    setDateFrom(""); setReturnDateFrom(""); setMaxBudget("");
    setDirectOnly(false); setIsRoundTrip(false); setSelectedTransports([]);
    setStops([]); setUseDefaultBudget(false); setSelectedDate("");
    setFuelDistance(""); setFuelConsumption(""); setFuelPrice("");
    setUseDefaultFuelPrice(false); setFuelCost(null);
    setSelectedReturnDate(""); setCalendarSelectionMode("departure");
  };

  const resetSearchInputs = () => { setShowDetails(false); setShowCalendar(false); setShowRouteResults(false); clearSearchFields(); };

  useEffect(() => { if (route.params?.resetSearch) resetSearchInputs(); }, [route.params?.resetSearch]);

  const getPriceColor = (level) => {
    if (level === "cheap")     return "#76943C";
    if (level === "medium")    return "#D4A017";
    if (level === "expensive") return "#A52A2A";
    return "#999";
  };

  return (
    <View style={styles.page}>

      {/*  M4: Date Picker Modal  */}
      <Modal visible={pickerTarget !== null} transparent animationType="fade" onRequestClose={() => setPickerTarget(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPickerTarget(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {pickerTarget === "departure" ? "Select departure date" : "Select return date"}
              </Text>
              <TouchableOpacity onPress={() => setPickerTarget(null)}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <Calendar
              firstDay={1}
              markedDates={pickerMarkedDates}
              onDayPress={handlePickerDayPress}
              minDate={new Date().toISOString().split("T")[0]}
              theme={{
                calendarBackground: "#fff",
                textSectionTitleColor: COLORS.primary,
                monthTextColor: COLORS.primary,
                arrowColor: COLORS.primary,
                selectedDayBackgroundColor: COLORS.primary,
                todayTextColor: COLORS.secondary,
              }}
            />
            <TouchableOpacity
              style={styles.modalClearButton}
              onPress={() => { if (pickerTarget === "departure") setDateFrom(""); else setReturnDateFrom(""); setPickerTarget(null); }}
            >
              <Text style={styles.modalClearText}>Clear date</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/*  STATE 1: Home  */}
      {!showDetails && !showCalendar && !showRouteResults && (
        <PageContainer>
          <View style={styles.homeContainer}>
            <Header title="UniWay" subtitle="Multifunctional travel planner for students" />
            <TouchableOpacity style={styles.searchBar} onPress={() => setShowDetails(true)} activeOpacity={0.8}>
              <Text style={styles.placeholderText}>Where do you want to go?</Text>
            </TouchableOpacity>
          </View>
        </PageContainer>
      )}

      {/*  STATE 2: Detailed search form  */}
      {showDetails && !showCalendar && !showRouteResults && (
        <ScreenLayout>
          <BackButton onPress={onBackPress} />
          <Header title="Search Trip" subtitle="Find the cheapest route" />
          <Card>
            <ClearableInput label="Start location" value={startLocation} onChangeText={setStartLocation} placeholder="Enter start location" />
            <TouchableOpacity onPress={handleUseProfileLocation} style={styles.profileLocationLink}>
              <Text style={styles.profileLocationText}>
                <MaterialCommunityIcons name="map-marker" size={12} /> Use profile location
              </Text>
            </TouchableOpacity>

            {/* Stopovers */}
            <View style={styles.fieldGroup}>
              <View style={styles.stopHeaderRow}>
                <Text style={styles.customLabel}>Stopovers</Text>
                <TouchableOpacity onPress={addStop} activeOpacity={0.8}>
                  <Text style={styles.addStopText}>+ Add stopover</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.infoNote}>Optional: Add stopovers between start and destination.</Text>
              {stops.map((stop, index) => (
                <View key={`stop-${index}`} style={styles.stopRow}>
                  <ClearableInput label={`Stopover ${index + 1}`} value={stop} onChangeText={(t) => updateStop(index, t)} placeholder="Enter location" />
                  <TouchableOpacity style={styles.removeStopButton} onPress={() => removeStop(index)} activeOpacity={0.8}>
                    <Text style={styles.removeStopText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <ClearableInput label="Destination" value={destination} onChangeText={setDestination} placeholder="Enter destination" />

            <SettingRow label="Round Trip" value={isRoundTrip} onValueChange={(v) => { setIsRoundTrip(v); if (!v) { setReturnDateFrom(""); setSelectedReturnDate(""); setCalendarSelectionMode("departure"); } }} />

            {/* M4: Date picker buttons */}
            <View style={styles.fieldGroup}>
              <Text style={styles.customLabel}>Departure date (optional)</Text>
              <DatePickerButton label="Departure" value={dateFrom} onPress={() => setPickerTarget("departure")} />
            </View>

            {isRoundTrip && (
              <View style={styles.fieldGroup}>
                <Text style={styles.customLabel}>Return date (optional)</Text>
                <DatePickerButton label="Return" value={returnDateFrom} onPress={() => setPickerTarget("return")} />
              </View>
            )}

            <SettingRow label="Use default budget" value={useDefaultBudget} onValueChange={handleToggleDefaultBudget} />
            <Input label="Max. Budget" value={maxBudget} onChangeText={setMaxBudget} keyboardType="numeric" />
            <Input label="Passengers" value={passengers} onChangeText={(t) => setPassengers(t.replace(/[^0-9]/g, ""))} keyboardType="numeric" />
            <SettingRow label="Direct connections only" value={directOnly} onValueChange={setDirectOnly} />

            <View style={styles.fieldGroup}>
              <Text style={styles.customLabel}>Type of transport</Text>
              <Text style={styles.infoNote}>If none are selected, all transport types will be included.</Text>
              <View style={styles.transportContainer}>
                {transports.map((t) => {
                  const isActive = selectedTransports.includes(t);
                  return (
                    <TouchableOpacity key={t} style={[styles.transportOption, isActive && styles.transportOptionActive]} onPress={() => toggleTransport(t)}>
                      <MaterialCommunityIcons name={transportIcons[t]} size={20} color={isActive ? "#FFFFFF" : COLORS.primary} />
                      <Text style={[styles.transportText, isActive && styles.transportTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {selectedTransports.includes("Car") && (
              <View style={styles.fieldGroup}>
                <Text style={styles.customLabel}>Fuel Cost Calculator</Text>
                <Input label="Distance" placeholder="Enter kilometers to be driven" value={fuelDistance} onChangeText={handleDistanceChange} keyboardType="decimal-pad" />
                <Input label="Fuel Consumption" placeholder="Enter liters per 100 km" value={fuelConsumption} onChangeText={handleConsumptionChange} keyboardType="decimal-pad" />
                <Input label="Fuel Price" placeholder="Enter price per liter (€)" value={fuelPrice} onChangeText={handleFuelPriceChange} keyboardType="decimal-pad" editable={!useDefaultFuelPrice} />
                <TouchableOpacity onPress={handleUseDefaultFuelPrice} style={styles.profileLocationLink}>
                  <Text style={styles.profileLocationText}>
                    <MaterialCommunityIcons name="fuel" size={12} /> Use default fuel price
                  </Text>
                </TouchableOpacity>
                <View style={styles.fuelCostResult}>
                  {fuelCost
                    ? <><Text style={styles.fuelCostLabel}>Estimated Fuel Cost</Text><Text style={styles.fuelCostValue}>€{fuelCost}</Text></>
                    : <Text style={styles.fuelCostPlaceholder}>Please fill in all fields to calculate costs</Text>
                  }
                </View>
              </View>
            )}

            <View style={styles.mainActions}>
              <TouchableOpacity onPress={clearSearchFields} style={styles.resetTextButton}>
                <Text style={styles.resetText}>Clear all</Text>
              </TouchableOpacity>
              <Button title="Show prices in calendar" onPress={() => setShowCalendar(true)} variant="primary" />
            </View>
          </Card>
        </ScreenLayout>
      )}

      {/*  STATE 3: Price calendar  */}
      {showCalendar && !showRouteResults && (
        <ScreenLayout>
          <BackButton onPress={onBackPress} />
          <Header
            title="Price Calendar"
            subtitle={`${startLocation || "Start"}${stops.filter(Boolean).length > 0 ? " → " + stops.filter(Boolean).join(" → ") + " → " : " ➔ "}${destination || "Destination"}`}
          />
          <Card>
            {isRoundTrip && (
              <View style={styles.calendarModeContainer}>
                <TouchableOpacity style={[styles.calendarModeTab, calendarSelectionMode === "departure" && styles.calendarModeTabActive]} onPress={() => setCalendarSelectionMode("departure")}>
                  <Text style={[styles.calendarModeText, calendarSelectionMode === "departure" && styles.calendarModeTextActive]}>Departure: {selectedDate || "--"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.calendarModeTab, calendarSelectionMode === "return" && styles.calendarModeTabActiveReturn]} onPress={() => setCalendarSelectionMode("return")}>
                  <Text style={[styles.calendarModeText, calendarSelectionMode === "return" && styles.calendarModeTextActive]}>Return: {selectedReturnDate || "--"}</Text>
                </TouchableOpacity>
              </View>
            )}
            <Calendar
              firstDay={1}
              theme={{ calendarBackground: "transparent", textSectionTitleColor: COLORS.primary, monthTextColor: COLORS.primary, arrowColor: COLORS.primary }}
              dayComponent={({ date, state }) => {
                const ds = date.dateString;
                const item = MOCK_CALENDAR_PRICES[ds];
                const isSelDep = selectedDate === ds;
                const isSelRet = isRoundTrip && selectedReturnDate === ds;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (isRoundTrip) {
                        if (calendarSelectionMode === "departure") { setSelectedDate(ds); setCalendarSelectionMode("return"); if (selectedReturnDate && ds > selectedReturnDate) setSelectedReturnDate(""); }
                        else { if (selectedDate && ds < selectedDate) alert("Return date cannot be earlier than departure date."); else setSelectedReturnDate(ds); }
                      } else { setSelectedDate(ds); }
                    }}
                    style={[styles.dayBox, (isSelDep || isSelRet) && styles.selectedDayBox, isSelRet && styles.selectedReturnDayBox]}
                  >
                    <Text style={[styles.dayText, state === "disabled" ? { color: "#d1d5db" } : { color: COLORS.text }]}>{date.day}</Text>
                    {item && <Text style={[styles.priceText, { color: getPriceColor(item.level) }]}>{item.price}€</Text>}
                  </TouchableOpacity>
                );
              }}
            />
            <View style={styles.legendContainer}>
              {[{ color: "#76943C", label: "Cheap" }, { color: "#D4A017", label: "Average" }, { color: "#A52A2A", label: "Expensive" }].map((l) => (
                <View key={l.label} style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: l.color }]} />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.mainActions}>
              {!isRoundTrip && (
                <TouchableOpacity style={{ alignSelf: "center", marginBottom: 12, paddingVertical: 8 }} onPress={() => { setIsRoundTrip(true); setCalendarSelectionMode("return"); }}>
                  <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 14 }}>+ Add return date</Text>
                </TouchableOpacity>
              )}
              <Button
                title={isRoundTrip ? "Select dates" : "Select date"}
                variant={(isRoundTrip ? (selectedDate && selectedReturnDate) : selectedDate) ? "primary" : "secondary"}
                onPress={() => { const ok = isRoundTrip ? (selectedDate && selectedReturnDate) : selectedDate; if (ok) setShowRouteResults(true); }}
              />
            </View>
          </Card>
        </ScreenLayout>
      )}

      {/*  STATE 4: Route results  */}
      {showRouteResults && (
        <ResultsPage
          from={startLocation}
          to={destination}
          stops={stops.filter((s) => s.trim() !== "")}
          selectedDate={selectedDate}
          maxBudget={maxBudget}
          selectedTransports={selectedTransports}
          selectedReturnDate={selectedReturnDate}
          directOnly={directOnly}
          passengers={parseInt(passengers) || 1}
          fuelCost={fuelCost}
          onBack={onBackPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page:                     { flex: 1, backgroundColor: COLORS.background },
  homeContainer:            { flex: 1, justifyContent: "center" },
  searchBar:                { backgroundColor: COLORS.surface || "#fff", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#d1d5db", marginTop: 20 },
  placeholderText:          { color: "#6b7280", fontSize: 16 },
  fieldGroup:               { marginTop: 15, marginBottom: 10 },
  customLabel:              { fontSize: 14, fontWeight: "600", color: COLORS.text || "#333", marginBottom: 8 },
  infoNote:                 { fontSize: 12, color: "#6b7280", marginBottom: 10, fontStyle: "italic" },
  stopHeaderRow:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  addStopText:              { color: COLORS.primary, fontWeight: "700", fontSize: 13 },
  stopRow:                  { marginBottom: 12 },
  removeStopButton:         { alignSelf: "flex-end", marginTop: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#FEE2E2" },
  removeStopText:           { color: "#B91C1C", fontSize: 12, fontWeight: "700" },
  transportContainer:       { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10 },
  transportOption:          { width: "48%", backgroundColor: "#f3f4f6", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, borderWidth: 1, borderColor: "#e5e7eb" },
  transportOptionActive:    { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  transportText:            { fontSize: 13, fontWeight: "500", color: COLORS.text },
  transportTextActive:      { color: "#fff" },
  mainActions:              { marginTop: 0 },
  profileLocationLink:      { marginTop: -10, paddingVertical: 5 },
  profileLocationText:      { color: COLORS.primary, fontSize: 12, fontWeight: "600" },
  dayBox:                   { width: 45, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  selectedDayBox:           { borderColor: COLORS.primary, borderWidth: 2 },
  selectedReturnDayBox:     { borderColor: COLORS.secondary },
  dayText:                  { fontSize: 15, fontWeight: "600" },
  priceText:                { fontSize: 11, fontWeight: "bold", marginTop: 2 },
  legendContainer:          { flexDirection: "row", justifyContent: "flex-start", paddingVertical: 15, gap: 15 },
  legendItem:               { flexDirection: "row", alignItems: "center", gap: 6 },
  dot:                      { width: 12, height: 12, borderRadius: 6 },
  legendText:               { fontSize: 13, color: "#4b5563", fontWeight: "500" },
  fuelCostResult:           { marginTop: 15, padding: 12, backgroundColor: "#F0F9FF", borderRadius: 10, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  fuelCostLabel:            { fontSize: 12, color: "#0369A1", fontWeight: "500", marginBottom: 4 },
  fuelCostValue:            { fontSize: 24, fontWeight: "700", color: COLORS.primary },
  fuelCostPlaceholder:      { fontSize: 13, color: "#6b7280", fontStyle: "italic", textAlign: "center" },
  inputBlock:               { marginBottom: 12 },
  inputLabel:               { fontSize: 14, fontWeight: "600", color: COLORS.text, marginBottom: 6 },
  inputWrapper:             { position: "relative", justifyContent: "center" },
  clearableTextInput:       { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, paddingVertical: 12, paddingLeft: 14, paddingRight: 42, fontSize: 15, color: COLORS.text },
  insideClearButton:        { position: "absolute", right: 10, width: 26, height: 26, borderRadius: 13, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  insideClearButtonText:    { color: "#6B7280", fontSize: 20, fontWeight: "900", lineHeight: 22 },
  resetTextButton:          { alignSelf: "center", paddingVertical: 6 },
  resetText:                { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  calendarModeContainer:    { flexDirection: "row", justifyContent: "space-between", marginBottom: 15, backgroundColor: "#f3f4f6", borderRadius: 10, padding: 4 },
  calendarModeTab:          { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  calendarModeTabActive:    { backgroundColor: COLORS.primary },
  calendarModeTabActiveReturn: { backgroundColor: COLORS.secondary },
  calendarModeText:         { fontSize: 13, fontWeight: "600", color: "#4b5563" },
  calendarModeTextActive:   { color: "#fff" },
  // M4: date picker modal
  modalOverlay:             { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalCard:                { backgroundColor: "#fff", borderRadius: 20, width: "100%", padding: 16, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  modalHeader:              { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle:               { fontSize: 16, fontWeight: "700", color: COLORS.text },
  modalClearButton:         { alignSelf: "center", marginTop: 12, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: "#e5e7eb" },
  modalClearText:           { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  // M4: date picker button
  datePickerButton:         { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 14, gap: 10 },
  datePickerContent:        { flex: 1 },
  datePickerLabel:          { fontSize: 11, color: COLORS.text, opacity: 0.5, fontWeight: "500" },
  datePickerValue:          { fontSize: 15, fontWeight: "600", color: COLORS.text, marginTop: 2 },
  datePickerPlaceholder:    { color: "#9ca3af", fontWeight: "400" },
});