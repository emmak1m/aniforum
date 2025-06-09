import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, ListItem, Icon, Switch } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen = () => {
    const navigation = useNavigation<SettingsNavigationProp>();
    const { colors } = useTheme();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView>
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ListItem
                        onPress={() => navigation.navigate('ThemeSettings')}
                        containerStyle={{ backgroundColor: colors.card }}
                    >
                        <Icon name="palette" type="font-awesome" color={colors.text} />
                        <ListItem.Content>
                            <ListItem.Title style={{ color: colors.text }}>Theme Settings</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron color={colors.text} />
                    </ListItem>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ListItem
                        containerStyle={{ backgroundColor: colors.card }}
                    >
                        <Icon name="bell" type="font-awesome" color={colors.text} />
                        <ListItem.Content>
                            <ListItem.Title style={{ color: colors.text }}>Notifications</ListItem.Title>
                        </ListItem.Content>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            color={colors.primary}
                        />
                    </ListItem>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ListItem
                        containerStyle={{ backgroundColor: colors.card }}
                    >
                        <Icon name="language" type="font-awesome" color={colors.text} />
                        <ListItem.Content>
                            <ListItem.Title style={{ color: colors.text }}>Language</ListItem.Title>
                        </ListItem.Content>
                        <Text style={{ color: colors.textSecondary }}>English</Text>
                    </ListItem>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <ListItem
                        containerStyle={{ backgroundColor: colors.card }}
                    >
                        <Icon name="info-circle" type="font-awesome" color={colors.text} />
                        <ListItem.Content>
                            <ListItem.Title style={{ color: colors.text }}>About</ListItem.Title>
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
    section: {
        marginBottom: 10,
    },
}); 