import React from 'react';
import { View } from 'react-native';
import Skeleton from '../ui/Skeleton';

interface FeedSkeletonProps {
    isDarkMode: boolean;
}

export default function FeedSkeleton({ isDarkMode }: FeedSkeletonProps) {
    return (
        <View className={`mb-6 p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            {/* Header */}
            <View className="flex-row items-center mb-3">
                <Skeleton width={40} height={40} borderRadius={20} isDarkMode={isDarkMode} />
                <View className="ml-3 flex-1">
                    <Skeleton width={120} height={16} isDarkMode={isDarkMode} style={{ marginBottom: 6 }} />
                    <Skeleton width={80} height={12} isDarkMode={isDarkMode} />
                </View>
            </View>

            {/* Content Text */}
            <View className="mb-3 space-y-2">
                <Skeleton width="100%" height={14} isDarkMode={isDarkMode} style={{ marginBottom: 4 }} />
                <Skeleton width="90%" height={14} isDarkMode={isDarkMode} style={{ marginBottom: 4 }} />
                <Skeleton width="60%" height={14} isDarkMode={isDarkMode} />
            </View>

            {/* Image */}
            <Skeleton width="100%" height={250} borderRadius={12} isDarkMode={isDarkMode} style={{ marginBottom: 12 }} />

            {/* Actions */}
            <View className="flex-row justify-between mt-2">
                <View className="flex-row gap-6">
                    <Skeleton width={24} height={24} borderRadius={4} isDarkMode={isDarkMode} />
                    <Skeleton width={24} height={24} borderRadius={4} isDarkMode={isDarkMode} />
                    <Skeleton width={24} height={24} borderRadius={4} isDarkMode={isDarkMode} />
                </View>
                <Skeleton width={24} height={24} borderRadius={4} isDarkMode={isDarkMode} />
            </View>
        </View>
    );
}
