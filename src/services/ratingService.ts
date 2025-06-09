import { RatingCategory } from '../types/rating';
import { Anime } from './jikanService';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export interface UserRating {
    userId: string;
    animeId: number;
    ratings: RatingCategory[];
    review: string;
    timestamp: number;
}

export const saveRating = async (rating: UserRating) => {
    const db = getFirestore();
    const ratingsRef = collection(db, 'ratings');

    try {
        await addDoc(ratingsRef, rating);
        return true;
    } catch (error) {
        console.error('Error saving rating:', error);
        return false;
    }
};

export const getUserRatings = async (userId: string) => {
    const db = getFirestore();
    const ratingsRef = collection(db, 'ratings');
    const q = query(ratingsRef, where('userId', '==', userId));

    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as UserRating);
    } catch (error) {
        console.error('Error fetching user ratings:', error);
        return [];
    }
};

export const getAnimeRatings = async (animeId: number) => {
    const db = getFirestore();
    const ratingsRef = collection(db, 'ratings');
    const q = query(ratingsRef, where('animeId', '==', animeId));

    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as UserRating);
    } catch (error) {
        console.error('Error fetching anime ratings:', error);
        return [];
    }
};

export const calculateMatchPercentage = (user1Ratings: UserRating[], user2Ratings: UserRating[]) => {
    if (user1Ratings.length === 0 || user2Ratings.length === 0) return 0;

    const commonAnime = user1Ratings.filter(rating1 =>
        user2Ratings.some(rating2 => rating2.animeId === rating1.animeId)
    );

    if (commonAnime.length === 0) return 0;

    let totalMatch = 0;
    let totalWeight = 0;

    commonAnime.forEach(rating1 => {
        const rating2 = user2Ratings.find(r => r.animeId === rating1.animeId);
        if (rating2) {
            rating1.ratings.forEach((cat1, index) => {
                const cat2 = rating2.ratings[index];
                const diff = Math.abs(cat1.value - cat2.value);
                const match = 1 - (diff / 5); // Convert difference to match percentage
                totalMatch += match;
                totalWeight += 1;
            });
        }
    });

    return Math.round((totalMatch / totalWeight) * 100);
};

export const getRecommendations = async (userId: string, limit: number = 5) => {
    const db = getFirestore();
    const ratingsRef = collection(db, 'ratings');

    try {
        // Get current user's ratings
        const userRatings = await getUserRatings(userId);
        if (userRatings.length === 0) return [];

        // Get all ratings
        const allRatings = await getDocs(ratingsRef);
        const ratingsByUser = new Map<string, UserRating[]>();

        // Group ratings by user
        allRatings.forEach(doc => {
            const rating = doc.data() as UserRating;
            if (rating.userId !== userId) {
                const userRatings = ratingsByUser.get(rating.userId) || [];
                userRatings.push(rating);
                ratingsByUser.set(rating.userId, userRatings);
            }
        });

        // Calculate match percentages and get recommendations
        const recommendations = new Map<number, { animeId: number, matchPercentage: number, count: number }>();

        ratingsByUser.forEach((otherUserRatings, otherUserId) => {
            const matchPercentage = calculateMatchPercentage(userRatings, otherUserRatings);

            // Get anime that the similar user rated highly but current user hasn't seen
            otherUserRatings.forEach(rating => {
                if (!userRatings.some(r => r.animeId === rating.animeId)) {
                    const existing = recommendations.get(rating.animeId);
                    if (existing) {
                        existing.matchPercentage = Math.max(existing.matchPercentage, matchPercentage);
                        existing.count += 1;
                    } else {
                        recommendations.set(rating.animeId, {
                            animeId: rating.animeId,
                            matchPercentage,
                            count: 1
                        });
                    }
                }
            });
        });

        // Sort by match percentage and count
        return Array.from(recommendations.values())
            .sort((a, b) => {
                if (a.matchPercentage !== b.matchPercentage) {
                    return b.matchPercentage - a.matchPercentage;
                }
                return b.count - a.count;
            })
            .slice(0, limit)
            .map(rec => rec.animeId);

    } catch (error) {
        console.error('Error getting recommendations:', error);
        return [];
    }
}; 