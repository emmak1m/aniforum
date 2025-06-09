import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput } from 'react-native';
import { Text, Image, Button, Icon, Rating, Overlay } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getAnimeDetails, Anime } from '../services/jikanService';
import { getAlternativeTitles } from '../services/deepseekService';
import { useTheme } from '../context/ThemeContext';
import { RatingCategory, ratingCategories } from '../types/rating';

type AnimeDetailsRouteProp = RouteProp<RootStackParamList, 'AnimeDetails'>;
type AnimeDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AnimeDetails'>;

// Function to check if a string contains Japanese characters or is likely romaji
const containsJapanese = (text: string): boolean => {
    // Check for actual Japanese characters
    const japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    if (japaneseRegex.test(text)) return true;

    // Check for common Japanese words in romaji
    const commonJapaneseWords = [
        'shoujo', 'shounen', 'seinen', 'josei', 'manga', 'anime', 'kawaii', 'baka',
        'sensei', 'senpai', 'kouhai', 'onii-chan', 'onee-chan', 'otaku', 'neko',
        'sakura', 'samurai', 'ninja', 'bushido', 'katana', 'kimono', 'sushi',
        'ramen', 'tempura', 'sake', 'miso', 'wasabi', 'matcha', 'konnichiwa',
        'arigatou', 'sayonara', 'ohayou', 'konbanwa', 'oyasumi', 'itadakimasu',
        'gochisousama', 'sumimasen', 'gomen', 'daijoubu', 'ganbatte', 'kawaii',
        'sugoi', 'kakkoii', 'kawaii', 'moe', 'tsundere', 'yandere', 'dere',
        'baka', 'aho', 'urusai', 'urusai', 'chibi', 'hentai', 'ecchi', 'yaoi',
        'yuri', 'shoujo-ai', 'shounen-ai', 'mecha', 'isekai', 'mahou', 'shoujo',
        'mahou shoujo', 'meitantei', 'shinigami', 'youkai', 'yokai', 'kami',
        'tenshi', 'akuma', 'majin', 'majo', 'mahoutsukai', 'miko', 'shrine',
        'temple', 'dojo', 'ryokan', 'onsen', 'sento', 'tatami', 'futon',
        'shoji', 'fusuma', 'kotatsu', 'zabuton', 'geta', 'zori', 'tabi',
        'yukata', 'obi', 'haori', 'hakama', 'jinbei', 'fundoshi', 'geta',
        'waraji', 'zori', 'geta', 'waraji', 'zori', 'geta', 'waraji', 'zori'
    ];

    // Convert to lowercase for comparison
    const lowerText = text.toLowerCase();

    // Check if the text contains any common Japanese words
    return commonJapaneseWords.some(word => lowerText.includes(word));
};

export const AnimeDetailsScreen = () => {
    const route = useRoute<AnimeDetailsRouteProp>();
    const navigation = useNavigation<AnimeDetailsNavigationProp>();
    const [anime, setAnime] = useState<Anime | null>(null);
    const [loading, setLoading] = useState(true);
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratings, setRatings] = useState<RatingCategory[]>(ratingCategories);
    const [review, setReview] = useState('');
    const { colors } = useTheme();

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                const details = await getAnimeDetails(route.params.animeId);
                setAnime(details);
            } catch (error) {
                console.error('Error fetching anime details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeDetails();
    }, [route.params.animeId]);

    const handleRatingChange = (index: number, value: number) => {
        const roundedValue = Math.round(value * 2) / 2;
        const clampedValue = Math.max(0, Math.min(5, roundedValue));

        setRatings(prevRatings => {
            const newRatings = [...prevRatings];
            newRatings[index] = {
                ...newRatings[index],
                value: clampedValue
            };
            return newRatings;
        });
    };

    const handleSubmitRating = () => {
        if (anime) {
            const newRating = {
                animeId: anime.mal_id,
                animeTitle: anime.title,
                rating: ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length,
                review: review,
                timestamp: new Date().toISOString(),
            };
            setShowRatingModal(false);
            setReview('');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (!anime) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Anime not found</Text>
            </SafeAreaView>
        );
    }

    const getMatchColor = (percentage: number) => {
        if (percentage >= 70) return '#4CAF50'; // Green
        if (percentage >= 50) return '#FFA500'; // Orange
        return '#F44336'; // Red
    };

    const renderTitle = () => {
        const hasJapanese = containsJapanese(anime.title);
        const hasEnglishTitle = anime.title_english && anime.title_english !== anime.title;

        return (
            <View>
                <Text h4 style={[styles.title, { color: colors.text }]}>{anime.title}</Text>
                {(hasJapanese || hasEnglishTitle) && (
                    <View style={styles.alternativeTitles}>
                        {hasEnglishTitle && (
                            <Text style={[styles.alternativeTitle, { color: colors.textSecondary }]}>
                                ({anime.title_english})
                            </Text>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const renderStar = (index: number, category: RatingCategory) => {
        const isHalf = category.value % 1 !== 0;
        const isFilled = Math.floor(category.value) > index;
        const isCurrentHalf = Math.floor(category.value) === index && isHalf;

        return (
            <View key={index} style={styles.starWrapper}>
                <Icon
                    name="star"
                    type="font-awesome"
                    size={30}
                    color={isFilled ? colors.primary : colors.border}
                />
                {isCurrentHalf && (
                    <Icon
                        name="star-half"
                        type="font-awesome"
                        size={30}
                        color={colors.primary}
                        containerStyle={styles.halfStar}
                    />
                )}
            </View>
        );
    };

    const renderRatingModal = () => (
        <Overlay
            isVisible={showRatingModal}
            onBackdropPress={() => setShowRatingModal(false)}
            overlayStyle={[styles.modal, { backgroundColor: colors.card }]}
        >
            <View style={styles.modalContent}>
                <View style={styles.modalTitleContainer}>
                    <Text h4 style={[styles.modalTitle, { color: colors.text }]}>{anime?.title}</Text>
                    {anime?.title_english && anime.title_english !== anime.title && (
                        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                            ({anime.title_english})
                        </Text>
                    )}
                </View>
                {ratings.map((category, index) => (
                    <View key={category.name} style={styles.ratingCategory}>
                        <View style={styles.ratingHeader}>
                            <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                            <View style={styles.ratingValueContainer}>
                                <Text style={[styles.categoryValue, { color: colors.textSecondary }]}>
                                    {category.value.toFixed(1)}
                                </Text>
                                <Text style={[styles.ratingMax, { color: colors.textSecondary }]}>/5.0</Text>
                            </View>
                        </View>
                        <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>
                            {category.description}
                        </Text>
                        <View style={styles.ratingControls}>
                            <TouchableOpacity
                                style={[styles.ratingButton, { backgroundColor: colors.primary }]}
                                onPress={() => handleRatingChange(index, category.value - 0.5)}
                            >
                                <Icon name="minus" type="font-awesome" size={16} color="white" />
                            </TouchableOpacity>
                            <View style={styles.starsContainer}>
                                {[...Array(5)].map((_, i) => renderStar(i, category))}
                            </View>
                            <TouchableOpacity
                                style={[styles.ratingButton, { backgroundColor: colors.primary }]}
                                onPress={() => handleRatingChange(index, category.value + 0.5)}
                            >
                                <Icon name="plus" type="font-awesome" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <TextInput
                    style={[styles.reviewInput, {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border
                    }]}
                    placeholder="Write a review (optional)"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={4}
                    value={review}
                    onChangeText={setReview}
                />
                <View style={styles.modalButtons}>
                    <Button
                        title="Cancel"
                        type="outline"
                        onPress={() => setShowRatingModal(false)}
                        buttonStyle={[styles.modalButton, { width: 'auto' }]}
                        containerStyle={styles.modalButtonContainer}
                    />
                    <Button
                        title="Submit"
                        onPress={handleSubmitRating}
                        buttonStyle={[styles.modalButton, { width: 'auto' }]}
                        containerStyle={styles.modalButtonContainer}
                    />
                </View>
            </View>
        </Overlay>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView>
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" type="font-awesome" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsImageExpanded(true)}>
                        <Image
                            source={{ uri: anime.images.jpg.large_image_url }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[styles.content, { backgroundColor: colors.background }]}>
                    {renderTitle()}
                    <View style={styles.matchContainer}>
                        <Text style={[styles.matchText, { color: colors.text }]}>
                            Match with your preferences: {getMatchColor(0)}
                        </Text>
                        <View style={styles.matchBarContainer}>
                            <View
                                style={[
                                    styles.matchBar,
                                    {
                                        width: '0%',
                                        backgroundColor: getMatchColor(0)
                                    }
                                ]}
                            />
                        </View>
                    </View>
                    <View style={styles.stats}>
                        <Text style={{ color: colors.text }}>Score: {anime.score}</Text>
                        <Text style={{ color: colors.text }}>Episodes: {anime.episodes}</Text>
                        <Text style={{ color: colors.text }}>Status: {anime.status}</Text>
                        <Text style={{ color: colors.text }}>Aired: {anime.aired.string}</Text>
                    </View>
                    <View style={styles.genres}>
                        {anime.genres.map((genre) => (
                            <Text key={genre.name} style={[styles.genre, { backgroundColor: colors.primary }]}>
                                {genre.name}
                            </Text>
                        ))}
                    </View>
                    <Text style={[styles.synopsis, { color: colors.text }]}>{anime.synopsis}</Text>
                    <View style={styles.ratingSection}>
                        <Button
                            title="Rate This Anime"
                            icon={<Icon name="star" type="font-awesome" size={20} color="white" />}
                            onPress={() => setShowRatingModal(true)}
                            buttonStyle={styles.rateButton}
                        />
                    </View>
                    <Button
                        title="Add to Watchlist"
                        icon={<Icon name="plus" type="font-awesome" size={20} color="white" />}
                        containerStyle={styles.button}
                    />
                </View>
            </ScrollView>

            <Modal
                visible={isImageExpanded}
                transparent={true}
                onRequestClose={() => setIsImageExpanded(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setIsImageExpanded(false)}
                    >
                        <Icon
                            name="times"
                            type="font-awesome"
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: anime.images.jpg.large_image_url }}
                        style={styles.expandedImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
            {renderRatingModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: 15,
    },
    title: {
        marginBottom: 5,
    },
    alternativeTitles: {
        marginTop: 4,
    },
    alternativeTitle: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    matchContainer: {
        marginBottom: 15,
    },
    matchText: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: '500',
    },
    matchBarContainer: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    matchBar: {
        height: '100%',
    },
    stats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    genres: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    genre: {
        color: 'white',
        padding: 5,
        margin: 5,
        borderRadius: 5,
    },
    synopsis: {
        marginBottom: 20,
        lineHeight: 20,
    },
    button: {
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 80,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 2,
    },
    expandedImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    ratingSection: {
        padding: 16,
        alignItems: 'center',
    },
    rateButton: {
        borderRadius: 8,
        paddingHorizontal: 20,
    },
    modal: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 12,
        padding: 0,
    },
    modalContent: {
        padding: 16,
    },
    modalTitleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    ratingCategory: {
        marginBottom: 16,
    },
    ratingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ratingValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    categoryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 4,
    },
    ratingMax: {
        fontSize: 14,
        opacity: 0.7,
    },
    categoryDescription: {
        fontSize: 12,
        marginBottom: 8,
    },
    ratingControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    ratingButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    starWrapper: {
        marginHorizontal: 2,
        position: 'relative',
    },
    halfStar: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    overlayStarIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    modalButtonContainer: {
        flex: 0,
    },
    modalButton: {
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    reviewInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
}); 