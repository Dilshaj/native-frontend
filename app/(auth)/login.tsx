import { Text, View, TouchableOpacity, Platform, Dimensions, Image, TextInput, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useCallback, useEffect } from 'react';
import Animated, { useAnimatedRef, useScrollViewOffset, withTiming, useSharedValue } from 'react-native-reanimated';

import { OrbitalAnimations } from '@/components/OrbitalAnimations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const { height } = Dimensions.get('window');
const SPACER_HEIGHT = height * 0.35;

export default function LoginScreen() {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    useEffect(() => {
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        const subscription = Keyboard.addListener(hideEvent, () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: true });
            }
        });
        return () => subscription.remove();
    }, [scrollRef]);

    const handleInputFocus = useCallback(() => {
        // When input focuses, scroll the card up to cover the background
        // This ensures maximum space for the keyboard
        console.log('Input focused, scrolling to top');
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ y: SPACER_HEIGHT, animated: true });
        }
    }, [SPACER_HEIGHT, scrollRef]);

    return (
        <View className="flex-1 bg-[#f0f9ff]">
            <StatusBar style="dark" />

            {/* Fixed Background Layer */}
            <View className="absolute top-0 left-0 right-0 h-[38%] overflow-hidden z-0">
                <OrbitalAnimations />
            </View>

            {/* Scrollable Forensic Layer (The "Card") */}
            <Animated.ScrollView
                ref={scrollRef}
                className="flex-1 z-10"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                // Snap to top (0) or after the spacer (SPACER_HEIGHT)
                // This creates the "Sheet" feeling where it snaps open or closed
                snapToOffsets={[0, SPACER_HEIGHT]}
                decelerationRate="fast"
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
            >
                {/* Transparent Spacer - Allows background to be seen */}
                {/* Tapping here dismisses keyboard/resets view essentially */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ height: SPACER_HEIGHT }}
                    onPress={() => Keyboard.dismiss()}
                />

                {/* Main Login Card */}
                <View className="bg-white rounded-t-[30px] shadow-xl px-6 pt-8 pb-10 min-h-[80vh]">

                    {/* Drag Handle Indicator */}
                    <View className="items-center mb-6">
                        <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
                    </View>

                    <View className="bg-transparent mb-6">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
                        <Text className="text-gray-500 text-base">Please sign in to your account</Text>
                    </View>

                    <View className="gap-4 mb-4">
                        <Input
                            placeholder="Email Address"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            className="h-12"
                            style={{ fontSize: 15 }}
                            onFocus={handleInputFocus}
                        />
                        <Input
                            placeholder="Password"
                            isPassword
                            className="h-12"
                            style={{ fontSize: 15 }}
                            onFocus={handleInputFocus}
                        />
                    </View>

                    <View className="flex-row items-center mb-8">
                        <TouchableOpacity
                            onPress={() => setRememberMe(!rememberMe)}
                            className="flex-row items-center gap-2"
                        >
                            <View className={`w-5 h-5 rounded mt-0.5 border ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'} justify-center items-center`}>
                                {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                            </View>
                            <Text className="text-gray-600 text-sm mt-0.5">Remember me</Text>
                        </TouchableOpacity>

                        <View className="flex-1" />

                        <TouchableOpacity onPress={() => console.log('Forgot Password')}>
                            <Text className="text-blue-600 font-semibold text-sm">Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        variant="primary"
                        className="mb-6 h-12 shadow-lg shadow-blue-500/30"
                        onPress={() => router.replace('/(tabs)')}
                        gradientColors={['#3b82f6', '#9333ea', '#db2777']}
                    >
                        Sign In
                    </Button>

                    <View className="flex-row items-center mb-6 gap-4">
                        <View className="flex-1 h-[1px] bg-gray-200" />
                        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Or continue with</Text>
                        <View className="flex-1 h-[1px] bg-gray-200" />
                    </View>

                    <Button
                        variant="google"
                        icon={<Image source={require('../../assets/images/google-logo.png')} style={{ width: 20, height: 20 }} />}
                        className="mb-6 h-12"
                    >
                        Sign in with Google
                    </Button>

                    <View className="flex-row justify-center items-center pb-10">
                        <Text className="text-gray-600 mr-1 text-base">Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/signup')}>
                            <Text className="text-blue-600 font-bold text-base">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}
