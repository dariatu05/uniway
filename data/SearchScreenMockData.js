// MOCKDATA - SEARCHSCREEN:
// Ich verwende hier vorerst eigene definierte Mockdaten um SearchScreen unabhängig zu testen
// mockData.js verwende ich noch nicht um Konflikte zu vermeiden
// Nachdem die Datenstruktur und Logik für SearchScreen steht, können wir die Daten in mockData.js verschieben und ggf. erweitern oder anpassen.

// 1. Mock-Daten für die Standortsuche
export const MOCK_LOCATIONS = [
  { id: '1', name: 'Wien', country: 'Österreich' },
  { id: '2', name: 'Berlin', country: 'Deutschland' },
  { id: '3', name: 'Prag', country: 'Tschechien' },
  { id: '4', name: 'Budapest', country: 'Ungarn' },
  { id: '5', name: 'München', country: 'Deutschland' }
];

// 2. Mock-Daten für die Kalenderpreise (30 Tage)
// Wir simulieren Preise für verschiedene Transportmittel
export const MOCK_CALENDAR_PRICES = {
  '2026-05-01': { price: 25, level: 'cheap' },
  '2026-05-02': { price: 19, level: 'cheap' },
  '2026-05-03': { price: 45, level: 'medium' },
  '2026-05-04': { price: 89, level: 'expensive' },
  '2026-05-05': { price: 32, level: 'medium' },
  '2026-05-06': { price: 95, level: 'expensive' },
  '2026-05-07': { price: 22, level: 'cheap' },
  // ... fülle hier weitere Tage für Mai 2026 auf
};

// 3. Mock-Daten für die besten Deals (z.B. Top 3)
export const MOCK_DEALS = [
  { from: 'Wien', to: 'Prag', price: 15, transport: 'Bus' },
  { from: 'Wien', to: 'Berlin', price: 29, transport: 'Zug' },
  { from: 'Wien', to: 'Bratislava', price: 9, transport: 'Bus' }
];

// 4. Mock-Daten für die Routenvorschläge
export const MOCK_ROUTES = [
    { id: '1', type: 'Zug', price: 24, duration: '6 h 15 min', icon: 'train' },
    { id: '2', type: 'Bus + Zug', price: 33, duration: '7 h 30 min', icon: 'bus-clock' },
    { id: '3', type: 'Flugzeug', price: 85, duration: '1 h 10 min + Transfer', icon: 'airplane' },
    { id: '4', type: 'Zug', price: 45, duration: '5 h 50 min', icon: 'train' },
];