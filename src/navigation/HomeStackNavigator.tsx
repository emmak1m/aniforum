import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { AnimeDetailsScreen } from '../screens/AnimeDetailsScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const HomeStackNavigator = () => {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
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
        </Stack.Navigator>
    );
}; 