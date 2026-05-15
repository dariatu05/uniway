function SettingsPanel({ settings, onChange }) {
  function updateField(field, value) {
    onChange({
      ...settings,
      [field]: value,
    });
  }

  function updateTransport(transport, value) {
    onChange({
      ...settings,
      preferredTransports: {
        ...settings.preferredTransports,
        [transport]: value,
      },
    });
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
      <h2 style={{ color: "#222831", marginBottom: "16px" }}>Einstellungen</h2>

      <div style={{ marginBottom: "14px" }}>
        <label>Name</label>
        <input
          type="text"
          value={settings.name || ""}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Dein Name"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label>Standard-Startort</label>
        <input
          type="text"
          value={settings.defaultLocation || ""}
          onChange={(event) =>
            updateField("defaultLocation", event.target.value)
          }
          placeholder="z. B. Wien"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label>Standardbudget</label>
        <input
          type="number"
          value={settings.defaultBudget || ""}
          onChange={(event) =>
            updateField("defaultBudget", Number(event.target.value))
          }
          placeholder="z. B. 100"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label>Sprache</label>
        <select
          value={settings.language || "Deutsch"}
          onChange={(event) => updateField("language", event.target.value)}
          style={inputStyle}
        >
          <option>Deutsch</option>
          <option>Englisch</option>
        </select>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label>Währung</label>
        <select
          value={settings.currency || "EUR"}
          onChange={(event) => updateField("currency", event.target.value)}
          style={inputStyle}
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <hr style={lineStyle} />

      <Checkbox
        label="Studentenstatus aktiv"
        checked={settings.studentStatus}
        onChange={(value) => updateField("studentStatus", value)}
      />

      <Checkbox
        label="Standortfreigabe aktivieren"
        checked={settings.locationEnabled}
        onChange={(value) => updateField("locationEnabled", value)}
      />

      <Checkbox
        label="Push bei Preisfall"
        checked={settings.pushPriceDrop}
        onChange={(value) => updateField("pushPriceDrop", value)}
      />

      <Checkbox
        label="Push bei Last-Minute-Angeboten"
        checked={settings.pushLastMinute}
        onChange={(value) => updateField("pushLastMinute", value)}
      />

      <Checkbox
        label="Studentenrabatte anzeigen"
        checked={settings.studentDiscounts}
        onChange={(value) => updateField("studentDiscounts", value)}
      />

      <Checkbox
        label="Cheapest Route First standardmäßig aktivieren"
        checked={settings.cheapestRouteFirst}
        onChange={(value) => updateField("cheapestRouteFirst", value)}
      />

      <hr style={lineStyle} />

      <h3 style={{ marginBottom: "10px" }}>Bevorzugte Verkehrsmittel</h3>

      <Checkbox
        label="Auto"
        checked={settings.preferredTransports?.car}
        onChange={(value) => updateTransport("car", value)}
      />

      <Checkbox
        label="Zug"
        checked={settings.preferredTransports?.train}
        onChange={(value) => updateTransport("train", value)}
      />

      <Checkbox
        label="Bus"
        checked={settings.preferredTransports?.bus}
        onChange={(value) => updateTransport("bus", value)}
      />

      <Checkbox
        label="Flugzeug"
        checked={settings.preferredTransports?.plane}
        onChange={(value) => updateTransport("plane", value)}
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
        color: "#222831",
      }}
    >
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #D7F3EC",
  backgroundColor: "#F8F9FD",
  color: "#222831",
};

const lineStyle = {
  border: "none",
  borderTop: "1px solid #D7F3EC",
  margin: "18px 0",
};

export default SettingsPanel;
