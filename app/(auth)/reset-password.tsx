import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View className="flex-1 bg-[#0b0f19]">
                <StatusBar style="light" />

                {/* Header */}
                <View className="flex-row items-center justify-between pt-[50px] px-5 pb-5 border-b-0">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Reset Password</Text>
                    <View className="w-6" />
                </View>

                <ScrollView contentContainerStyle={{ padding: 24 }}>

                    {/* Email Input */}
                    <View className="flex-row items-center bg-[#0b0f19] rounded-lg border border-[#1e293b] mb-4 h-14">
                        <View className="pl-4 justify-center">
                            <Ionicons name="mail-outline" size={20} color="white" />
                        </View>
                        <TextInput
                            className="flex-1 text-white text-base px-4 h-full"
                            placeholder="Email"
                            placeholderTextColor="#6b7280"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* New Password Input */}
                    <View className="flex-row items-center bg-[#0b0f19] rounded-lg border border-[#1e293b] mb-4 h-14">
                        <View className="pl-4 justify-center">
                            <Ionicons name="lock-closed-outline" size={20} color="white" />
                        </View>
                        <TextInput
                            className="flex-1 text-white text-base px-4 h-full"
                            placeholder="New password"
                            placeholderTextColor="#6b7280"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="p-3"
                        >
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Send Verification Button */}
                    <TouchableOpacity className="mt-6 rounded-lg overflow-hidden" onPress={() => { /* Handle Reset */ }}>
                        <LinearGradient
                            colors={['#ec4899', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-4 items-center justify-center"
                        >
                            <Text className="text-white text-base font-bold">Send Verification</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}


