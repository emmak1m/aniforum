import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { useTheme } from '../context/ThemeContext';
import { HomeStackNavigator } from './HomeStackNavigator';
import { SearchScreen } from '../screens/SearchScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStackNavigator}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" type="font-awesome" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="search" type="font-awesome" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="NotificationsTab"
                component={NotificationsScreen}
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="bell" type="font-awesome" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="user" type="font-awesome" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}; 