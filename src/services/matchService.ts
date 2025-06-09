import { IUser } from '../models/User';
import { searchAnime, getAnimeDetails } from './jikanService';
import { Anime } from '../types';

export const calculateMatchPercentage = async (
    user: IUser,
    animeId: number
): Promise<number> => {
    try {
        const animeDetails = await getAnimeDetails(animeId);
        if (!animeDetails) return 0;

        const userPreferences = user.preferences;
        const watchedAnime = user.animeHistory.watchedAnime;

        let matchScore = 0;
        let totalFactors = 0;

        // Genre matching (30% weight)
        if (animeDetails.genres) {
            const animeGenres = animeDetails.genres.map(g => g.name.toLowerCase());
            const userFavoriteGenres = userPreferences.favoriteGenres.map(g => g.toLowerCase());
            const genreMatches = animeGenres.filter(g => userFavoriteGenres.includes(g));
            matchScore += (genreMatches.length / animeGenres.length) * 30;
            totalFactors += 30;
        }

        // Rating-based matching (40% weight)
        const similarRatedAnime = watchedAnime.filter(a =>
            Math.abs(a.rating - animeDetails.score) <= 2
        );
        if (watchedAnime.length > 0) {
            matchScore += (similarRatedAnime.length / watchedAnime.length) * 40;
            totalFactors += 40;
        }

        // Theme matching (20% weight)
        if (userPreferences.preferredThemes.length > 0) {
            const animeThemes = animeDetails.themes?.map(t => t.name.toLowerCase()) || [];
            const themeMatches = animeThemes.filter(t =>
                userPreferences.preferredThemes.map(pt => pt.toLowerCase()).includes(t)
            );
            matchScore += (themeMatches.length / animeThemes.length) * 20;
            totalFactors += 20;
        }

        // Animation style matching (10% weight)
        if (userPreferences.preferredAnimationStyle.length > 0) {
            const animeStyle = animeDetails.studios?.[0]?.name.toLowerCase() || '';
            const styleMatch = userPreferences.preferredAnimationStyle
                .map(s => s.toLowerCase())
                .includes(animeStyle);
            matchScore += (styleMatch ? 10 : 0);
            totalFactors += 10;
        }

        return totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 0;
    } catch (error) {
        console.error('Error calculating match percentage:', error);
        return 0;
    }
};

export const processOnboardingAnime = async (
    user: IUser,
    animeList: Array<{ title: string; rating: number; status: string }>
): Promise<void> => {
    try {
        for (const anime of animeList) {
            const searchResults = await searchAnime(anime.title);
            if (searchResults.length > 0) {
                const animeDetails = searchResults[0];
                const matchPercentage = await calculateMatchPercentage(user, animeDetails.mal_id);

                user.animeHistory.watchedAnime.push({
                    animeId: animeDetails.mal_id,
                    title: animeDetails.title,
                    rating: anime.rating,
                    status: anime.status as 'completed' | 'watching' | 'dropped' | 'plan_to_watch',
                    genres: animeDetails.genres.map(g => g.name),
                    matchScore: matchPercentage
                });
            }
        }

        user.animeHistory.totalWatched = animeList.length;
        user.onboardingCompleted = true;
        await user.save();
    } catch (error) {
        console.error('Error processing onboarding anime:', error);
        throw error;
    }
};

export const updateMatchScores = async (user: IUser): Promise<void> => {
    try {
        for (const anime of user.animeHistory.watchedAnime) {
            const matchPercentage = await calculateMatchPercentage(user, anime.animeId);
            anime.matchScore = matchPercentage;
        }
        await user.save();
    } catch (error) {
        console.error('Error updating match scores:', error);
        throw error;
    }
}; 