import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SearchBar, Text, Card, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { searchAnime, Anime } from '../services/jikanService';
import { useTheme } from '../context/ThemeContext';

type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;
type SearchResultsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchResults'>;

export const SearchResultsScreen = () => {
    const route = useRoute<SearchResultsRouteProp>();
    const navigation = useNavigation<SearchResultsNavigationProp>();
    const { colors } = useTheme();
    const [search, setSearch] = useState(route.params?.searchQuery || '');
    const [results, setResults] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (search.length > 2) {
            performSearch();
        }
    }, [search]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const searchResults = await searchAnime(search);
            setResults(searchResults);
        } catch (error) {
            console.error('Error searching anime:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderAnimeItem = ({ item }: { item: Anime }) => (
        <Card containerStyle={[styles.card, { backgroundColor: colors.card }]}>
            <Card.Image
                source={{ uri: item.images.jpg.large_image_url }}
                style={styles.image}
            />
            <Card.Title style={{ color: colors.text }}>{item.title}</Card.Title>
            <Text style={{ color: colors.textSecondary }}>Score: {item.score}</Text>
            <Button
                title="View Details"
                onPress={() => navigation.navigate('AnimeDetails', { animeId: item.mal_id })}
                containerStyle={styles.button}
            />
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={24}
                    onPress={() => navigation.goBack()}
                    containerStyle={styles.backButton}
                    color={colors.text}
                />
                <Text h4 style={[styles.title, { color: colors.text }]}>Search Results</Text>
            </View>

            <SearchBar
                placeholder="Search anime..."
                onChangeText={setSearch}
                value={search}
                platform="ios"
                showLoading={loading}
                containerStyle={[styles.searchBarContainer, { backgroundColor: colors.background }]}
                inputContainerStyle={[styles.searchBarInputContainer, { backgroundColor: colors.searchBackground }]}
                inputStyle={{ color: colors.searchText }}
                placeholderTextColor={colors.searchPlaceholder}
            />
            <FlatList
                data={results}
                renderItem={renderAnimeItem}
                keyExtractor={(item) => item.mal_id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        {search.length > 2 ? 'No results found' : 'Type at least 3 characters to search'}
                    </Text>
                }
            />
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
    searchBarContainer: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 0,
        marginHorizontal: 15,
        marginTop: 10,
    },
    searchBarInputContainer: {
        borderRadius: 10,
    },
    list: {
        padding: 10,
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
    },
    image: {
        height: 200,
        borderRadius: 10,
    },
    button: {
        marginTop: 10,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
    },
}); 