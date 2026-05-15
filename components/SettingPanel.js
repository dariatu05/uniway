import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { COLORS } from "../styles/colors";

export default function SettingsPanel({ settings, onChange }) {
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
    <View style={styles.panel}>
      <Text style={styles.title}>Einstellungen</Text>

      <InputBlock
        label="Name"
        value={settings.name || ""}
        placeholder="Dein Name"
        onChangeText={(value) => updateField("name", value)}
      />

      <InputBlock
        label="Standard-Startort"
        value={settings.defaultLocation || ""}
        placeholder="z. B. Wien"
        onChangeText={(value) => updateField("defaultLocation", value)}
      />

      <InputBlock
        label="Standardbudget"
        value={String(settings.defaultBudget || "")}
        placeholder="z. B. 100"
        keyboardType="numeric"
        onChangeText={(value) =>
          updateField("defaultBudget", Number(value) || 0)
        }
      />

      <InputBlock
        label="Sprache"
        value={settings.language || "Deutsch"}
        placeholder="Deutsch"
        onChangeText={(value) => updateField("language", value)}
      />

      <InputBlock
        label="Währung"
        value={settings.currency || "EUR"}
        placeholder="EUR"
        onChangeText={(value) => updateField("currency", value)}
      />

      <View style={styles.line} />

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

      <View style={styles.line} />

      <Text style={styles.sectionTitle}>Bevorzugte Verkehrsmittel</Text>

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
    </View>
  );
}

function InputBlock({ label, value, placeholder, onChangeText, keyboardType }) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType || "default"}
        style={styles.input}
        placeholderTextColor="#64748b"
      />
    </View>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <View style={styles.checkboxRow}>
      <Switch
        value={Boolean(checked)}
        onValueChange={onChange}
        trackColor={{ false: "#dbe2ef", true: COLORS.accent }}
        thumbColor={checked ? COLORS.primary : "#f4f4f5"}
      />

      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },
  inputBlock: {
    marginBottom: 14,
  },
  label: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: COLORS.accent,
    marginVertical: 18,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  checkboxLabel: {
    color: COLORS.text,
    fontSize: 15,
    flex: 1,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },
});
