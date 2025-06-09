import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Image, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { Anime } from '../services/jikanService';

type FavoritesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

const mockFavorites: Anime[] = [
    {
        mal_id: 1,
        title: 'Attack on Titan',
        images: {
            jpg: {
                large_image_url: 'https://example.com/aot.jpg',
            },
        },
        score: 9.0,
        episodes: 75,
        status: 'Completed',
        aired: {
            string: '2013-2017',
        },
        genres: [
            { name: 'Action' },
            { name: 'Drama' },
            { name: 'Fantasy' },
        ],
    },
    {
        mal_id: 2,
        title: 'Demon Slayer',
        images: {
            jpg: {
                large_image_url: 'https://example.com/ds.jpg',
            },
        },
        score: 8.5,
        episodes: 26,
        status: 'Completed',
        aired: {
            string: '2019-2020',
        },
        genres: [
            { name: 'Action' },
            { name: 'Fantasy' },
            { name: 'Supernatural' },
        ],
    },
];

export const FavoritesScreen = () => {
    const navigation = useNavigation<FavoritesNavigationProp>();
    const { colors } = useTheme();

    const renderFavoriteItem = ({ item }: { item: Anime }) => (
        <TouchableOpacity
            style={[styles.favoriteItem, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('AnimeDetails', { animeId: item.mal_id })}
        >
            <Image
                source={{ uri: item.images.jpg.large_image_url }}
                style={styles.animeImage}
            />
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.details}>
                    <Text style={[styles.detail, { color: colors.textSecondary }]}>
                        Score: {item.score}
                    </Text>
                    <Text style={[styles.detail, { color: colors.textSecondary }]}>
                        Episodes: {item.episodes}
                    </Text>
                    <Text style={[styles.detail, { color: colors.textSecondary }]}>
                        Status: {item.status}
                    </Text>
                </View>
                <View style={styles.genres}>
                    {item.genres.map((genre) => (
                        <Text
                            key={genre.name}
                            style={[styles.genre, { backgroundColor: colors.primary }]}
                        >
                            {genre.name}
                        </Text>
                    ))}
                </View>
            </View>
            <Icon
                name="heart"
                type="font-awesome"
                color={colors.primary}
                size={20}
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={mockFavorites}
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => item.mal_id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={{ color: colors.text }}>No favorites yet</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        padding: 10,
    },
    favoriteItem: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 2,
    },
    animeImage: {
        width: 80,
        height: 120,
        borderRadius: 5,
        marginRight: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    details: {
        marginBottom: 5,
    },
    detail: {
        fontSize: 12,
        marginBottom: 2,
    },
    genres: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genre: {
        fontSize: 10,
        padding: 3,
        marginRight: 5,
        marginBottom: 5,
        borderRadius: 3,
        color: 'white',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
}); 