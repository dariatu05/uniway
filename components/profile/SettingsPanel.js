import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { COLORS } from "../../styles/colors";

import PreferredTransportSelector from "./PreferredTransportSelector";
import SettingRow from "./SettingRow";

// Panel component for editing user profile settings
export default function SettingsPanel({ settings, onChange }) {
  // Updates one field inside the settings object
  function updateField(field, value) {
    onChange({
      ...settings,
      [field]: value,
    });
  }

  return (
    <View style={styles.panel}>
      {/* Title */}
      <Text style={styles.title}>Settings</Text>

      {/* User display name */}
      <SettingRow label="Name" description="Display name in profile">
        <TextInput
          value={settings.name}
          onChangeText={(value) => updateField("name", value)}
          style={styles.input}
        />
      </SettingRow>

      {/* Def location */}
      <SettingRow
        label="Default Location"
        description="Used when no location is shared"
      >
        <TextInput
          value={settings.defaultLocation}
          onChangeText={(value) => updateField("defaultLocation", value)}
          style={styles.input}
        />
      </SettingRow>

      {/* Click for using current location */}
      <SettingRow
        label="Location Sharing"
        description="Use current location for searches"
      >
        <Switch
          value={settings.locationEnabled}
          onValueChange={(value) => updateField("locationEnabled", value)}
          trackColor={{ false: "#dbe2ef", true: "#D7F3EC" }}
          thumbColor={settings.locationEnabled ? COLORS.primary : "#f4f4f5"}
        />
      </SettingRow>

      {/* Click for notification alerts */}
      <SettingRow
        label="Push Notifications"
        description="Notifications for price changes"
      >
        <Switch
          value={settings.pushEnabled}
          onValueChange={(value) => updateField("pushEnabled", value)}
          trackColor={{ false: "#dbe2ef", true: "#D7F3EC" }}
          thumbColor={settings.pushEnabled ? COLORS.primary : "#f4f4f5"}
        />
      </SettingRow>

      {/* Standard travel budget */}
      <SettingRow label="Standard Budget" description="Maximum budget in EUR">
        <TextInput
          value={String(settings.standardBudget)}
          onChangeText={(value) =>
            updateField("standardBudget", Number(value) || 0)
          }
          keyboardType="numeric"
          style={styles.input}
        />
      </SettingRow>

      {/* Currency for displaying prices */}
      <SettingRow label="Currency" description="Selected currency for display">
        <TextInput
          value={settings.currency}
          onChangeText={(value) => updateField("currency", value)}
          style={styles.input}
        />
      </SettingRow>

      {/* Default fuel price */}
      <SettingRow
        label="Default Fuel Price"
        description="Fuel price per liter in EUR"
      >
        <TextInput
          value={String(settings.defaultFuelPrice)}
          onChangeText={(value) =>
            updateField("defaultFuelPrice", Number(value) || 0)
          }
          keyboardType="decimal-pad"
          style={styles.input}
        />
      </SettingRow>

      {/* Preferred transport selection */}
      <View style={styles.transportBlock}>
        <Text style={styles.transportTitle}>Preferred Transport Modes</Text>

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

// Styles
const styles = StyleSheet.create({
  // Main settings card
  panel: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },

  // Settings title
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },

  // Input fields for text and numbers
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

  // Container for transport preferences
  transportBlock: {
    marginTop: 18,
  },

  // Title for transport selector
  transportTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },

  // Space above transport buttons
  transportSelector: {
    marginTop: 12,
  },
});
