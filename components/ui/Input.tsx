import { TextInput, View, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface InputProps extends TextInputProps {
    icon?: keyof typeof Ionicons.glyphMap;
    isPassword?: boolean;
    className?: string;
}

export function Input({ icon, isPassword, className, ...props }: InputProps) {
    const [showPassword, setShowPassword] = useState(!isPassword);

    return (
        <View className={`flex-row items-center border border-gray-200 rounded-xl bg-white h-11 px-4 w-full ${className || ''}`}>
            {icon && <Ionicons name={icon} size={20} color="#9ca3af" className="mr-3" />}
            <TextInput
                className="flex-1 text-gray-900 text-base h-full"
                placeholderTextColor="#9ca3af"
                secureTextEntry={isPassword && !showPassword}
                {...props}
            />
            {isPassword && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9ca3af" />
                </TouchableOpacity>
            )}
        </View>
    );
}

