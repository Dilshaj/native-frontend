import { Text, View, TouchableOpacity, Platform, Dimensions, Image, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useAnimatedRef } from 'react-native-reanimated';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const { height } = Dimensions.get('window');
// Initial spacer (35%)
const INITIAL_SPACER = height * 0.35;
// Compressed spacer (12%) - moves higher to cover background orbits
const COMPRESSED_SPACER = height * 0.12;

export default function SignupScreen() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [isVerified, setIsVerified] = useState(false);


    // Shared value for spacer height
    const spacerHeight = useSharedValue(INITIAL_SPACER);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const [scrollPadding, setScrollPadding] = useState(50);

    // Animation values for OTP section
    const otpHeight = useSharedValue(0);
    const otpOpacity = useSharedValue(0);

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

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleGetOtp = () => {
        if (phoneNumber.length === 10) {
            setShowOtp(true);
            otpHeight.value = withTiming(65, { duration: 500 }); // Further reduced from 62 to minimize gap
            otpOpacity.value = withTiming(1, { duration: 500 });
            setTimer(30);
        }
    };

    const handleVerify = () => {
        if (otp.length === 6) {
            setIsVerified(true);
            // Smoothly close the OTP section
            otpHeight.value = withTiming(0, { duration: 500 });
            otpOpacity.value = withTiming(0, { duration: 500 });
            setTimeout(() => setShowOtp(false), 500); // Remove from DOM after animation
        }
    };

    const handleResend = () => {
        setTimer(30);
        setOtp('');
    };


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

    const animatedOtpStyle = useAnimatedStyle(() => ({
        height: otpHeight.value,
        opacity: otpOpacity.value,
        overflow: 'hidden',
    }));

    return (
        <View className="flex-1 bg-transparent">
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
                <View className="flex-1 bg-white rounded-t-[30px] shadow-xl overflow-hidden">

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
                            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
                            <Text className="text-gray-500 text-base">Please fill in your details to continue</Text>
                        </View>

                        <View className="gap-4 mb-4">
                            {/* First & Last Name Row */}
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Input
                                        placeholder="First Name"
                                        className="h-12"
                                        style={{ fontSize: 15 }}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Input
                                        placeholder="Last Name"
                                        className="h-12"
                                        style={{ fontSize: 15 }}
                                    />
                                </View>
                            </View>

                            <Input
                                placeholder="Email Address"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                className="h-12"
                                style={{ fontSize: 15 }}
                            />

                            {/* Phone Number with Get OTP */}
                            <View className={`flex-row items-center border ${isVerified ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'} rounded-xl h-12 px-4 w-full`}>
                                <TextInput
                                    className="flex-1 text-gray-900 h-full"
                                    placeholder="Phone Number"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="phone-pad"
                                    style={{ fontSize: 15 }}
                                    value={phoneNumber}
                                    onChangeText={(val) => setPhoneNumber(val.replace(/[^0-9]/g, '').slice(0, 10))}
                                    maxLength={10}
                                    editable={!isVerified}
                                />
                                {isVerified ? (
                                    <View className="bg-green-500 rounded-full w-5 h-5 justify-center items-center">
                                        <Ionicons name="checkmark" size={14} color="white" />
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleGetOtp}
                                        disabled={showOtp || phoneNumber.length !== 10}
                                    >
                                        <Text className={`font-semibold text-sm ${showOtp || phoneNumber.length !== 10 ? 'text-gray-300' : 'text-gray-500'}`}>Get OTP</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {showOtp && (
                                <Animated.View style={animatedOtpStyle}>
                                    <View className="flex-row items-center border border-gray-200 bg-white rounded-xl h-12 px-4 w-full">
                                        <TextInput
                                            className="flex-1 text-gray-900 h-full"
                                            placeholder="Enter OTP"
                                            placeholderTextColor="#9ca3af"
                                            keyboardType="number-pad"
                                            style={{ fontSize: 15 }}
                                            value={otp}
                                            onChangeText={(val) => setOtp(val.replace(/[^0-9]/g, '').slice(0, 6))}
                                            maxLength={6}
                                        />
                                        <TouchableOpacity onPress={handleVerify} disabled={otp.length !== 6}>
                                            <Text className={`font-semibold text-sm ${otp.length !== 6 ? 'text-gray-300' : 'text-gray-500'}`}>Verify</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        onPress={timer === 0 ? handleResend : undefined}
                                        className="mt-0.5 self-end" // Further reduced from mt-1.5
                                        disabled={timer > 0}
                                    >
                                        <Text className="text-gray-500 text-sm">
                                            Resend OTP {timer > 0 ? (
                                                <Text>in <Text className="text-blue-600 font-bold">{timer}s</Text></Text>
                                            ) : ''}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            )}


                            <Input
                                placeholder="Password"
                                isPassword
                                className="h-12"
                                style={{ fontSize: 15 }}
                            />
                        </View>

                        {/* Terms Checkbox */}
                        <View className="flex-row items-center mb-8">
                            <TouchableOpacity
                                onPress={() => setAgreed(!agreed)}
                                className="flex-row items-center gap-2"
                            >
                                <View className={`w-5 h-5 rounded mt-0.5 border ${agreed ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'} justify-center items-center`}>
                                    {agreed && <Ionicons name="checkmark" size={14} color="white" />}
                                </View>
                                <Text className="text-gray-600 text-sm mt-0.5">I agree to the <Text className="text-blue-600">Terms and Conditions</Text></Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            variant="primary"
                            className="mb-6 shadow-lg shadow-blue-500/30"
                            onPress={() => console.log('Register')}
                            gradientColors={['#3b82f6', '#9333ea', '#db2777']} // Synced with Sign In
                        >
                            Register & Login
                        </Button>

                        <View className="flex-row items-center mb-6 gap-4">
                            <View className="flex-1 h-[1px] bg-gray-200" />
                            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">OR CONTINUE WITH</Text>
                            <View className="flex-1 h-[1px] bg-gray-200" />
                        </View>

                        {/* Google Sign In - Centered Card Style */}
                        <Button
                            variant="google"
                            icon={<Image source={require('../../assets/images/google-logo.png')} style={{ width: 24, height: 24 }} />}
                            className="mb-10 shadow-sm"
                            onPress={() => console.log('Google Sign In')}
                        >
                            Sign in with Google
                        </Button>

                        {/* Add "Already have an account?" Footer just in case */}
                        <View className="flex-row justify-center items-center pb-10">
                            <Text className="text-gray-600 mr-1 text-base">Already have an account?</Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text className="text-blue-600 font-bold text-base">Sign in</Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.ScrollView>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
