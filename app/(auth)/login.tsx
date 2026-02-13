import { Text, View, TouchableOpacity, Platform, Dimensions, Image, TextInput, Keyboard, KeyboardAvoidingView, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useAnimatedRef } from 'react-native-reanimated';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const { height } = Dimensions.get('window');
// Initial spacer (35%) and compressed spacer (e.g., 10-15%) for when keyboard is open
const INITIAL_SPACER = height * 0.35;
// Compressed spacer (12%) - moves higher to cover background orbits
const COMPRESSED_SPACER = height * 0.12;

export default function LoginScreen() {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);

    // Shared value for spacer height
    // Shared value for spacer height
    const spacerHeight = useSharedValue(INITIAL_SPACER);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const [scrollPadding, setScrollPadding] = useState(50);

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const bg = 'transparent'; // Fix: Always transparent to show layout animations
    const cardBg = isDarkMode ? '#1f2937' : '#ffffff';
    const textPrimary = isDarkMode ? '#f3f4f6' : '#111827';
    const textSecondary = isDarkMode ? '#9ca3af' : '#6b7280';
    const inputBg = isDarkMode ? 'rgba(255,255,255,0.1)' : '#ffffff'; // Fix: Light white glass effect
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(showEvent, () => {
            spacerHeight.value = withTiming(COMPRESSED_SPACER, { duration: 300 });
            setScrollPadding(350);
        });
        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            spacerHeight.value = withTiming(INITIAL_SPACER, { duration: 300 });
            setScrollPadding(50);
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: true });
            }
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            // Ensure the screen starts at the top when it comes into focus
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: false });
            }
        }, [scrollRef])
    );

    const animatedSpacerStyle = useAnimatedStyle(() => ({
        height: spacerHeight.value
    }));

    return (
        <View className="flex-1" style={{ backgroundColor: bg }}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />

            {/* Fixed Background Layer - REMOVED (Handled in Layout) */}

            {/* Main Layout Container */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'height' : undefined}
                className="flex-1 z-10"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Animated Spacer - Shrinks to pull card up */}
                <Animated.View style={animatedSpacerStyle}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => Keyboard.dismiss()}
                    />
                </Animated.View>

                {/* Fixed Card Container */}
                <View className="flex-1 rounded-t-[30px] shadow-xl overflow-hidden" style={{ backgroundColor: cardBg }}>

                    {/* Internal ScrollView with increased padding */}
                    <Animated.ScrollView
                        ref={scrollRef}
                        className="flex-1"
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: scrollPadding }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        decelerationRate="normal"
                        bounces={true}
                        overScrollMode="always"
                    >

                        <View className="bg-transparent mb-6">
                            <Text className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Welcome Back</Text>
                            <Text className="text-base" style={{ color: textSecondary }}>Please sign in to your account</Text>
                        </View>

                        <View className="gap-4 mb-4">
                            <Input
                                placeholder="Email Address"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                className="h-12"
                                style={{ fontSize: 15, backgroundColor: inputBg, color: textPrimary, borderColor: borderColor }}
                                placeholderTextColor={textSecondary}
                            />
                            <Input
                                placeholder="Password"
                                isPassword
                                className="h-12"
                                style={{ fontSize: 15, backgroundColor: inputBg, color: textPrimary, borderColor: borderColor }}
                                placeholderTextColor={textSecondary}
                            />
                        </View>

                        <View className="flex-row items-center mb-8">
                            <TouchableOpacity
                                onPress={() => setRememberMe(!rememberMe)}
                                className="flex-row items-center gap-2"
                            >
                                <View className={`w-5 h-5 rounded mt-0.5 border ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-400'} justify-center items-center`} style={!rememberMe ? { backgroundColor: isDarkMode ? 'transparent' : 'white', borderColor: textSecondary } : {}}>
                                    {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                                </View>
                                <Text className="text-sm mt-0.5" style={{ color: textSecondary }}>Remember me</Text>
                            </TouchableOpacity>

                            <View className="flex-1" />

                            <TouchableOpacity onPress={() => console.log('Forgot Password')}>
                                <Text className="text-blue-600 font-semibold text-sm">Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            variant="primary"
                            className="mb-6 shadow-lg shadow-blue-500/30"
                            onPress={() => router.replace('/(tabs)')}
                            gradientColors={['#3b82f6', '#9333ea', '#db2777']}
                        >
                            Sign In
                        </Button>

                        <View className="flex-row items-center mb-6 gap-4">
                            <View className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
                            <Text className="text-xs font-bold uppercase tracking-wider" style={{ color: textSecondary }}>Or continue with</Text>
                            <View className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
                        </View>

                        <Button
                            variant="google"
                            icon={<Image source={require('../../assets/images/google-logo.png')} style={{ width: 24, height: 24 }} />}
                            className="mb-10 shadow-sm"
                            style={{ backgroundColor: isDarkMode ? '#374151' : 'white', borderColor: borderColor, borderWidth: 1 }}
                            textStyle={{ color: textPrimary }}
                        >
                            Sign in with Google
                        </Button>

                        <View className="flex-row justify-center items-center pb-10">
                            <Text className="mr-1 text-base" style={{ color: textSecondary }}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text className="text-blue-600 font-bold text-base">Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.ScrollView>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
