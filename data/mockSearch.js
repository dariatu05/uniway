// MOCKDATA - SEARCHSCREEN:
// Erweiterte Mock-Daten für die SearchScreen-Komponente (Diese Mockdaten sind KI-generiert!)

// 1. Mock-Daten für die Standortsuche
export const MOCK_LOCATIONS = [
  { id: "1", name: "Wien", country: "Österreich", latitude: 48.2082, longitude: 16.3738 },
  { id: "2", name: "Berlin", country: "Deutschland", latitude: 52.5200, longitude: 13.4050 },
  { id: "3", name: "Prag", country: "Tschechien", latitude: 50.0755, longitude: 14.4378 },
  { id: "4", name: "Budapest", country: "Ungarn", latitude: 47.4979, longitude: 19.0402 },
  { id: "5", name: "München", country: "Deutschland", latitude: 48.1351, longitude: 11.5820 },
  { id: "6", name: "Bratislava", country: "Slowakei", latitude: 48.1486, longitude: 17.1077 },
  { id: "7", name: "Salzburg", country: "Österreich", latitude: 47.8095, longitude: 13.0550 },
  { id: "8", name: "Linz", country: "Österreich", latitude: 48.2747, longitude: 14.2856 },
];

// 2. Mock-Daten für die Kalenderpreise (30 Tage: 16. Mai - 14. Juni 2026)
export const MOCK_CALENDAR_PRICES = {
  "2026-05-16": { price: 28, level: "cheap" },
  "2026-05-17": { price: 25, level: "cheap" },
  "2026-05-18": { price: 32, level: "medium" },
  "2026-05-19": { price: 89, level: "expensive" },
  "2026-05-20": { price: 35, level: "medium" },
  "2026-05-21": { price: 95, level: "expensive" },
  "2026-05-22": { price: 22, level: "cheap" },
  "2026-05-23": { price: 26, level: "cheap" },
  "2026-05-24": { price: 78, level: "expensive" },
  "2026-05-25": { price: 42, level: "medium" },
  "2026-05-26": { price: 19, level: "cheap" },
  "2026-05-27": { price: 51, level: "medium" },
  "2026-05-28": { price: 85, level: "expensive" },
  "2026-05-29": { price: 29, level: "cheap" },
  "2026-05-30": { price: 38, level: "medium" },
  "2026-05-31": { price: 92, level: "expensive" },
  "2026-06-01": { price: 24, level: "cheap" },
  "2026-06-02": { price: 27, level: "cheap" },
  "2026-06-03": { price: 55, level: "medium" },
  "2026-06-04": { price: 88, level: "expensive" },
  "2026-06-05": { price: 31, level: "medium" },
  "2026-06-06": { price: 21, level: "cheap" },
  "2026-06-07": { price: 79, level: "expensive" },
  "2026-06-08": { price: 34, level: "medium" },
  "2026-06-09": { price: 18, level: "cheap" },
  "2026-06-10": { price: 47, level: "medium" },
  "2026-06-11": { price: 91, level: "expensive" },
  "2026-06-12": { price: 23, level: "cheap" },
  "2026-06-13": { price: 39, level: "medium" },
  "2026-06-14": { price: 87, level: "expensive" },
};

// 3. Mock-Daten für die besten Deals (z.B. Top 5)
export const MOCK_DEALS = [
  { from: "Wien", to: "Bratislava", price: 9, transport: "Bus", duration: "1 h 15 min", rating: 4.5 },
  { from: "Wien", to: "Prag", price: 15, transport: "Bus", duration: "4 h 30 min", rating: 4.7 },
  { from: "Wien", to: "Berlin", price: 29, transport: "Zug", duration: "10 h 45 min", rating: 4.6 },
  { from: "Wien", to: "Budapest", price: 12, transport: "Bus", duration: "2 h 50 min", rating: 4.4 },
  { from: "Wien", to: "Salzburg", price: 18, transport: "Zug", duration: "2 h 30 min", rating: 4.8 },
];

// 4. Mock-Daten für die Routenvorschläge
export const MOCK_ROUTES = [
  { id: "1", type: "Zug", price: 24, duration: "6 h 15 min", icon: "train", seats: 45, rating: 4.6 },
  {
    id: "2",
    type: "Bus + Zug",
    price: 33,
    duration: "7 h 30 min",
    icon: "bus-clock",
    seats: 12,
    rating: 4.3,
  },
  {
    id: "3",
    type: "Flugzeug",
    price: 85,
    duration: "1 h 10 min + Transfer",
    icon: "airplane",
    seats: 8,
    rating: 4.8,
  },
  { id: "4", type: "Zug", price: 45, duration: "5 h 50 min", icon: "train", seats: 32, rating: 4.7 },
  { id: "5", type: "Bus", price: 19, duration: "8 h 20 min", icon: "bus", seats: 18, rating: 4.2 },
  { id: "6", type: "Mietauto", price: 62, duration: "5 h 5 min", icon: "car", seats: 5, rating: 4.5 },
];

// 5. Mock-Daten für populäre Routen
export const MOCK_POPULAR_ROUTES = [
  {
    id: "pop1",
    from: "Wien",
    to: "Prag",
    price: 15,
    transport: "Bus",
    frequency: "täglich",
    passengers: 1250,
  },
  {
    id: "pop2",
    from: "Wien",
    to: "Budapest",
    price: 12,
    transport: "Bus",
    frequency: "täglich",
    passengers: 980,
  },
  {
    id: "pop3",
    from: "Wien",
    to: "Salzburg",
    price: 18,
    transport: "Zug",
    frequency: "stündlich",
    passengers: 2100,
  },
  {
    id: "pop4",
    from: "Wien",
    to: "Berlin",
    price: 29,
    transport: "Zug",
    frequency: "2x täglich",
    passengers: 850,
  },
];

// 6. Mock-Daten für Filter-Optionen
export const MOCK_TRANSPORT_OPTIONS = [
  { id: "bus", name: "Bus", icon: "bus", selected: false, count: 24 },
  { id: "train", name: "Zug", icon: "train", selected: false, count: 18 },
  { id: "flight", name: "Flugzeug", icon: "airplane", selected: false, count: 5 },
  { id: "car", name: "Mietauto", icon: "car", selected: false, count: 8 },
  { id: "multi", name: "Kombination", icon: "layers", selected: false, count: 12 },
];

// 7. Mock-Daten für Preisklassen
export const MOCK_PRICE_LEVELS = {
  cheap: { min: 0, max: 30, label: "Günstig", color: "#4CAF50" },
  medium: { min: 31, max: 60, label: "Mittel", color: "#FFC107" },
  expensive: { min: 61, max: 200, label: "Teuer", color: "#F44336" },
};
