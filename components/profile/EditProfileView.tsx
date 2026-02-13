import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface EditProfileViewProps {
    isDarkMode: boolean;
    onBack: () => void;
    onOpenEditBio: () => void;
    currentBio: string;
}

export default function EditProfileView({ isDarkMode, onBack, onOpenEditBio, currentBio }: EditProfileViewProps) {
    const insets = useSafeAreaInsets();
    const [showBadge, setShowBadge] = useState(true);
    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80');
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);

    const pickImage = async () => {
        // Since expo-image-picker is not installed, we use a placeholder alert
        alert('Please run "npx expo install expo-image-picker" to enable image selection.');
        /*
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            setShowPhotoOptions(false);
        }
        */
    };

    const bg = isDarkMode ? '#000000' : '#fff';
    const textPrimary = isDarkMode ? '#f3f4f6' : '#000';
    const textSecondary = isDarkMode ? '#9ca3af' : '#999';
    const cardBg = isDarkMode ? '#1f2937' : '#fff';
    const cardBorder = isDarkMode ? '#374151' : '#f3f4f6';
    const separator = isDarkMode ? '#374151' : '#f3f4f6';

    return (
        <View className="flex-1" style={{ backgroundColor: bg }}>
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-5 pb-3 self-center w-full max-w-[800px] md:px-10"
                style={{
                    paddingTop: Platform.OS === 'android' ? (insets.top + 8) : (insets.top + 2),
                    backgroundColor: bg
                }}
            >
                <TouchableOpacity onPress={onBack}>
                    <Ionicons name="close" size={24} color={textPrimary} />
                </TouchableOpacity>
                <Text className="text-[17px] font-bold" style={{ color: textPrimary }}>Edit profile</Text>
                <TouchableOpacity onPress={onBack}>
                    <Text className="text-[17px] font-bold" style={{ color: textPrimary }}>Done</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingTop: 24, alignSelf: 'center', width: '100%', maxWidth: 800 }}
            >
                <View
                    className="mx-4 rounded-[32px] border p-0 overflow-hidden shadow-sm"
                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                >
                    {/* Name Section with Image */}
                    <View
                        className="flex-row justify-between items-start border-b px-5 py-3.5"
                        style={{ borderColor: separator }}
                    >
                        <View className="flex-1 mr-4">
                            <Text className="text-[13px] font-bold mb-1.5" style={{ color: textPrimary }}>Name</Text>
                            <View className="flex-row items-start">
                                <Ionicons name="lock-closed" size={12} color={textPrimary} style={{ marginTop: 3 }} />
                                <View className="ml-2">
                                    <Text className="text-[15px] font-medium leading-tight" style={{ color: textPrimary }}>Varahanarasimha Logisa</Text>
                                    <Text className="text-[14px] font-medium leading-tight" style={{ color: textSecondary }}>varahanarasimha_logisa</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowPhotoOptions(true)}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={{ uri: profileImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' }}
                                style={{ width: 48, height: 48, borderRadius: 24 }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Bio Section */}
                    <TouchableOpacity
                        onPress={onOpenEditBio}
                        activeOpacity={0.7}
                        className="border-b px-5 py-3.5"
                        style={{ borderColor: separator }}
                    >
                        <Text className="text-[13px] font-bold" style={{ color: textPrimary }}>Bio</Text>
                        <Text
                            className="text-[15px] font-medium mt-0.5"
                            style={{ color: currentBio ? textPrimary : textSecondary }}
                            numberOfLines={2}
                        >
                            {currentBio || '+ Write bio'}
                        </Text>
                    </TouchableOpacity>

                    {/* Interests Section */}
                    <View className="border-b px-5 py-3.5" style={{ borderColor: separator }}>
                        <Text className="text-[13px] font-bold" style={{ color: textPrimary }}>Interests</Text>
                        <TouchableOpacity>
                            <Text className="text-[15px] font-medium" style={{ color: textSecondary }}>+ Add interests</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Links Section */}
                    <View className="border-b px-5 py-3.5 flex-row justify-between items-center" style={{ borderColor: separator }}>
                        <Text className="text-[13px] font-bold" style={{ color: textPrimary }}>Links</Text>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className="text-[15px] mr-2 font-medium" style={{ color: textSecondary }}>0</Text>
                            <Ionicons name="chevron-forward" size={18} color={textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Podcast Section */}
                    <View className="border-b px-5 py-3.5" style={{ borderColor: separator }}>
                        <Text className="text-[13px] font-bold" style={{ color: textPrimary }}>Podcast</Text>
                        <TouchableOpacity>
                            <Text className="text-[15px] font-medium" style={{ color: textSecondary }}>+ Link your podcast</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Badge Section */}
                    <View className="px-5 py-3.5 border-b" style={{ borderColor: separator }}>
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1 mr-4">
                                <Text className="text-[13px] font-bold" style={{ color: textPrimary }}>Show Instagram badge</Text>
                                <Text className="text-[12px] mt-1 leading-tight" style={{ color: textSecondary }}>
                                    When turned off, the banner on Instagram will disappear.
                                </Text>
                            </View>
                            <Switch
                                value={showBadge}
                                onValueChange={setShowBadge}
                                trackColor={{ false: '#eee', true: '#000' }}
                                thumbColor="#fff"
                                ios_backgroundColor="#eee"
                                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                            />
                        </View>
                    </View>

                    {/* Privacy Section */}
                    <View className="px-5 py-3.5">
                        <TouchableOpacity className="flex-row justify-between items-center">
                            <Text className="text-[13px] font-bold" style={{ color: textPrimary }}>Profile privacy</Text>
                            <View className="flex-row items-center">
                                <Text className="text-[14px] mr-2 font-medium" style={{ color: textSecondary }}>Public</Text>
                                <Ionicons name="chevron-forward" size={18} color={textSecondary} />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-[12px] leading-tight mt-1" style={{ color: textSecondary }}>
                            Switching to private means only followers see your threads.
                        </Text>
                    </View>
                </View>
            </ScrollView>
            {/* Photo Options Bottom Sheet */}
            {showPhotoOptions && (
                <View className="absolute inset-0 z-[3000]">
                    <TouchableOpacity
                        activeOpacity={1}
                        className="absolute inset-0 bg-black/40"
                        onPress={() => setShowPhotoOptions(false)}
                    />
                    <Animated.View
                        entering={SlideInDown.duration(300)}
                        exiting={SlideOutDown.duration(250)}
                        className="absolute bottom-0 left-0 right-0 rounded-t-[32px] overflow-hidden"
                        style={{ paddingBottom: insets.bottom + 20, backgroundColor: cardBg }}
                    >
                        <View className="items-center py-2.5">
                            <View className="w-10 h-1 bg-gray-200 rounded-full" />
                        </View>

                        <TouchableOpacity
                            className="px-6 py-4 flex-row items-center"
                            onPress={pickImage}
                        >
                            <Ionicons name="image-outline" size={24} color={textPrimary} />
                            <Text className="text-[17px] font-medium ml-4" style={{ color: textPrimary }}>New profile picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="px-6 py-4 flex-row items-center"
                            onPress={() => {
                                setProfileImage('');
                                setShowPhotoOptions(false);
                            }}
                        >
                            <Ionicons name="trash-outline" size={24} color="#ed4956" />
                            <Text className="text-[17px] font-medium ml-4 text-[#ed4956]">Remove current picture</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}
        </View>
    );
}
