import { IUser } from '../models/User';

export interface ActivityDataPoint {
    date: string;
    watchCount: number;
    ratingCount: number;
    reviewCount: number;
    followCount: number;
}

export const getActivityData = async (
    user: IUser,
    range: 'day' | 'week' | 'month' | 'year'
): Promise<ActivityDataPoint[]> => {
    const now = new Date();
    let startDate: Date;

    switch (range) {
        case 'day':
            startDate = new Date(now.setDate(now.getDate() - 1));
            break;
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        default:
            startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const filteredActivity = user.activity.filter(
        activity => activity.date >= startDate
    );

    // Group activities by date
    const activityByDate = filteredActivity.reduce((acc, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = {
                watchCount: 0,
                ratingCount: 0,
                reviewCount: 0,
                followCount: 0
            };
        }

        switch (activity.action) {
            case 'watch':
                acc[date].watchCount++;
                break;
            case 'rate':
                acc[date].ratingCount++;
                break;
            case 'review':
                acc[date].reviewCount++;
                break;
            case 'follow':
            case 'unfollow':
                acc[date].followCount++;
                break;
        }

        return acc;
    }, {} as Record<string, Omit<ActivityDataPoint, 'date'>>);

    // Convert to array and sort by date
    return Object.entries(activityByDate)
        .map(([date, data]) => ({
            date,
            ...data
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const updateActivity = async (
    user: IUser,
    action: 'watch' | 'rate' | 'review' | 'follow' | 'unfollow',
    animeId?: number,
    rating?: number,
    targetUserId?: string
): Promise<void> => {
    user.activity.push({
        date: new Date(),
        action,
        animeId,
        rating,
        targetUserId: targetUserId ? new mongoose.Types.ObjectId(targetUserId) : undefined
    });

    await user.save();
}; 