import { IUser } from '../models/User';
import { searchAnime } from './jikanService';
import { calculateMatchPercentage } from './matchService';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const generateRecommendations = async (user: IUser): Promise<Array<{
    animeId: number;
    title: string;
    score: number;
    matchPercentage: number;
    reason: string;
}>> => {
    try {
        // Prepare user preferences for the prompt
        const preferences = `
      Favorite Genres: ${user.preferences.favoriteGenres.join(', ')}
      Favorite Anime: ${user.preferences.favoriteAnime.map(a => `${a.title} (${a.rating}/10)`).join(', ')}
      Watched Anime: ${user.animeHistory.watchedAnime.map(a => `${a.title} (${a.rating}/10)`).join(', ')}
      Preferred Animation Style: ${user.preferences.preferredAnimationStyle.join(', ')}
      Preferred Story Length: ${user.preferences.preferredStoryLength}
      Preferred Release Era: ${user.preferences.preferredReleaseEra}
      Preferred Themes: ${user.preferences.preferredThemes.join(', ')}
    `;

        // Generate recommendations using DeepSeek API
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert anime recommender. Based on the user's preferences and watched history, suggest 5 anime titles that would match their taste. For each recommendation, provide a brief explanation of why it matches their preferences."
                    },
                    {
                        role: "user",
                        content: `Here are my preferences and watched history: ${preferences}`
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const recommendations = response.data.choices[0].message.content;

        // Parse the recommendations and search for the anime details
        const recommendedAnime = await Promise.all(
            (recommendations || '').split('\n')
                .filter((line: string) => line.trim())
                .map(async (line: string) => {
                    const title = line.split(':')[0].trim();
                    const reason = line.split(':')[1]?.trim() || '';

                    // Search for the anime to get its ID
                    const searchResults = await searchAnime(title);
                    if (searchResults.length > 0) {
                        const anime = searchResults[0];
                        const matchPercentage = await calculateMatchPercentage(user, anime.mal_id);

                        return {
                            animeId: anime.mal_id,
                            title: anime.title,
                            score: anime.score,
                            matchPercentage,
                            reason
                        };
                    }
                    return null;
                })
        );

        // Sort recommendations by match percentage
        return recommendedAnime
            .filter(Boolean)
            .sort((a, b) => (b?.matchPercentage || 0) - (a?.matchPercentage || 0)) as Array<{
                animeId: number;
                title: string;
                score: number;
                matchPercentage: number;
                reason: string;
            }>;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw error;
    }
}; 