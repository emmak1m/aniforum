import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, SearchBar, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { AnimeCard } from '../components/AnimeCard';
import { useAnime } from '../context/AnimeContext';

type ExploreNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'
];

export const ExploreScreen = () => {
    const navigation = useNavigation<ExploreNavigationProp>();
    const { colors } = useTheme();
    const { animeList } = useAnime();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [filteredAnime, setFilteredAnime] = useState(animeList);

    useEffect(() => {
        let results = animeList;

        if (searchQuery) {
            results = results.filter(anime =>
                anime.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedGenre) {
            results = results.filter(anime =>
                anime.genres.some(genre => genre.name === selectedGenre)
            );
        }

        setFilteredAnime(results);
    }, [searchQuery, selectedGenre, animeList]);

    const handleGenrePress = (genre: string) => {
        setSelectedGenre(selectedGenre === genre ? null : genre);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text h4 style={[styles.title, { color: colors.text }]}>Explore</Text>
                <SearchBar
                    placeholder="Search anime..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    platform="ios"
                    containerStyle={[styles.searchBar, { backgroundColor: colors.card }]}
                    inputContainerStyle={{ backgroundColor: colors.background }}
                    inputStyle={{ color: colors.text }}
                    placeholderTextColor={colors.textSecondary}
                />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.genreContainer, { backgroundColor: colors.card }]}
            >
                {genres.map((genre) => (
                    <TouchableOpacity
                        key={genre}
                        style={[
                            styles.genreButton,
                            {
                                backgroundColor: selectedGenre === genre ? colors.primary : colors.background,
                                borderColor: colors.border
                            }
                        ]}
                        onPress={() => handleGenrePress(genre)}
                    >
                        <Text style={[
                            styles.genreText,
                            { color: selectedGenre === genre ? 'white' : colors.text }
                        ]}>
                            {genre}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.resultsContainer}>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>
                    {selectedGenre ? `${selectedGenre} Anime` : 'All Anime'}
                </Text>
                <FlatList
                    data={filteredAnime}
                    renderItem={({ item }) => (
                        <AnimeCard
                            anime={item}
                            onPress={() => navigation.navigate('AnimeDetails', { animeId: item.mal_id })}
                        />
                    )}
                    keyExtractor={item => item.mal_id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        paddingBottom: 8,
    },
    title: {
        marginBottom: 16,
    },
    searchBar: {
        marginBottom: 8,
        padding: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    genreContainer: {
        padding: 8,
        marginBottom: 16,
    },
    genreButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 4,
        borderWidth: 1,
    },
    genreText: {
        fontSize: 14,
        fontWeight: '500',
    },
    resultsContainer: {
        flex: 1,
        padding: 16,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    grid: {
        paddingBottom: 16,
    },
}); 