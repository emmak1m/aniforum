import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    social: {
        followers: mongoose.Types.ObjectId[];
        following: mongoose.Types.ObjectId[];
    };
    activity: Array<{
        date: Date;
        action: 'watch' | 'rate' | 'review' | 'follow' | 'unfollow';
        animeId?: number;
        rating?: number;
        targetUserId?: mongoose.Types.ObjectId;
    }>;
    settings: {
        theme: 'light' | 'dark' | 'system';
        themeSwitchTime: {
            light: string;
            dark: string;
        };
        activityGraphRange: 'day' | 'week' | 'month' | 'year';
    };
    onboardingCompleted: boolean;
    animeHistory: {
        totalWatched: number;
        watchlist: Array<{
            animeId: number;
            title: string;
            addedDate: Date;
        }>;
        watchedAnime: Array<{
            animeId: number;
            title: string;
            rating: number;
            status: 'completed' | 'watching' | 'dropped' | 'plan_to_watch';
            genres: string[];
            matchScore?: number;
            completedDate?: Date;
        }>;
    };
    preferences: {
        favoriteGenres: string[];
        favoriteAnime: Array<{
            animeId: number;
            title: string;
            rating: number;
        }>;
        favoriteManga: Array<{
            mangaId: number;
            title: string;
            rating: number;
        }>;
        preferredAnimationStyle: string[];
        preferredStoryLength: string;
        preferredReleaseEra: string;
        preferredThemes: string[];
    };
    recommendations: Array<{
        animeId: number;
        title: string;
        score: number;
        matchPercentage: number;
        reason: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '/default-profile.png' },
    bio: { type: String, default: '' },
    social: {
        followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    activity: [{
        date: { type: Date, default: Date.now },
        action: {
            type: String,
            enum: ['watch', 'rate', 'review', 'follow', 'unfollow'],
            required: true
        },
        animeId: { type: Number },
        rating: { type: Number, min: 1, max: 10 },
        targetUserId: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    settings: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        themeSwitchTime: {
            light: { type: String, default: '07:00' },
            dark: { type: String, default: '19:00' }
        },
        activityGraphRange: {
            type: String,
            enum: ['day', 'week', 'month', 'year'],
            default: 'week'
        }
    },
    onboardingCompleted: { type: Boolean, default: false },
    animeHistory: {
        totalWatched: { type: Number, default: 0 },
        watchlist: [{
            animeId: { type: Number },
            title: { type: String },
            addedDate: { type: Date, default: Date.now }
        }],
        watchedAnime: [{
            animeId: { type: Number },
            title: { type: String },
            rating: { type: Number, min: 1, max: 10 },
            status: {
                type: String,
                enum: ['completed', 'watching', 'dropped', 'plan_to_watch'],
                default: 'completed'
            },
            genres: [{ type: String }],
            matchScore: { type: Number, min: 0, max: 100 },
            completedDate: { type: Date }
        }]
    },
    preferences: {
        favoriteGenres: [{ type: String }],
        favoriteAnime: [{
            animeId: { type: Number },
            title: { type: String },
            rating: { type: Number, min: 1, max: 10 }
        }],
        favoriteManga: [{
            mangaId: { type: Number },
            title: { type: String },
            rating: { type: Number, min: 1, max: 10 }
        }],
        preferredAnimationStyle: [{ type: String }],
        preferredStoryLength: { type: String },
        preferredReleaseEra: { type: String },
        preferredThemes: [{ type: String }]
    },
    recommendations: [{
        animeId: { type: Number },
        title: { type: String },
        score: { type: Number },
        matchPercentage: { type: Number, min: 0, max: 100 },
        reason: { type: String }
    }]
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 