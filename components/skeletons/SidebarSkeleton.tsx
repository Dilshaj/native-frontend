import React from 'react';
import { View } from 'react-native';
import Skeleton from '../ui/Skeleton';

interface SidebarSkeletonProps {
    isDarkMode: boolean;
}

export default function SidebarSkeleton({ isDarkMode }: SidebarSkeletonProps) {
    const bgColor = isDarkMode ? '#1f2937' : '#fff';
    const borderColor = isDarkMode ? '#374151' : '#f3f4f6';

    return (
        <View className="flex-1">
            {/* Header Title */}
            <View className="px-6 mb-6 mt-4">
                <Skeleton width={100} height={32} isDarkMode={isDarkMode} />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-4 px-4 mb-8">
                <Skeleton width="48%" height={56} borderRadius={16} isDarkMode={isDarkMode} />
                <Skeleton width="48%" height={56} borderRadius={16} isDarkMode={isDarkMode} />
            </View>

            {/* Categories */}
            <View
                className="mx-4 mb-8 rounded-2xl overflow-hidden border p-4 space-y-6"
                style={{ backgroundColor: bgColor, borderColor: borderColor }}
            >
                <Skeleton width="60%" height={20} isDarkMode={isDarkMode} />
                <Skeleton width="50%" height={20} isDarkMode={isDarkMode} />
                <Skeleton width="70%" height={20} isDarkMode={isDarkMode} />
            </View>

            {/* Popular Communities */}
            <View className="px-4">
                <View className="flex-row justify-between mb-4">
                    <Skeleton width={150} height={20} isDarkMode={isDarkMode} />
                    <Skeleton width={50} height={16} isDarkMode={isDarkMode} />
                </View>

                <View
                    className="rounded-2xl overflow-hidden border p-4 space-y-6"
                    style={{ backgroundColor: bgColor, borderColor: borderColor }}
                >
                    {[1, 2, 3].map((i) => (
                        <View key={i} className="flex-row items-center justify-between">
                            <View>
                                <Skeleton width={120} height={18} isDarkMode={isDarkMode} style={{ marginBottom: 6 }} />
                                <Skeleton width={180} height={14} isDarkMode={isDarkMode} />
                            </View>
                            <Skeleton width={60} height={32} borderRadius={16} isDarkMode={isDarkMode} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
