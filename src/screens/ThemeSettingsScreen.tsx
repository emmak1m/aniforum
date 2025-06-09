import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';

type ThemeSettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ThemeSettings'>;

export const ThemeSettingsScreen = () => {
    const navigation = useNavigation<ThemeSettingsNavigationProp>();
    const { theme, setTheme, colors } = useTheme();

    const themeOptions = [
        { label: 'Light', value: 'light' as const },
        { label: 'Dark', value: 'dark' as const },
        { label: 'System', value: 'system' as const },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={24}
                    onPress={() => navigation.goBack()}
                    containerStyle={styles.backButton}
                    color={colors.text}
                />
                <Text h4 style={[styles.title, { color: colors.text }]}>Theme Settings</Text>
            </View>
            <View style={styles.content}>
                {themeOptions.map((option) => (
                    <Button
                        key={option.value}
                        title={option.label}
                        onPress={() => setTheme(option.value)}
                        containerStyle={styles.buttonContainer}
                        buttonStyle={[
                            styles.button,
                            {
                                backgroundColor: theme === option.value ? colors.primary : colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                        titleStyle={{
                            color: theme === option.value ? '#ffffff' : colors.text,
                        }}
                        icon={theme === option.value ? {
                            name: "check",
                            type: "font-awesome",
                            size: 20,
                            color: "#ffffff"
                        } : undefined}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    buttonContainer: {
        marginBottom: 15,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
    },
    icon: {
        marginRight: 10,
    },
}); 