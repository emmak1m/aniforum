import { IUser } from '../models/User';
import mongoose from 'mongoose';
import { updateActivity } from './activityService';

export const updateProfilePicture = async (
    user: IUser,
    imageUrl: string
): Promise<void> => {
    user.profilePicture = imageUrl;
    await user.save();
};

export const updateBio = async (
    user: IUser,
    bio: string
): Promise<void> => {
    user.bio = bio;
    await user.save();
};

export const updateThemeSettings = async (
    user: IUser,
    theme: 'light' | 'dark' | 'system',
    lightTime?: string,
    darkTime?: string
): Promise<void> => {
    user.settings.theme = theme;
    if (lightTime) user.settings.themeSwitchTime.light = lightTime;
    if (darkTime) user.settings.themeSwitchTime.dark = darkTime;
    await user.save();
};

export const updateActivityGraphRange = async (
    user: IUser,
    range: 'day' | 'week' | 'month' | 'year'
): Promise<void> => {
    user.settings.activityGraphRange = range;
    await user.save();
};

export const followUser = async (
    currentUser: IUser,
    targetUserId: string
): Promise<void> => {
    const targetUser = await mongoose.model('User').findById(targetUserId);
    if (!targetUser) throw new Error('User not found');

    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    if (!currentUser.social.following.includes(targetObjectId)) {
        currentUser.social.following.push(targetObjectId);
        targetUser.social.followers.push(currentUser._id);

        await currentUser.save();
        await targetUser.save();

        await updateActivity(currentUser, 'follow', undefined, undefined, targetUserId);
    }
};

export const unfollowUser = async (
    currentUser: IUser,
    targetUserId: string
): Promise<void> => {
    const targetUser = await mongoose.model('User').findById(targetUserId);
    if (!targetUser) throw new Error('User not found');

    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    currentUser.social.following = currentUser.social.following.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(targetObjectId)
    );
    targetUser.social.followers = targetUser.social.followers.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(currentUser._id as mongoose.Types.ObjectId)
    );

    await currentUser.save();
    await targetUser.save();

    await updateActivity(currentUser, 'unfollow', undefined, undefined, targetUserId);
}; 