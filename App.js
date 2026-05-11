import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from './theme/theme';

import CalendarScreen from './screens/CalendarScreen';
import FuelScreen from './screens/FuelScreen';
import MapScreen from './screens/Map';
import RouteScreen from './screens/RouteScreen';
import SearchScreen from './screens/SearchScreen';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: 'gray',
                    headerStyle: { backgroundColor: COLORS.primary },
                    headerTintColor: '#fff',
                }}
            >
                <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Suche' }} />
                <Tab.Screen name="Route" component={RouteScreen} options={{ title: 'Route' }} />
                <Tab.Screen name="Fuel" component={FuelScreen} options={{ title: 'Sprit' }} />
                <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Kalender' }} />
                <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Karte' }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}