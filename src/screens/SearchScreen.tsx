import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Text, SearchBar } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { AnimeCard } from '../components/AnimeCard';
import { useAnime } from '../context/AnimeContext';
import { Anime } from '../services/jikanService';

const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'
];

const { width } = Dimensions.get('window');
const GENRE_WIDTH = width / 2;

export const SearchScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const { colors } = useTheme();
    const { animeList } = useAnime();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setShowResults(false);
            return;
        }

        const results = animeList.filter(anime =>
            anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            anime.title_english?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            anime.title_japanese?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredAnime(results);
        setShowResults(true);
    }, [searchQuery, animeList]);

    const handleGenrePress = (genre: string) => {
        navigation.navigate('Genre', { genreName: genre });
    };

    const renderGenreItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.genreButton,
                {
                    backgroundColor: colors.card,
                    width: GENRE_WIDTH
                }
            ]}
            onPress={() => handleGenrePress(item)}
        >
            <Text style={[styles.genreText, { color: colors.text }]}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card }]}>
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

            <FlatList
                data={genres}
                renderItem={renderGenreItem}
                keyExtractor={item => item}
                numColumns={2}
                scrollEnabled={false}
                style={[styles.genreContainer, { backgroundColor: colors.card }]}
            />

            {showResults && (
                <View style={styles.resultsContainer}>
                    <Text style={[styles.resultsTitle, { color: colors.text }]}>
                        Search results for "{searchQuery}"
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
            )}
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
    searchBar: {
        marginBottom: 8,
        padding: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    genreContainer: {
        padding: 0,
    },
    genreButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#e0e0e0',
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