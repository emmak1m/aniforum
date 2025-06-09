import { generateRecommendations } from '../recommendationService';
import { searchAnime } from '../jikanService';
import { calculateMatchPercentage } from '../matchService';
import { IUser } from '../../models/User';
import axios from 'axios';

// Mock the dependencies
jest.mock('../jikanService');
jest.mock('../matchService');
jest.mock('axios');

describe('Recommendation Service', () => {
    const mockUser: Partial<IUser> = {
        preferences: {
            favoriteGenres: ['Action', 'Adventure'],
            favoriteAnime: [{ animeId: 1, title: 'Naruto', rating: 9 }],
            favoriteManga: [],
            preferredAnimationStyle: ['Traditional'],
            preferredStoryLength: 'Long',
            preferredReleaseEra: '2000s',
            preferredThemes: ['Friendship']
        },
        animeHistory: {
            totalWatched: 1,
            watchlist: [],
            watchedAnime: [{
                animeId: 1,
                title: 'Naruto',
                rating: 9,
                status: 'completed',
                genres: ['Action', 'Adventure']
            }]
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate recommendations based on user preferences', async () => {
        // Mock DeepSeek API response
        (axios.post as jest.Mock).mockResolvedValue({
            data: {
                choices: [{
                    message: {
                        content: 'One Piece: Great adventure anime\nAttack on Titan: Action-packed series'
                    }
                }]
            }
        });

        // Mock searchAnime responses
        (searchAnime as jest.Mock).mockImplementation((title: string) => {
            if (title === 'One Piece') {
                return Promise.resolve([{ mal_id: 2, title: 'One Piece', score: 8.5 }]);
            }
            if (title === 'Attack on Titan') {
                return Promise.resolve([{ mal_id: 3, title: 'Attack on Titan', score: 9.0 }]);
            }
            return Promise.resolve([]);
        });

        // Mock match percentage calculation
        (calculateMatchPercentage as jest.Mock).mockResolvedValue(85);

        const recommendations = await generateRecommendations(mockUser as IUser);

        expect(recommendations).toHaveLength(2);
        expect(recommendations[0].title).toBe('One Piece');
        expect(recommendations[1].title).toBe('Attack on Titan');
        expect(recommendations[0].matchPercentage).toBe(85);
    });

    it('should handle empty recommendations gracefully', async () => {
        // Mock DeepSeek API response with empty content
        (axios.post as jest.Mock).mockResolvedValue({
            data: {
                choices: [{
                    message: {
                        content: ''
                    }
                }]
            }
        });

        const recommendations = await generateRecommendations(mockUser as IUser);

        expect(recommendations).toHaveLength(0);
    });
}); 