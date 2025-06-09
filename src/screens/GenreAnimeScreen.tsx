import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SearchBar, Text, Card, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { searchAnime, Anime, getAnimeByGenre } from '../services/jikanService';

type GenreAnimeRouteProp = RouteProp<RootStackParamList, 'GenreAnime'>;
type GenreAnimeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GenreAnime'>;

export const GenreAnimeScreen = () => {
    const route = useRoute<GenreAnimeRouteProp>();
    const navigation = useNavigation<GenreAnimeNavigationProp>();
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);

    useEffect(() => {
        if (route.params?.genreId) {
            fetchAnimeByGenre();
        } else {
            setError('No genre selected');
            setLoading(false);
        }
    }, [route.params?.genreId]);

    useEffect(() => {
        if (search.length > 2) {
            const filtered = animeList.filter(anime =>
                anime.title.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredAnime(filtered);
        } else {
            setFilteredAnime(animeList);
        }
    }, [search, animeList]);

    const fetchAnimeByGenre = async () => {
        setLoading(true);
        setError(null);
        try {
            const animeList = await getAnimeByGenre(route.params.genreId);
            setAnimeList(animeList);
            setFilteredAnime(animeList);
        } catch (error) {
            console.error('Error fetching anime by genre:', error);
            setError('Failed to load anime. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderAnimeItem = ({ item }: { item: Anime }) => (
        <Card containerStyle={styles.card}>
            <Card.Image
                source={{ uri: item.images.jpg.large_image_url }}
                style={styles.image}
            />
            <Card.Title>{item.title}</Card.Title>
            <Text>Score: {item.score}</Text>
            <Button
                title="View Details"
                onPress={() => navigation.navigate('AnimeDetails', { animeId: item.mal_id })}
                containerStyle={styles.button}
            />
        </Card>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2089dc" />
                    <Text style={styles.loadingText}>Loading anime...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Icon name="error" type="material" size={50} color="#ff4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <Button
                        title="Go Back"
                        onPress={() => navigation.goBack()}
                        containerStyle={styles.button}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Icon
                    name="arrow-left"
                    type="font-awesome"
                    size={24}
                    onPress={() => navigation.goBack()}
                    containerStyle={styles.backButton}
                />
                <Text h4 style={styles.title}>{route.params.genreName}</Text>
            </View>
            <SearchBar
                placeholder="Search within genre..."
                onChangeText={setSearch}
                value={search}
                platform="ios"
            />
            <FlatList
                data={filteredAnime}
                renderItem={renderAnimeItem}
                keyExtractor={(item) => item.mal_id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        {search.length > 2 ? 'No matching anime found' : 'No anime found in this genre'}
                    </Text>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        flex: 1,
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
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        color: '#ff4444',
    },
}); 