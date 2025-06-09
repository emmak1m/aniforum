import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    isDarkMode: boolean;
    setTheme: (theme: Theme) => void;
    colors: {
        primary: string;
        background: string;
        card: string;
        text: string;
        border: string;
        notification: string;
        searchBackground: string;
        textSecondary: string;
        searchText: string;
        searchPlaceholder: string;
    };
}

const lightColors = {
    primary: '#2089dc',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
    notification: '#ff3b30',
    searchBackground: '#f0f0f0',
    textSecondary: '#666666',
    searchText: '#000000',
    searchPlaceholder: '#999999',
};

const darkColors = {
    primary: '#2089dc',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#333333',
    notification: '#ff453a',
    searchBackground: '#2c2c2c',
    textSecondary: '#999999',
    searchText: '#ffffff',
    searchPlaceholder: '#666666',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState<Theme>('system');
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        if (theme === 'system') {
            setIsDarkMode(systemColorScheme === 'dark');
        } else {
            setIsDarkMode(theme === 'dark');
        }
    }, [theme, systemColorScheme]);

    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, setTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 