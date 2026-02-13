import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ProfileViewProps {
    isDarkMode: boolean;
    onEditProfile: () => void;
    onShareProfile: () => void;
    onSettings: () => void;
}

export default function ProfileView({ isDarkMode, onEditProfile, onShareProfile, onSettings }: ProfileViewProps) {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('Threads');
    const tabs = ['Threads', 'Replies', 'Media', 'Reposts'];

    const bg = isDarkMode ? '#000000' : '#fff';
    const textPrimary = isDarkMode ? '#f3f4f6' : '#000';
    const textSecondary = isDarkMode ? '#9ca3af' : '#999';
    const cardBg = isDarkMode ? '#1f2937' : '#f9fafb'; // bg-gray-50/50 equivalent or dark
    const cardBorder = isDarkMode ? '#374151' : '#f3f4f6';
    const buttonBg = isDarkMode ? '#1f2937' : '#fff';

    return (
        <View className="flex-1" style={{ backgroundColor: bg }}>
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-5 pb-2 self-center w-full max-w-[800px] md:px-10"
                style={{ paddingTop: Platform.OS === 'android' ? (insets.top + 10) : (insets.top + 5) }}
            >
                <TouchableOpacity>
                    <Ionicons name="bar-chart-outline" size={24} color={textPrimary} />
                </TouchableOpacity>
                <View className="flex-row items-center gap-5">
                    <TouchableOpacity>
                        <Ionicons name="search-outline" size={24} color={textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSettings}>
                        <View className="items-end">
                            <View className={`w-7 h-[2px] mb-1.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
                            <View className={`w-4 h-[2px] rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Profile Info */}
                <View className="px-5 pt-4 flex-row justify-between items-start self-center w-full max-w-[800px] md:px-10">
                    <View className="flex-1 mr-4">
                        <Text className="text-[28px] font-bold tracking-tight leading-tight" style={{ color: textPrimary }}>
                            Varahanarasimha{"\n"}Logisa
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-[15px]" style={{ color: textPrimary }}>varahanarasimha_logisa</Text>
                        </View>

                        <TouchableOpacity
                            className="mt-2 bg-transparent border self-start px-4 py-1.5 rounded-full"
                            style={{ borderColor: isDarkMode ? '#374151' : '#f3f4f6' }}
                        >
                            <Text className="text-[13px] font-medium" style={{ color: textSecondary }}>+ Add interests</Text>
                        </TouchableOpacity>

                        <View className="flex-row items-center mt-5">
                            <View className="flex-row items-center">
                                <View className="flex-row">
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }}
                                        style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#fff' }}
                                    />
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' }}
                                        style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#fff', marginLeft: -8 }}
                                    />
                                </View>
                                <Text className="text-[14px] ml-2 text-gray-400">41 followers</Text>
                            </View>
                        </View>
                    </View>

                    <View className="relative">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' }}
                            style={{ width: 84, height: 84, borderRadius: 42, borderWidth: 4, borderColor: bg }}
                        />
                        <TouchableOpacity
                            className="absolute bottom-0 left-0 bg-white rounded-full p-0.5"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add-circle" size={26} color="#0095f6" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-2 px-5 mt-6 self-center w-full max-w-[800px] md:px-10">
                    <TouchableOpacity
                        onPress={onEditProfile}
                        className="flex-1 h-10 border rounded-xl items-center justify-center"
                        style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                    >
                        <Text className="font-bold text-[15px]" style={{ color: textPrimary }}>Edit profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onShareProfile}
                        className="flex-1 h-10 border rounded-xl items-center justify-center"
                        style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                    >
                        <Text className="font-bold text-[15px]" style={{ color: textPrimary }}>Share profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className="mt-8 self-center w-full max-w-[800px]">
                    <View className="flex-row px-5 border-b border-gray-100 md:px-10">
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className="flex-1 items-center pb-3 relative"
                            >
                                <Text
                                    className="text-[15px] font-bold"
                                    style={{ color: activeTab === tab ? textPrimary : textSecondary }}
                                >
                                    {tab}
                                </Text>
                                {activeTab === tab && (
                                    <View className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: textPrimary }} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Profile Content Section */}
                <View className="px-5 mt-6 self-center w-full max-w-[800px] md:px-10">
                    {activeTab === 'Threads' ? (
                        <>
                            <View className="flex-row items-center justify-between mb-4 px-1">
                                <Text className="font-bold text-[13px]" style={{ color: textSecondary }}>Finish your profile</Text>
                                <Text className="font-bold text-[13px]" style={{ color: textSecondary }}>2 left</Text>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                                {/* Create Thread Card */}
                                <View
                                    className="w-[180px] h-[190px] border rounded-[24px] p-5 items-center mr-3 justify-between"
                                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                                >
                                    <View className="items-center">
                                        <View
                                            className="w-11 h-11 rounded-full items-center justify-center border mb-3 shadow-sm"
                                            style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                                        >
                                            <Ionicons name="create-outline" size={20} color={textPrimary} />
                                        </View>
                                        <Text className="font-bold text-[15px] mb-1" style={{ color: textPrimary }}>Create thread</Text>
                                        <Text className="text-center text-[11px] leading-tight px-1" style={{ color: textSecondary }}>
                                            Say what's on your mind or share a recent highlight.
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        className="border w-full py-1.5 rounded-xl items-center shadow-sm mt-2"
                                        style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                                    >
                                        <Text className="font-bold text-[13px]" style={{ color: textPrimary }}>Create</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Add Info Card */}
                                <View
                                    className="w-[180px] h-[190px] border rounded-[24px] p-5 items-center mr-3 justify-between"
                                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                                >
                                    <View className="items-center">
                                        <View
                                            className="w-11 h-11 rounded-full items-center justify-center border mb-3 shadow-sm"
                                            style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                                        >
                                            <Ionicons name="information-circle-outline" size={20} color={textPrimary} />
                                        </View>
                                        <Text className="font-bold text-[15px] mb-1" style={{ color: textPrimary }}>Add info</Text>
                                        <Text className="text-center text-[11px] leading-tight px-1" style={{ color: textSecondary }}>
                                            Share more about yourself to help people get to know you.
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        className="border w-full py-1.5 rounded-xl items-center shadow-sm mt-2"
                                        style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                                    >
                                        <Text className="font-bold text-[13px]" style={{ color: textPrimary }}>Add</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Follow 10 profiles Card */}
                                <View
                                    className="w-[180px] h-[190px] border rounded-[24px] p-5 items-center mr-3 justify-between"
                                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                                >
                                    <View className="items-center">
                                        <View
                                            className="w-11 h-11 rounded-full items-center justify-center border mb-3 shadow-sm"
                                            style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                                        >
                                            <Ionicons name="people-outline" size={20} color={textPrimary} />
                                        </View>
                                        <Text className="font-bold text-[15px] mb-1 text-center" style={{ color: textPrimary }}>Follow 10 profiles</Text>
                                        <Text className="text-center text-[11px] leading-tight px-1" style={{ color: textSecondary }}>
                                            See more of what you're interested in your feed.
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        className="border w-full py-1.5 rounded-xl items-center shadow-sm mt-2"
                                        style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                                    >
                                        <Text className="font-bold text-[13px]" style={{ color: textPrimary }}>Follow</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Add profile photo Card */}
                                <View
                                    className="w-[180px] h-[190px] border rounded-[24px] p-5 items-center justify-between"
                                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                                >
                                    <View className="items-center">
                                        <View
                                            className="w-11 h-11 rounded-full items-center justify-center border mb-3 shadow-sm"
                                            style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                                        >
                                            <Ionicons name="camera-outline" size={20} color={textPrimary} />
                                        </View>
                                        <Text className="font-bold text-[15px] mb-1 text-center" style={{ color: textPrimary }}>Add profile photo</Text>
                                        <Text className="text-center text-[11px] leading-tight px-1" style={{ color: textSecondary }}>
                                            Let people see who you are with a profile photo.
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        className="border w-full py-1.5 rounded-xl items-center shadow-sm mt-2"
                                        style={{ backgroundColor: buttonBg, borderColor: cardBorder }}
                                    >
                                        <Text className="font-bold text-[13px]" style={{ color: textPrimary }}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </>
                    ) : (
                        <View className="items-center justify-center mt-10">
                            <Text className="text-gray-400 text-[15px]">You haven't posted any {activeTab.toLowerCase()} yet</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
