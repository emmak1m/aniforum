import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, ListItem, Button, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { UserRatingsList } from '../components/UserRatingsList';
import { mockRatings } from '../data/mockRatings';
import { mockAnimeDetails } from '../data/mockAnimeDetails';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
    const navigation = useNavigation<ProfileNavigationProp>();
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState<'ratings' | 'watchlist'>('ratings');

    const user = {
        name: 'Anime Fan',
        username: '@animefan123',
        avatar: 'https://i.pravatar.cc/300',
        stats: {
            ratings: 42,
            watchlist: 15,
            favorites: 8
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView>
                <View style={[styles.header, { backgroundColor: colors.card }]}>
                    <Avatar
                        size={100}
                        rounded
                        source={{ uri: user.avatar }}
                        containerStyle={styles.avatar}
                    />
                    <Text h4 style={[styles.name, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.username, { color: colors.textSecondary }]}>{user.username}</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{user.stats.ratings}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ratings</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{user.stats.watchlist}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Watchlist</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.text }]}>{user.stats.favorites}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorites</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.tabs, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'ratings' && { borderBottomColor: colors.primary }
                        ]}
                        onPress={() => setActiveTab('ratings')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'ratings' ? colors.primary : colors.textSecondary }
                        ]}>
                            My Ratings
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'watchlist' && { borderBottomColor: colors.primary }
                        ]}
                        onPress={() => setActiveTab('watchlist')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'watchlist' ? colors.primary : colors.textSecondary }
                        ]}>
                            Watchlist
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'ratings' ? (
                    <UserRatingsList
                        ratings={mockRatings}
                        animeDetails={mockAnimeDetails}
                    />
                ) : (
                    <View style={styles.watchlistContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Your watchlist is empty
                        </Text>
                        <Button
                            title="Browse Anime"
                            onPress={() => navigation.navigate('Home')}
                            buttonStyle={styles.browseButton}
                        />
                    </View>
                )}

                <View style={[styles.settings, { backgroundColor: colors.card }]}>
                    <ListItem
                        onPress={() => navigation.navigate('Settings')}
                        containerStyle={{ backgroundColor: colors.card }}
                    >
                        <Icon name="cog" type="font-awesome" color={colors.text} />
                        <ListItem.Content>
                            <ListItem.Title style={{ color: colors.text }}>Settings</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron color={colors.text} />
                    </ListItem>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        marginBottom: 10,
    },
    name: {
        marginBottom: 5,
    },
    username: {
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
    },
    watchlistContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        marginBottom: 20,
        fontSize: 16,
    },
    browseButton: {
        borderRadius: 8,
        paddingHorizontal: 20,
    },
    settings: {
        marginTop: 10,
        marginBottom: 20,
    },
}); 