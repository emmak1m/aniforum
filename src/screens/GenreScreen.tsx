import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { AnimeCard } from '../components/AnimeCard';
import { getAnimeByGenre, Anime } from '../services/jikanService';
import { useTheme } from '../context/ThemeContext';

type GenreRouteProp = RouteProp<RootStackParamList, 'Genre'>;
type GenreNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const GenreScreen = () => {
    const route = useRoute<GenreRouteProp>();
    const navigation = useNavigation<GenreNavigationProp>();
    const { colors } = useTheme();
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnimeByGenre = async () => {
            try {
                setLoading(true);
                const data = await getAnimeByGenre(route.params.genreName);
                setAnimeList(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch anime');
                console.error('Error fetching anime by genre:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeByGenre();
    }, [route.params.genreName]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>{error}</Text>
                <Button
                    title="Try Again"
                    onPress={() => navigation.goBack()}
                    buttonStyle={styles.button}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Button
                    icon={<Icon name="arrow-left" type="font-awesome" size={20} color={colors.text} />}
                    type="clear"
                    onPress={() => navigation.goBack()}
                />
                <Text h4 style={[styles.title, { color: colors.text }]}>
                    {route.params.genreName}
                </Text>
            </View>

            <FlatList
                data={animeList}
                renderItem={({ item }) => (
                    <AnimeCard
                        anime={item}
                        onPress={() => navigation.navigate('AnimeDetails', { animeId: item.mal_id })}
                    />
                )}
                keyExtractor={(item) => item.mal_id.toString()}
                numColumns={2}
                contentContainerStyle={styles.grid}
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
        padding: 16,
    },
    title: {
        marginLeft: 16,
    },
    grid: {
        padding: 8,
    },
    button: {
        marginTop: 16,
    },
}); 