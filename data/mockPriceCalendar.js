export const mockPriceCalendar = [
  {
    id: "day-1",
    date: "2026-05-20",
    from: "Wien",
    to: "Berlin",
    prices: {
      bus: 29,
      train: 59,
      car: 55,
      plane: 89,
    },
    routes: ["route-1", "route-2", "route-3"],
  },
  {
    id: "day-2",
    date: "2026-05-21",
    from: "Wien",
    to: "Berlin",
    prices: {
      bus: 35,
      train: 49,
      car: 55,
      plane: 120,
    },
    routes: ["route-4", "route-5"],
  },
  {
    id: "day-3",
    date: "2026-05-22",
    from: "Wien",
    to: "Berlin",
    prices: {
      bus: 39,
      train: 69,
      car: 55,
      plane: 99,
    },
    routes: ["route-6"],
  },
  {
    id: "day-4",
    date: "2026-05-23",
    from: "Wien",
    to: "Berlin",
    prices: {
      bus: 25,
      train: 79,
      car: 55,
      plane: 110,
    },
    routes: ["route-7"],
  },
  {
    id: "day-5",
    date: "2026-05-24",
    from: "Wien",
    to: "Berlin",
    prices: {
      bus: 45,
      train: 64,
      car: 55,
      plane: 85,
    },
    routes: ["route-8"],
  },
  {
    id: "day-6",
    date: "2026-05-25",
    from: "Wien",
    to: "Berlin",
    prices: {
      bus: 31,
      train: 54,
      car: 55,
      plane: 95,
    },
    routes: ["route-9"],
  },
  {
    id: "day-7",
    date: "2026-05-26",
    from: "Wien",
    to: "Berlin",
    prices: {
      bus: 42,
      train: 58,
      car: 55,
      plane: 130,
    },
    routes: ["route-10"],
  },
];

export function getCheapestPrice(day, selectedTransports = []) {
  const transports =
    selectedTransports.length > 0
      ? selectedTransports
      : Object.keys(day.prices);

  let cheapestTransport = transports[0];
  let cheapestPrice = day.prices[cheapestTransport];

  transports.forEach((transport) => {
    if (day.prices[transport] < cheapestPrice) {
      cheapestTransport = transport;
      cheapestPrice = day.prices[transport];
    }
  });

  return {
    price: cheapestPrice,
    transport: cheapestTransport,
  };
}
