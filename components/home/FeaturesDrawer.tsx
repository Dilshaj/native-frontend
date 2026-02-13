import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeaturesDrawerProps {
    isDarkMode: boolean;
    onHide: () => void;
    menuItems: any[];
}

export default function FeaturesDrawer({ isDarkMode, onHide, menuItems }: FeaturesDrawerProps) {
    const textPrimary = isDarkMode ? '#f3f4f6' : '#111827';
    const textSecondary = isDarkMode ? '#9ca3af' : '#6b7280';
    const cardBorder = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6';
    const headerBg = isDarkMode ? 'transparent' : '#fff';
    const iconColor = isDarkMode ? '#fff' : '#1f2937';

    return (
        <View className="flex-1">
            {/* Modern Header with proper top spacing */}
            <View
                className={`flex-row items-center px-4 pb-4 border-b ${Platform.OS === 'android' ? 'pt-12' : 'pt-2'}`}
                style={{ backgroundColor: headerBg, borderBottomColor: cardBorder }}
            >
                <TouchableOpacity
                    onPress={onHide}
                    className={`w-10 h-10 items-center justify-center rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-50'} mr-4`}
                >
                    <Ionicons name="chevron-back" size={20} color={iconColor} />
                </TouchableOpacity>
                <Text className="text-xl font-bold tracking-tight" style={{ color: textPrimary }}>App Features</Text>
            </View>

            <ScrollView
                className="flex-1"
                style={{ backgroundColor: isDarkMode ? 'transparent' : '#f8f9fa' }}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Quick Stats / Info */}
                <View className="px-6 py-6 mb-2">
                    <Text className="text-2xl font-bold mb-1" style={{ color: textPrimary }}>Explore</Text>
                    <Text className="text-[13px]" style={{ color: textSecondary }}>Discover what you can do</Text>
                </View>

                {/* Feature Grid */}
                <View className="flex-row flex-wrap px-4 justify-between">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`w-[48%] mb-4 p-4 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}
                            style={{ borderColor: cardBorder }}
                        >
                            <View
                                className="w-10 h-10 rounded-full items-center justify-center mb-3"
                                style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : item.color + '15' }}
                            >
                                <Ionicons name={item.icon} size={20} color={item.color} />
                            </View>
                            <Text className="font-bold text-[15px] mb-1" style={{ color: textPrimary }}>{item.title}</Text>
                            <Text className="text-[11px] leading-4" style={{ color: textSecondary }}>
                                {item.title === 'Learning' ? 'Track your progress' :
                                    item.title === 'Analytics' ? 'View insights' :
                                        item.title === 'Calendar' ? 'Schedule events' : 'Manage everything'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
