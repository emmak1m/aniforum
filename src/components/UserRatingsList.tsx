import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Image, Rating } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { UserRating } from '../services/ratingService';
import { useTheme } from '../context/ThemeContext';
import { Anime } from '../services/jikanService';

interface UserRatingsListProps {
    ratings: UserRating[];
    animeDetails: Record<number, Anime>;
}

export const UserRatingsList: React.FC<UserRatingsListProps> = ({ ratings, animeDetails }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { colors } = useTheme();

    const getAverageRating = (rating: UserRating) => {
        const sum = rating.ratings.reduce((acc, curr) => acc + curr.value, 0);
        return sum / rating.ratings.length;
    };

    return (
        <ScrollView style={styles.container}>
            {ratings.map((rating) => {
                const anime = animeDetails[rating.animeId];
                if (!anime) return null;

                return (
                    <TouchableOpacity
                        key={`${rating.animeId}-${rating.timestamp}`}
                        style={[styles.ratingCard, { backgroundColor: colors.card }]}
                        onPress={() => navigation.navigate('AnimeDetails', { animeId: rating.animeId })}
                    >
                        <Image
                            source={{ uri: anime.images.jpg.large_image_url }}
                            style={styles.animeImage}
                        />
                        <View style={styles.ratingContent}>
                            <Text style={[styles.animeTitle, { color: colors.text }]} numberOfLines={2}>
                                {anime.title}
                            </Text>
                            <View style={styles.ratingSummary}>
                                <Rating
                                    readonly
                                    startingValue={getAverageRating(rating)}
                                    imageSize={20}
                                    style={styles.rating}
                                />
                                <Text style={[styles.ratingValue, { color: colors.textSecondary }]}>
                                    {getAverageRating(rating).toFixed(1)}
                                </Text>
                            </View>
                            <View style={styles.categoryRatings}>
                                {rating.ratings.map((category) => (
                                    <View key={category.name} style={styles.categoryRating}>
                                        <Text style={[styles.categoryName, { color: colors.textSecondary }]}>
                                            {category.name}:
                                        </Text>
                                        <Text style={[styles.categoryValue, { color: colors.text }]}>
                                            {category.value.toFixed(1)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            {rating.review && (
                                <Text style={[styles.review, { color: colors.textSecondary }]} numberOfLines={2}>
                                    {rating.review}
                                </Text>
                            )}
                            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                                {new Date(rating.timestamp).toLocaleDateString()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ratingCard: {
        flexDirection: 'row',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    animeImage: {
        width: 80,
        height: 120,
        borderRadius: 4,
        marginRight: 15,
    },
    ratingContent: {
        flex: 1,
    },
    animeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ratingSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    rating: {
        marginRight: 8,
    },
    ratingValue: {
        fontSize: 14,
    },
    categoryRatings: {
        marginBottom: 8,
    },
    categoryRating: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    categoryName: {
        fontSize: 12,
        marginRight: 8,
        width: 80,
    },
    categoryValue: {
        fontSize: 12,
    },
    review: {
        fontSize: 12,
        marginBottom: 8,
        fontStyle: 'italic',
    },
    timestamp: {
        fontSize: 10,
    },
}); 