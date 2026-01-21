import { Text, View, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image'; // Use expo-image for better performance if available, or react-native Image

export default function SignupScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#0b0f19]">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center px-5 py-4 pt-[50px] border-b-0">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Sign up</Text>
            </View>

            <View className="p-6 pt-10 flex-1">
                <View className="items-center mb-6">
                    <Text className="text-lg font-bold text-white mb-4">
                        Sign up to <Text className="text-[#d946ef]">Eduprova</Text>
                    </Text>
                    <Text className="text-[#e5e7eb] text-base">Social sign up with</Text>
                </View>

                <View className="flex-row gap-4 mb-10">
                    <TouchableOpacity className="flex-1 h-14 border border-[#374151] rounded-xl justify-center items-center bg-[#111827]">
                        <Image source={require('../../assets/images/google-logo.png')} className="w-6 h-6" contentFit="contain" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 h-14 border border-[#374151] rounded-xl justify-center items-center bg-[#111827]">
                        <Ionicons name="logo-apple" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 h-14 border border-[#374151] rounded-xl justify-center items-center bg-[#111827]">
                        <Image source={require('../../assets/images/microsoft-logo.png')} className="w-6 h-6" contentFit="contain" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center mb-10 relative justify-center">
                    <View className="flex-1 h-[1px] bg-[#374151]" />
                    <View className="w-10 h-10 rounded-full border border-[#374151] bg-[#0b0f19] justify-center items-center mx-2.5">
                        <Text className="text-white text-xs font-bold">OR</Text>
                    </View>
                    <View className="flex-1 h-[1px] bg-[#374151]" />
                </View>

                <TouchableOpacity onPress={() => router.push('/signup-email')}>
                    <LinearGradient
                        colors={['#ec4899', '#8b5cf6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-14 rounded-xl justify-center items-center"
                    >
                        <Text className="text-white text-lg font-bold">Sign up with email</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


