import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    AnimeDetails: { animeId: number };
    Profile: undefined;
    Search: undefined;
    Explore: undefined;
    Settings: undefined;
    ThemeSettings: undefined;
    Notifications: undefined;
    Watchlist: undefined;
    Favorites: undefined;
    Genre: { genreName: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type BottomTabParamList = {
    HomeTab: undefined;
    SearchTab: undefined;
    NotificationsTab: undefined;
    ProfileTab: undefined;
}; 