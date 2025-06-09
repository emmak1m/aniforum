import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { HomeScreen } from '../screens/HomeScreen';
import { AnimeDetailsScreen } from '../screens/AnimeDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ThemeSettingsScreen } from '../screens/ThemeSettingsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { GenreScreen } from '../screens/GenreScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    const { colors } = useTheme();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'AniForum' }}
                />
                <Stack.Screen
                    name="AnimeDetails"
                    component={AnimeDetailsScreen}
                    options={{ title: 'Details' }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ title: 'Profile' }}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{ title: 'Search' }}
                />
                <Stack.Screen
                    name="Explore"
                    component={ExploreScreen}
                    options={{ title: 'Explore' }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ title: 'Settings' }}
                />
                <Stack.Screen
                    name="ThemeSettings"
                    component={ThemeSettingsScreen}
                    options={{ title: 'Theme Settings' }}
                />
                <Stack.Screen
                    name="Notifications"
                    component={NotificationsScreen}
                    options={{ title: 'Notifications' }}
                />
                <Stack.Screen
                    name="Watchlist"
                    component={WatchlistScreen}
                    options={{ title: 'Watchlist' }}
                />
                <Stack.Screen
                    name="Favorites"
                    component={FavoritesScreen}
                    options={{ title: 'Favorites' }}
                />
                <Stack.Screen
                    name="Genre"
                    component={GenreScreen}
                    options={({ route }) => ({
                        title: route.params.genreName,
                        headerBackTitle: 'Back'
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}; 