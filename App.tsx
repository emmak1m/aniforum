import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { AnimeProvider } from './src/context/AnimeContext';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <ThemeProvider>
          <AnimeProvider>
            <BottomTabNavigator />
          </AnimeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
