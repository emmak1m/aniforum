import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getTopAnime, Anime, getTopManga, Manga } from '../services/jikanService';
import { getAlternativeTitles } from '../services/deepseekService';
import { useTheme } from '../context/ThemeContext';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [mangaList, setMangaList] = useState<Manga[]>([]);
    const [alternativeTitles, setAlternativeTitles] = useState<Record<number, string[]>>({});
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<HomeNavigationProp>();
    const { colors } = useTheme();

    const fetchData = async () => {
        try {
            const [topAnime, topManga] = await Promise.all([
                getTopAnime(),
                getTopManga()
            ]);
            setAnimeList(topAnime);
            setMangaList(topManga);

            // Fetch alternative titles for anime
            const titlesPromises = topAnime.map(async (anime) => {
                const titles = await getAlternativeTitles(anime.title);
                return { id: anime.mal_id, titles };
            });

            const titlesResults = await Promise.all(titlesPromises);
            const titlesMap = titlesResults.reduce((acc, { id, titles }) => {
                acc[id] = titles;
                return acc;
            }, {} as Record<number, string[]>);

            setAlternativeTitles(titlesMap);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const renderAnimeCard = (anime: Anime) => {
        const hasEnglishTitle = anime.title_english && anime.title_english !== anime.title;
        const hasAlternativeTitle = alternativeTitles[anime.mal_id]?.length > 0;

        return (
            <Card key={anime.mal_id} containerStyle={[styles.animeCard, { backgroundColor: colors.card }]}>
                <Card.Image
                    source={{ uri: anime.images.jpg.large_image_url }}
                    style={styles.image}
                />
                <View style={styles.animeContent}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.animeTitle, { color: colors.text }]} numberOfLines={2}>
                            {anime.title}
                        </Text>
                        {(hasEnglishTitle || hasAlternativeTitle) && (
                            <Text style={[styles.alternativeTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                                {hasEnglishTitle ? anime.title_english : alternativeTitles[anime.mal_id]?.[0]}
                            </Text>
                        )}
                    </View>
                    <Text style={[styles.score, { color: colors.textSecondary }]}>
                        Score: {anime.score}
                    </Text>
                    <Button
                        title="View Details"
                        onPress={() => navigation.navigate('AnimeDetails', { animeId: anime.mal_id })}
                        buttonStyle={styles.viewButton}
                    />
                </View>
            </Card>
        );
    };

    const renderMangaCard = (manga: Manga) => {
        const hasEnglishTitle = manga.title_english && manga.title_english !== manga.title;

        return (
            <Card key={manga.mal_id} containerStyle={[styles.mangaCard, { backgroundColor: colors.card }]}>
                <Card.Image
                    source={{ uri: manga.images.jpg.large_image_url }}
                    style={styles.mangaImage}
                />
                <View style={styles.mangaContent}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.mangaTitle, { color: colors.text }]} numberOfLines={2}>
                            {manga.title}
                        </Text>
                        {hasEnglishTitle && (
                            <Text style={[styles.alternativeTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                                {manga.title_english}
                            </Text>
                        )}
                    </View>
                    <Text style={[styles.chapters, { color: colors.textSecondary }]}>
                        {manga.chapters || 'Ongoing'} chapters
                    </Text>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={[styles.section, { backgroundColor: colors.background }]}>
                    <View style={[styles.header, { backgroundColor: colors.card }]}>
                        <Text h4 style={[styles.title, { color: colors.text }]}>Top Anime</Text>
                        <Button
                            icon={<Icon name="search" size={20} color="white" />}
                            title="Search"
                            onPress={() => navigation.navigate('Search')}
                            buttonStyle={styles.searchButton}
                        />
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScroll}
                    >
                        {animeList.map(renderAnimeCard)}
                    </ScrollView>
                </View>

                <View style={[styles.section, { backgroundColor: colors.background }]}>
                    <View style={[styles.header, { backgroundColor: colors.card }]}>
                        <Text h4 style={[styles.title, { color: colors.text }]}>Trending Manga</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScroll}
                    >
                        {mangaList.map(renderMangaCard)}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        elevation: 2,
    },
    title: {
        marginBottom: 4,
    },
    searchButton: {
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    horizontalScroll: {
        paddingHorizontal: 16,
    },
    animeCard: {
        width: 280,
        marginRight: 16,
        borderRadius: 12,
        padding: 0,
        margin: 0,
        elevation: 2,
    },
    image: {
        height: 200,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    animeContent: {
        padding: 12,
    },
    titleContainer: {
        marginBottom: 8,
    },
    animeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    alternativeTitle: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    score: {
        fontSize: 14,
        marginBottom: 12,
    },
    viewButton: {
        borderRadius: 6,
    },
    mangaCard: {
        width: 160,
        marginRight: 16,
        borderRadius: 12,
        padding: 0,
        margin: 0,
        elevation: 2,
    },
    mangaImage: {
        height: 240,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    mangaContent: {
        padding: 12,
    },
    mangaTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    chapters: {
        fontSize: 12,
    },
}); 