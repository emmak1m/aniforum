import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { useTheme } from '../context/ThemeContext';

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow';
    message: string;
    timestamp: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'like',
        message: 'User123 liked your review on Attack on Titan',
        timestamp: '2 hours ago',
        read: false,
    },
    {
        id: '2',
        type: 'comment',
        message: 'User456 commented on your review: "Great analysis!"',
        timestamp: '5 hours ago',
        read: true,
    },
    {
        id: '3',
        type: 'follow',
        message: 'User789 started following you',
        timestamp: '1 day ago',
        read: true,
    },
];

export const NotificationsScreen = () => {
    const { colors } = useTheme();

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'like':
                return 'favorite';
            case 'comment':
                return 'comment';
            case 'follow':
                return 'person-add';
            default:
                return 'notifications';
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <View
            style={[
                styles.notificationItem,
                { backgroundColor: colors.card },
                !item.read && styles.unreadNotification,
            ]}
        >
            <Icon
                name={getNotificationIcon(item.type)}
                type="material"
                color={colors.primary}
                size={24}
                containerStyle={styles.iconContainer}
            />
            <View style={styles.notificationContent}>
                <Text style={[styles.message, { color: colors.text }]}>
                    {item.message}
                </Text>
                <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                    {item.timestamp}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={mockNotifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 10,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    unreadNotification: {
        borderLeftWidth: 4,
        borderLeftColor: '#FF4081',
    },
    iconContainer: {
        marginRight: 15,
    },
    notificationContent: {
        flex: 1,
    },
    message: {
        fontSize: 16,
        marginBottom: 5,
    },
    timestamp: {
        fontSize: 12,
    },
}); 