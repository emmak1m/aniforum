import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const SignInScreen = () => {
    const { signInWithGoogle } = useAuth();
    const { colors } = useTheme();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                /> */}
                <Text h2 style={[styles.title, { color: colors.text }]}>
                    Welcome to Anime Social
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Sign in to rate anime, get recommendations, and connect with other fans
                </Text>
                <Button
                    title="Sign in with Google"
                    icon={{
                        name: 'google',
                        type: 'font-awesome',
                        color: 'white',
                        size: 20,
                    }}
                    onPress={handleGoogleSignIn}
                    buttonStyle={[styles.googleButton, { backgroundColor: colors.primary }]}
                    containerStyle={styles.buttonContainer}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    googleButton: {
        paddingVertical: 12,
    },
}); 