import { View, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { OrbitalAnimations } from '@/components/OrbitalAnimations';

export default function AuthLayout() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View className="flex-1" style={{ backgroundColor: isDarkMode ? '#111827' : '#f0f9ff' }}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />

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
