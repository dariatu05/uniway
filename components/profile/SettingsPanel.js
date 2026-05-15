import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { COLORS } from "../../styles/colors";

import PreferredTransportSelector from "./PreferredTransportSelector";
import SettingRow from "./SettingRow";

export default function SettingsPanel({ settings, onChange }) {
  function updateField(field, value) {
    onChange({
      ...settings,
      [field]: value,
    });
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Einstellungen</Text>

      <SettingRow label="Name" description="Anzeigename im Profil">
        <TextInput
          value={settings.name}
          onChangeText={(value) => updateField("name", value)}
          style={styles.input}
        />
      </SettingRow>

      <SettingRow
        label="Standard-Startort"
        description="Wird genutzt, wenn kein Standort freigegeben ist"
      >
        <TextInput
          value={settings.defaultLocation}
          onChangeText={(value) => updateField("defaultLocation", value)}
          style={styles.input}
        />
      </SettingRow>

      <SettingRow
        label="Standortfreigabe"
        description="Aktuellen Standort für Suche verwenden"
      >
        <Switch
          value={settings.locationEnabled}
          onValueChange={(value) => updateField("locationEnabled", value)}
          trackColor={{ false: "#dbe2ef", true: "#D7F3EC" }}
          thumbColor={settings.locationEnabled ? COLORS.primary : "#f4f4f5"}
        />
      </SettingRow>

      <SettingRow
        label="Push-Nachrichten"
        description="Benachrichtigungen für Preisänderungen"
      >
        <Switch
          value={settings.pushEnabled}
          onValueChange={(value) => updateField("pushEnabled", value)}
          trackColor={{ false: "#dbe2ef", true: "#D7F3EC" }}
          thumbColor={settings.pushEnabled ? COLORS.primary : "#f4f4f5"}
        />
      </SettingRow>

      <SettingRow label="Standardbudget" description="Maximales Budget in Euro">
        <TextInput
          value={String(settings.standardBudget)}
          onChangeText={(value) =>
            updateField("standardBudget", Number(value) || 0)
          }
          keyboardType="numeric"
          style={styles.input}
        />
      </SettingRow>

      <SettingRow label="Währung">
        <TextInput
          value={settings.currency}
          onChangeText={(value) => updateField("currency", value)}
          style={styles.input}
        />
      </SettingRow>

      <View style={styles.transportBlock}>
        <Text style={styles.transportTitle}>Bevorzugte Verkehrsmittel</Text>

        <View style={styles.transportSelector}>
          <PreferredTransportSelector
            selected={settings.preferredTransports}
            onChange={(value) => updateField("preferredTransports", value)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbe2ef",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 120,
    color: COLORS.text,
    backgroundColor: "#FFFFFF",
  },
  transportBlock: {
    marginTop: 18,
  },
  transportTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },
  transportSelector: {
    marginTop: 12,
  },
});
