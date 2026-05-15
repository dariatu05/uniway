import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { COLORS } from "./styles/colors";

import FavoritesPage from "./pages/FavoritesPage";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";

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
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: COLORS.surface,
            tabBarStyle: { backgroundColor: COLORS.surface },
          })}
        >
          <Tab.Screen name="Suche" component={SearchPage} />
          <Tab.Screen name="Map" component={MapPage} />
          <Tab.Screen name="Favoriten" component={FavoritesPage} />
          <Tab.Screen name="Profil" component={ProfilePage} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
