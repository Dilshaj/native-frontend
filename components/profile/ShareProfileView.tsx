import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Pressable, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';




interface ShareProfileViewProps {
    isDarkMode: boolean;
    onClose: () => void;
}

export default function ShareProfileView({ isDarkMode, onClose }: ShareProfileViewProps) {
    const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
    const isTablet = SCREEN_WIDTH >= 768;
    const SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;
    const insets = useSafeAreaInsets();
    const translateY = useSharedValue(SCREEN_HEIGHT * 0.72);
    const context = useSharedValue(0);

    useEffect(() => {
        translateY.value = withSpring(0, {
            damping: 20,
            stiffness: 90,
            mass: 0.5
        });
    }, []);

    const handleClose = () => {
        translateY.value = withTiming(SHEET_HEIGHT, { duration: 250 }, (finished) => {
            if (finished) {
                runOnJS(onClose)();
            }
        });
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = translateY.value;
        })
        .onUpdate((event) => {
            if (event.translationY > 0) {
                translateY.value = context.value + event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY > 150 || event.velocityY > 500) {
                runOnJS(handleClose)();
            } else {
                translateY.value = withSpring(0, { damping: 20 });
            }
        });

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    return (
        <GestureHandlerRootView className="absolute inset-0 z-[2200]">
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                className="flex-1 bg-black/40 justify-end"
            >
                <Pressable className="absolute inset-0" onPress={handleClose} />

                <GestureDetector gesture={panGesture}>
                    <Animated.View
                        style={[{ height: SHEET_HEIGHT, paddingBottom: insets.bottom + 10, alignSelf: 'center', width: isTablet ? 600 : '100%' }, sheetStyle]}
                        className={`bg-[#f2f2f2] ${isTablet ? 'rounded-[40px] mb-10' : 'rounded-t-[40px]'} shadow-2xl`}
                    >
                        {/* Drag Handle Area */}
                        <View className="items-center py-3">
                            <View className="w-8 h-1 bg-gray-300 rounded-full" />
                        </View>

                        <ScrollView
                            className="flex-1 px-5"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            {/* QR Section */}
                            <View className="items-center mt-0 mb-5">
                                <View className="w-[170px] h-[170px] items-center justify-center relative mb-2.5">
                                    <Image
                                        source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=eduprova_user_profile_share_link&margin=0&bgcolor=f2f2f2&color=000000' }}
                                        style={{ width: 170, height: 170 }}
                                    />
                                    <View className="absolute bg-[#f2f2f2] p-1.5 rounded-xl">
                                        <MaterialCommunityIcons name="at" size={24} color="black" />
                                    </View>
                                </View>
                                <Text className="text-[17px] font-bold text-black tracking-tight">varahanarasimha_logisa</Text>
                            </View>

                            {/* Primary Actions Row */}
                            <View className="flex-row gap-3 mb-2.5">
                                <TouchableOpacity className="flex-1 h-[60px] bg-white rounded-[18px] items-center justify-center shadow-sm">
                                    <MaterialCommunityIcons name="tray-arrow-down" size={20} color="#000" />
                                    <Text className="text-[11px] font-bold mt-1">Download</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 h-[60px] bg-white rounded-[18px] items-center justify-center shadow-sm">
                                    <MaterialCommunityIcons name="qrcode-scan" size={20} color="#000" />
                                    <Text className="text-[11px] font-bold mt-1">Scan</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Secondary Actions List */}
                            <View className="bg-white rounded-[18px] overflow-hidden shadow-sm">
                                <TouchableOpacity className="flex-row items-center justify-between px-6 py-3.5 border-b border-gray-50/50">
                                    <Text className="text-[14px] font-bold">Copy link</Text>
                                    <Ionicons name="link-outline" size={18} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center justify-between px-6 py-3.5">
                                    <Text className="text-[14px] font-bold">Share to</Text>
                                    <Ionicons name="share-outline" size={18} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </GestureDetector>
            </Animated.View>
        </GestureHandlerRootView>
    );
}
