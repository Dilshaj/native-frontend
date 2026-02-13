import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

interface SettingsViewProps {
    isDarkMode: boolean;
    onBack: () => void;
}

interface SettingItemProps {
    icon: any;
    iconType: 'Ionicons' | 'MaterialCommunityIcons';
    label: string;
    isDarkMode: boolean;
}

const SettingItem = ({ icon, iconType, label, isDarkMode }: SettingItemProps) => {
    const textColor = isDarkMode ? '#f3f4f6' : '#000000';
    const iconColor = isDarkMode ? '#f3f4f6' : '#000000';

    return (
        <TouchableOpacity className="flex-row items-center px-6 py-3.5">
            <View className="w-8 items-start">
                {iconType === 'Ionicons' ? (
                    <Ionicons name={icon} size={22} color={iconColor} />
                ) : (
                    <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
                )}
            </View>
            <Text className="text-[17px] font-medium ml-3 flex-1" style={{ color: textColor }}>{label}</Text>
        </TouchableOpacity>
    );
};

export default function SettingsView({ isDarkMode, onBack }: SettingsViewProps) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const bg = isDarkMode ? '#000000' : '#ffffff';
    const textPrimary = isDarkMode ? '#f3f4f6' : '#000000';
    const border = isDarkMode ? '#374151' : '#f3f4f6';
    const headerBg = isDarkMode ? '#000000' : '#ffffff';

    const settings = [
        { icon: 'person-add-outline', iconType: 'Ionicons', label: 'Follow and invite friends' },
        { icon: 'notifications-outline', iconType: 'Ionicons', label: 'Notifications' },
        { icon: 'bookmark-outline', iconType: 'Ionicons', label: 'Saved' },
        { icon: 'heart-outline', iconType: 'Ionicons', label: 'Liked' },
        { icon: 'timer-outline', iconType: 'Ionicons', label: 'Archive' },
        { icon: 'lock-closed-outline', iconType: 'Ionicons', label: 'Privacy' },
        { icon: 'tune-vertical', iconType: 'MaterialCommunityIcons', label: 'Content preferences' },
        { icon: 'accessibility-outline', iconType: 'Ionicons', label: 'Accessibility' },
        { icon: 'person-outline', iconType: 'Ionicons', label: 'Account status' },
        { icon: 'person-circle-outline', iconType: 'Ionicons', label: 'Account' },
        { icon: 'language-outline', iconType: 'Ionicons', label: 'Language' },
        { icon: 'help-circle-outline', iconType: 'Ionicons', label: 'Help' },
        { icon: 'information-circle-outline', iconType: 'Ionicons', label: 'About' },
    ];

    return (
        <Animated.View
            entering={SlideInRight.duration(400)}
            exiting={SlideOutRight.duration(300)}
            className="flex-1"
            style={{ backgroundColor: bg }}
        >
            {/* Header */}
            <View
                className="flex-row items-center px-4 pb-4 border-b self-center w-full max-w-[800px] md:px-10"
                style={{
                    backgroundColor: headerBg,
                    borderColor: border,
                    paddingTop: Platform.OS === 'android' ? (insets.top + 10) : (insets.top + 5)
                }}
            >
                <TouchableOpacity onPress={onBack} className="p-2">
                    <Ionicons name="arrow-back" size={26} color={textPrimary} />
                </TouchableOpacity>
                <Text className="text-[20px] font-bold ml-4" style={{ color: textPrimary }}>Settings</Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 120, alignSelf: 'center', width: '100%', maxWidth: 800 }}
                overScrollMode="never"
            >
                <View className="py-2">
                    {settings.map((item, index) => (
                        <SettingItem
                            key={index}
                            icon={item.icon}
                            iconType={item.iconType as any}
                            label={item.label}
                            isDarkMode={isDarkMode}
                        />
                    ))}
                </View>

                {/* Footer Actions */}
                <View className="mt-4 border-t pt-2" style={{ borderColor: border }}>
                    <TouchableOpacity className="px-6 py-4">
                        <Text className="text-[17px] font-medium text-[#0095f6]">Switch accounts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-6 py-4" onPress={() => router.replace('/login')}>
                        <Text className="text-[17px] font-medium text-[#ed4956]">Log out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Animated.View>
    );
}
