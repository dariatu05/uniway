import { useEffect, useState } from "react";
import {
    deleteFavoriteRoute,
    isRouteSaved,
    saveFavoriteRoute,
} from "../api/storageApi";

function SaveButton({ route, onChange }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (route?.id) {
      setSaved(isRouteSaved(route.id));
    }
  }, [route]);

  function handleClick() {
    if (!route) return;

    if (saved) {
      const updatedFavorites = deleteFavoriteRoute(route.id);
      setSaved(false);

      if (onChange) {
        onChange(updatedFavorites);
      }

      return;
    }

    const updatedFavorites = saveFavoriteRoute(route);
    setSaved(true);

    if (onChange) {
      onChange(updatedFavorites);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        border: "none",
        borderRadius: "12px",
        padding: "10px 14px",
        backgroundColor: saved ? "#D7F3EC" : "#5B5FDE",
        color: saved ? "#222831" : "#FFFFFF",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      {saved ? "Gespeichert" : "Speichern"}
    </button>
  );
}

export default SaveButton;
