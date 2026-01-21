import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, Platform, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function MoreScreen() {
    const slideAnim = useRef(new Animated.Value(-width)).current; // Start off-screen to the left
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            // Reset to starting position
            slideAnim.setValue(-width);
            // Animate to final position
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, [])
    );

    return (
        <SafeAreaView className={`flex-1 bg-[#0b0f19] ${Platform.OS === 'android' ? 'pt-[30px]' : ''}`}>
            <StatusBar style="light" />
            <Animated.View className="flex-1" style={{ transform: [{ translateX: slideAnim }] }}>
                <View className="px-5 py-4 border-b border-[#1f2937]">
                    <Text className="text-2xl font-bold text-white">More</Text>
                </View>

                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
                    <View className="mb-8">
                        <Text className="text-base font-bold text-white mb-4">Help & Information</Text>

                        <MenuItem
                            icon="document-text-outline"
                            label="View Privacy Policy"
                        />
                        <MenuItem
                            icon="document-text-outline"
                            label="View Terms of Service"
                            active
                        />
                        <MenuItem
                            icon="ribbon-outline"
                            label="View Licensing Info"
                        />
                    </View>

                    <Text className="text-sm text-[#9ca3af]">Version: 1.1.13 (110)</Text>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

function MenuItem({ icon, label, active = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; active?: boolean }) {
    return (
        <TouchableOpacity className={`flex-row items-center py-4 px-3 rounded-lg mb-2 ${active ? 'bg-white/5' : ''}`}>
            <Ionicons name={icon} size={24} color="#d946ef" className="mr-4" />
            <Text className="text-base text-[#e5e7eb] ml-4">{label}</Text>
        </TouchableOpacity>
    );
}
