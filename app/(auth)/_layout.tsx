import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { OrbitalAnimations } from '@/components/OrbitalAnimations';

export default function AuthLayout() {
    return (
        <View className="flex-1 bg-[#f0f9ff]">
            <StatusBar style="dark" />

            {/* Shared Background Layer */}
            <View className="absolute top-0 left-0 right-0 h-[38%] overflow-hidden z-0">
                <OrbitalAnimations />
            </View>

            {/* Content Layer */}
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'fade'
            }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="signup-email" />
                <Stack.Screen name="reset-password" />
            </Stack>
        </View>
    );
}
