import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Image } from '@rneui/themed';
import { useTheme } from '../context/ThemeContext';
import { Anime } from '../services/jikanService';

interface AnimeCardProps {
    anime: Anime;
    onPress?: () => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onPress }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card }]}
            onPress={onPress}
        >
            <Image
                source={{ uri: anime.images.jpg.large_image_url }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                    {anime.title}
                </Text>
                <Text style={[styles.score, { color: colors.textSecondary }]}>
                    Score: {anime.score}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 200,
    },
    content: {
        padding: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    score: {
        fontSize: 12,
    },
}); 