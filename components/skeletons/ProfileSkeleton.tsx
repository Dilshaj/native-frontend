import React from 'react';
import { View } from 'react-native';
import Skeleton from '../ui/Skeleton';

interface ProfileSkeletonProps {
    isDarkMode: boolean;
}

export default function ProfileSkeleton({ isDarkMode }: ProfileSkeletonProps) {
    return (
        <View className="items-center px-4 pt-4">
            {/* Profile Image & Basic Info */}
            <Skeleton width={100} height={100} borderRadius={50} isDarkMode={isDarkMode} style={{ marginBottom: 16 }} />
            <Skeleton width={150} height={24} isDarkMode={isDarkMode} style={{ marginBottom: 8 }} />
            <Skeleton width={200} height={16} isDarkMode={isDarkMode} style={{ marginBottom: 24 }} />

            {/* Stats */}
            <View className="flex-row justify-around w-full mb-8 px-8">
                <View className="items-center">
                    <Skeleton width={40} height={20} isDarkMode={isDarkMode} style={{ marginBottom: 4 }} />
                    <Skeleton width={60} height={14} isDarkMode={isDarkMode} />
                </View>
                <View className="items-center">
                    <Skeleton width={40} height={20} isDarkMode={isDarkMode} style={{ marginBottom: 4 }} />
                    <Skeleton width={60} height={14} isDarkMode={isDarkMode} />
                </View>
                <View className="items-center">
                    <Skeleton width={40} height={20} isDarkMode={isDarkMode} style={{ marginBottom: 4 }} />
                    <Skeleton width={60} height={14} isDarkMode={isDarkMode} />
                </View>
            </View>

            {/* Bio / About */}
            <View className="w-full mb-6">
                <Skeleton width="30%" height={18} isDarkMode={isDarkMode} style={{ marginBottom: 12 }} />
                <Skeleton width="100%" height={14} isDarkMode={isDarkMode} style={{ marginBottom: 6 }} />
                <Skeleton width="95%" height={14} isDarkMode={isDarkMode} style={{ marginBottom: 6 }} />
                <Skeleton width="80%" height={14} isDarkMode={isDarkMode} />
            </View>

            {/* Tabs */}
            <View className="flex-row w-full mt-4">
                <Skeleton width="50%" height={40} isDarkMode={isDarkMode} style={{ marginRight: 2 }} />
                <Skeleton width="50%" height={40} isDarkMode={isDarkMode} />
            </View>

            {/* Grid Content */}
            <View className="flex-row flex-wrap w-full mt-1">
                <Skeleton width="33%" height={120} isDarkMode={isDarkMode} style={{ margin: 1 }} />
                <Skeleton width="33%" height={120} isDarkMode={isDarkMode} style={{ margin: 1 }} />
                <Skeleton width="33%" height={120} isDarkMode={isDarkMode} style={{ margin: 1 }} />
            </View>
        </View>
    );
}
