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
export const MOCK_CALENDAR_PRICES = [
  { date: '2026-06-01', price: 25, transport: 'Bus', level: 'cheap' },
  { date: '2026-06-02', price: 19, transport: 'Bus', level: 'cheap' }, // Top Deal
  { date: '2026-06-03', price: 42, transport: 'Zug', level: 'medium' },
  { date: '2026-06-04', price: 85, transport: 'Flug', level: 'expensive' },
  { date: '2026-06-05', price: 30, transport: 'Auto', level: 'medium' },
  // ... 
];

// 3. Mock-Daten für die besten Deals (z.B. Top 3)
export const MOCK_DEALS = [
  { from: 'Wien', to: 'Prag', price: 15, transport: 'Bus' },
  { from: 'Wien', to: 'Berlin', price: 29, transport: 'Zug' },
  { from: 'Wien', to: 'Bratislava', price: 9, transport: 'Bus' }
];