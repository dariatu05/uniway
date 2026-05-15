import { useState } from "react";
import { getCheapestPrice, mockPriceCalendar } from "../data/mockPriceCalendar";

const transportLabels = {
  bus: "Bus",
  train: "Zug",
  car: "Auto",
  plane: "Flugzeug",
};

function PriceCalendar({ selectedTransports = [], onSelectDay }) {
  const [viewMode, setViewMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(null);

  function handleDayClick(day) {
    setSelectedDate(day.date);

    if (onSelectDay) {
      onSelectDay(day);
    }
  }

  function getVisibleDays() {
    if (viewMode === "day") {
      return mockPriceCalendar.slice(0, 1);
    }

    if (viewMode === "week") {
      return mockPriceCalendar.slice(0, 7);
    }

    return mockPriceCalendar;
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "18px",
        padding: "16px",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h2 style={{ marginBottom: "12px", color: "#222831" }}>Preisübersicht</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <ViewButton
          label="Tag"
          active={viewMode === "day"}
          onClick={() => setViewMode("day")}
        />
        <ViewButton
          label="Woche"
          active={viewMode === "week"}
          onClick={() => setViewMode("week")}
        />
        <ViewButton
          label="Monat"
          active={viewMode === "month"}
          onClick={() => setViewMode("month")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "10px",
        }}
      >
        {getVisibleDays().map((day) => {
          const cheapest = getCheapestPrice(day, selectedTransports);
          const isSelected = selectedDate === day.date;
          const isVeryCheap = cheapest.price <= 35;

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => handleDayClick(day)}
              style={{
                textAlign: "left",
                border: "none",
                borderRadius: "14px",
                padding: "12px",
                cursor: "pointer",
                backgroundColor: isSelected
                  ? "#5B5FDE"
                  : isVeryCheap
                    ? "#D7F3EC"
                    : "#F8F9FD",
                color: isSelected ? "#FFFFFF" : "#222831",
              }}
            >
              <div style={{ fontWeight: "700", marginBottom: "6px" }}>
                {formatDate(day.date)}
              </div>

              <div style={{ fontSize: "20px", fontWeight: "700" }}>
                {cheapest.price} €
              </div>

              <div style={{ fontSize: "13px", marginTop: "4px" }}>
                {transportLabels[cheapest.transport]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ViewButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: "12px",
        padding: "9px 12px",
        backgroundColor: active ? "#5B5FDE" : "#D7F3EC",
        color: active ? "#FFFFFF" : "#222831",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      {label}
    </button>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default PriceCalendar;
