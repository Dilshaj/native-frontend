import { Text, View, TouchableOpacity, SafeAreaView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function SignupEmailScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className={`flex-1 bg-[#0b0f19] ${Platform.OS === 'android' ? 'pt-[30px]' : ''}`}>
            <StatusBar style="light" />

            {/* Header */}
            <View className={`flex-row items-center px-5 pb-5 ${Platform.OS === 'android' ? 'pt-5' : ''}`}>
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-white">Sign up</Text>
            </View>

            <View className="p-6 pt-5">
                {/* Email Input */}
                <View className="flex-row items-center bg-[#0b0f19] rounded-xl border border-[#1e293b] mb-5 h-14 pr-3">
                    <View className="pl-4 justify-center">
                        <Ionicons name="mail-outline" size={20} color="white" />
                    </View>
                    <TextInput
                        className="flex-1 text-white text-base px-3 h-full"
                        placeholder="Email"
                        placeholderTextColor="#6b7280"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Password Input */}
                <View className="flex-row items-center bg-[#0b0f19] rounded-xl border border-[#1e293b] mb-5 h-14 pr-3">
                    <View className="pl-4 justify-center">
                        <Ionicons name="lock-closed-outline" size={20} color="white" />
                    </View>
                    <TextInput
                        className="flex-1 text-white text-base px-3 h-full"
                        placeholder="Password"
                        placeholderTextColor="#6b7280"
                        secureTextEntry
                    />
                    <TouchableOpacity className="p-1">
                        <Ionicons name="eye-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="mt-6 rounded-xl overflow-hidden">
                    <LinearGradient
                        colors={['#ec4899', '#8b5cf6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="py-4 items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold">Sign up</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


