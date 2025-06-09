import { getActivityData, updateActivity } from '../activityService';
import { IUser } from '../../models/User';
import mongoose from 'mongoose';

describe('Activity Service', () => {
    const mockUser: Partial<IUser> = {
        activity: [
            {
                date: new Date('2024-04-25'),
                action: 'watch',
                animeId: 1
            },
            {
                date: new Date('2024-04-25'),
                action: 'rate',
                animeId: 1,
                rating: 9
            },
            {
                date: new Date('2024-04-24'),
                action: 'follow',
                targetUserId: new mongoose.Types.ObjectId()
            }
        ]
    };

    it('should return activity data for the specified range', async () => {
        const activityData = await getActivityData(mockUser as IUser, 'week');

        expect(activityData).toHaveLength(2); // Two different dates
        expect(activityData[0].date).toBe('2024-04-24');
        expect(activityData[0].followCount).toBe(1);
        expect(activityData[1].date).toBe('2024-04-25');
        expect(activityData[1].watchCount).toBe(1);
        expect(activityData[1].ratingCount).toBe(1);
    });

    it('should update user activity', async () => {
        const user = {
            ...mockUser,
            save: jest.fn()
        } as unknown as IUser;

        await updateActivity(user, 'watch', 2);

        expect(user.activity).toHaveLength(4);
        expect(user.activity[3].action).toBe('watch');
        expect(user.activity[3].animeId).toBe(2);
        expect(user.save).toHaveBeenCalled();
    });
}); 