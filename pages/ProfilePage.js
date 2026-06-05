// ProfilePage.js
// Page for displaying and managing user profile settings
// Location: src/pages/ProfilePage.js
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { getProfileSettings, saveProfileSettings } from "../api/storageApi";
import ProfileHeader from "../components/profile/ProfileHeader";
import SettingsPanel from "../components/profile/SettingsPanel";
import { COLORS } from "../styles/colors";

export default function ProfilePage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      const loadedSettings = await getProfileSettings();
      setSettings(loadedSettings);
    }

    loadSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      saveProfileSettings(settings);
    }
  }, [settings]);

  if (!settings) {
    return null;
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.subtitle}>
        Manage location, budget and app settings.
      </Text>

      <ProfileHeader
        name={settings.name}
        defaultLocation={settings.defaultLocation}
      />

      <SettingsPanel settings={settings} onChange={setSettings} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    color: COLORS.primary,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 18,
  },
});
