import { UserRating } from '../services/ratingService';

export const mockRatings: UserRating[] = [
    {
        animeId: 1,
        timestamp: '2024-03-15T10:30:00Z',
        ratings: [
            { name: 'Story', value: 4.5 },
            { name: 'Animation', value: 5.0 },
            { name: 'Sound', value: 4.0 },
            { name: 'Characters', value: 4.5 },
            { name: 'Enjoyment', value: 5.0 }
        ],
        review: 'An amazing anime with beautiful animation and compelling story!'
    },
    {
        animeId: 2,
        timestamp: '2024-03-10T15:45:00Z',
        ratings: [
            { name: 'Story', value: 3.5 },
            { name: 'Animation', value: 4.0 },
            { name: 'Sound', value: 3.5 },
            { name: 'Characters', value: 4.0 },
            { name: 'Enjoyment', value: 3.5 }
        ],
        review: 'Good anime but could have been better with more character development.'
    },
    {
        animeId: 3,
        timestamp: '2024-03-05T20:15:00Z',
        ratings: [
            { name: 'Story', value: 5.0 },
            { name: 'Animation', value: 4.5 },
            { name: 'Sound', value: 5.0 },
            { name: 'Characters', value: 5.0 },
            { name: 'Enjoyment', value: 5.0 }
        ],
        review: 'Masterpiece! One of the best anime I\'ve ever watched.'
    }
]; 