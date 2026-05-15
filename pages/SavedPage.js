import { useEffect, useState } from "react";
import {
    clearExpiredRoutes,
    deleteFavoriteRoute,
    getExpiredRoutes,
    getFavoriteRoutes,
} from "../api/storageApi";

function SavedPage() {
  const [favorites, setFavorites] = useState([]);
  const [expiredRoutes, setExpiredRoutes] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  function loadFavorites() {
    const savedRoutes = getFavoriteRoutes();
    const expired = getExpiredRoutes();

    setFavorites(savedRoutes);
    setExpiredRoutes(expired);
  }

  function handleDelete(routeId) {
    const updatedFavorites = deleteFavoriteRoute(routeId);
    setFavorites(updatedFavorites);
    setExpiredRoutes(getExpiredRoutes());
  }

  function handleDeleteAllExpired() {
    const updatedFavorites = clearExpiredRoutes();
    setFavorites(updatedFavorites);
    setExpiredRoutes([]);
  }

  function isExpired(route) {
    const today = new Date();
    const routeDate = new Date(route.date);

    return routeDate < today;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#F8F9FD",
        color: "#222831",
        paddingBottom: "80px",
      }}
    >
      <h1 style={{ color: "#5B5FDE", marginBottom: "16px" }}>
        Gespeicherte Routen
      </h1>

      {expiredRoutes.length > 0 && (
        <div
          style={{
            backgroundColor: "#ffe5e5",
            borderRadius: "16px",
            padding: "14px",
            marginBottom: "16px",
            color: "#7a1f1f",
          }}
        >
          <strong>{expiredRoutes.length} Route(n) sind abgelaufen.</strong>
          <p style={{ margin: "8px 0" }}>
            Diese Routen liegen in der Vergangenheit.
          </p>
          <button
            type="button"
            onClick={handleDeleteAllExpired}
            style={dangerButtonStyle}
          >
            Alle abgelaufenen löschen
          </button>
        </div>
      )}

      {favorites.length === 0 ? (
        <div style={emptyStateStyle}>
          <h2>Keine gespeicherten Routen</h2>
          <p>
            Gespeicherte Reisen werden hier angezeigt, sobald du eine Route
            speicherst.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {favorites.map((route) => {
            const expired = isExpired(route);

            return (
              <article
                key={route.id}
                style={{
                  backgroundColor: expired ? "#3b1f1f" : "#FFFFFF",
                  color: expired ? "#FFFFFF" : "#222831",
                  borderRadius: "18px",
                  padding: "16px",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div>
                    <h2 style={{ margin: "0 0 8px" }}>
                      {route.from} → {route.to}
                    </h2>
                    <p style={{ margin: "4px 0" }}>
                      Datum: {formatDate(route.date)}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      Verkehrsmittel: {route.mainTransport}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      Dauer: {route.durationMinutes} Minuten
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <strong style={{ fontSize: "22px" }}>
                      {route.price} €
                    </strong>
                  </div>
                </div>

                {expired && (
                  <p style={{ marginTop: "10px", color: "#ffb3b3" }}>
                    Diese Route ist abgelaufen.
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "14px",
                  }}
                >
                  {route.bookingUrl && (
                    <button
                      type="button"
                      onClick={() => window.open(route.bookingUrl, "_blank")}
                      style={primaryButtonStyle}
                    >
                      Anbieter öffnen
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(route.id)}
                    style={dangerButtonStyle}
                  >
                    Löschen
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const primaryButtonStyle = {
  border: "none",
  borderRadius: "12px",
  padding: "10px 14px",
  backgroundColor: "#5B5FDE",
  color: "#FFFFFF",
  cursor: "pointer",
  fontWeight: "600",
};

const dangerButtonStyle = {
  border: "none",
  borderRadius: "12px",
  padding: "10px 14px",
  backgroundColor: "#b00020",
  color: "#FFFFFF",
  cursor: "pointer",
  fontWeight: "600",
};

const emptyStateStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
};

export default SavedPage;
