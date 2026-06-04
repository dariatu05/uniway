// Hauptdatei, die die Navigation und die grundlegende Struktur der App definiert
// App.js
// Location: src/App.js
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { COLORS } from "./styles/colors";

import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";

import { Text, View } from "react-native";
import TabBarIcon from "./components/TabBarIcon";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <TabBarIcon routeName={route.name} focused={focused} />
            ),

            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: "#999999",

            headerTitleAlign: "center",

            headerTitle: () => (
              <View
                style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "900",
                    color: COLORS.surface,
                  }}
                >
                  UniWay
                </Text>

                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: COLORS.surface,
                  }}
                >
                  {route.name}
                </Text>
              </View>
            ),

            headerStyle: {
              backgroundColor: COLORS.primary,
            },

            headerTintColor: COLORS.surface,
          })}
        >
          {/* MAIN SCREENS */}
          <Tab.Screen
            name="Search"
            component={SearchPage}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();

                navigation.navigate("Search", {
                  resetSearch: Date.now(),
                });
              },
            })}
          />
          <Tab.Screen name="Favorites" component={FavoritesPage} />
          <Tab.Screen name="Profile" component={ProfilePage} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
