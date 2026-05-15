import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { getProfileSettings, saveProfileSettings } from "../api/storageApi";

import ProfileHeader from "../components/profile/ProfileHeader";
import SettingsPanel from "../components/profile/SettingsPanel";
import { COLORS } from "../styles/colors";

export default function ProfilePage() {
  const [settings, setSettings] = useState(() => getProfileSettings());

  useEffect(() => {
    saveProfileSettings(settings);
  }, [settings]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profil</Text>

      <Text style={styles.subtitle}>
        Verwalte Standort, Budget und App-Einstellungen.
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
