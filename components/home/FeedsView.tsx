import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const COMMUNITIES = [
    { id: '1', name: 'NBA Threads', members: '110K', recent: '385', avatars: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80'], status: 'online' },
    { id: '2', name: 'WNBA Threads', members: '15.3K', recent: '59', avatars: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80'], status: 'online' },
    { id: '3', name: 'F1 Threads', members: '169K', recent: '294', avatars: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80'], status: 'away' },
    { id: '4', name: 'Tennis Threads', members: '17.7K', recent: '127', avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', 'https://images.unsplash.com/photo-1517841905240-472988bad1fa?w=100&q=80'], status: 'online' },
    { id: '5', name: 'NFL Threads', members: '71K', recent: '141', avatars: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80'], status: 'online' },
];

interface FeedsViewProps {
    isDarkMode: boolean;
    onHide: () => void;
}

export default function FeedsView({ isDarkMode, onHide }: FeedsViewProps) {
    const insets = useSafeAreaInsets();
    const textPrimary = isDarkMode ? '#f3f4f6' : '#111827';
    const textSecondary = isDarkMode ? '#9ca3af' : '#6b7280';
    const iconColor = isDarkMode ? '#fff' : '#1f2937';

    const toggleBg = isDarkMode ? '#1f2937' : '#fff';
    const toggleBorder = isDarkMode ? '#374151' : '#f3f4f6';
    const iconColorDynamic = isDarkMode ? '#fff' : '#000';
    const separatorColor = isDarkMode ? '#374151' : '#f9fafb';
    const avatarBorder = isDarkMode ? '#111827' : '#fff';

    return (
        <View className="flex-1" style={{ backgroundColor: isDarkMode ? '#111827' : '#fff' }}>
            <View
                className="flex-row items-center justify-between px-6 pb-2 md:px-12 lg:px-24 self-center w-full max-w-[800px]"
                style={{ paddingTop: Platform.OS === 'android' ? (insets.top + 15) : (insets.top + 8) }}
            >
                <Text className="text-2xl font-bold" style={{ color: textPrimary }}>Feeds</Text>
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity>
                        <Ionicons name="add-circle-outline" size={26} color={iconColor} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="create-outline" size={24} color={iconColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Top Action Buttons */}
                <View className="flex-row gap-4 px-4 mb-5 mt-4 self-center w-full max-w-[800px] md:px-8">
                    <TouchableOpacity
                        className="flex-1 h-14 rounded-2xl items-center justify-center shadow-sm border"
                        style={{ backgroundColor: toggleBg, borderColor: toggleBorder }}
                    >
                        <Ionicons name="heart-outline" size={24} color={iconColorDynamic} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 h-14 rounded-2xl items-center justify-center shadow-sm border"
                        style={{ backgroundColor: toggleBg, borderColor: toggleBorder }}
                    >
                        <Ionicons name="bookmark-outline" size={22} color={iconColorDynamic} />
                    </TouchableOpacity>
                </View>

                {/* Categories Card */}
                <View
                    className="mx-4 rounded-2xl overflow-hidden shadow-sm mb-8 self-center w-full max-w-[800px] md:mx-8 border"
                    style={{ backgroundColor: toggleBg, borderColor: toggleBorder }}
                >
                    {[
                        { label: 'For you', icon: null },
                        { label: 'Following', icon: null },
                        { label: 'Ghost posts', icon: 'happy-outline' }
                    ].map((item, index, arr) => (
                        <View key={index}>
                            <TouchableOpacity className="flex-row items-center justify-between px-5 py-4" activeOpacity={0.7}>
                                <Text className="text-base font-semibold" style={{ color: textPrimary }}>{item.label}</Text>
                                {item.icon && (
                                    <View className="w-8 h-8 items-center justify-center">
                                        <Ionicons name={item.icon as any} size={20} color={iconColorDynamic} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            {index !== arr.length - 1 && <View style={{ height: 0.5, backgroundColor: separatorColor, marginHorizontal: 20 }} />}
                        </View>
                    ))}
                </View>

                {/* Popular Communities Section */}
                <View className="px-4 self-center w-full max-w-[800px] md:px-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-semibold" style={{ color: textSecondary }}>Popular communities</Text>
                        <TouchableOpacity>
                            <Text className="text-sm font-medium" style={{ color: textSecondary }}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Communities List */}
                    <View
                        className="rounded-2xl overflow-hidden shadow-sm border"
                        style={{ backgroundColor: toggleBg, borderColor: toggleBorder }}
                    >
                        {COMMUNITIES.map((community, index, arr) => (
                            <View key={community.id}>
                                <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                                    <View className="flex-1">
                                        <Text className="text-[15px] font-bold mb-0.5" style={{ color: textPrimary }}>{community.name}</Text>
                                        <Text className="text-[12px]" style={{ color: textSecondary }}>
                                            {community.members} members • {community.recent} recent po...
                                        </Text>
                                    </View>

                                    {/* Avatar Stack with Status Dots */}
                                    <View className="flex-row items-center">
                                        <View className="flex-row-reverse">
                                            {community.avatars.map((avatar, i) => (
                                                <View
                                                    key={i}
                                                    className={`w-8 h-8 rounded-full border-2 -mr-3 z-[${i}] overflow-hidden relative`}
                                                    style={{ borderColor: avatarBorder, backgroundColor: separatorColor }}
                                                >
                                                    <Image source={{ uri: avatar }} style={{ width: '100%', height: '100%' }} />
                                                    {i === 0 && (
                                                        <View
                                                            className={`absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${community.status === 'online' ? 'bg-green-500' : 'bg-orange-400'}`}
                                                            style={{ borderColor: avatarBorder }}
                                                        />
                                                    )}
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {index !== arr.length - 1 && <View style={{ height: 0.5, backgroundColor: separatorColor, marginHorizontal: 20 }} />}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
