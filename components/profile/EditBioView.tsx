import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EditBioViewProps {
    initialBio: string;
    onSave: (bio: string) => void;
    onClose: () => void;
    isDarkMode: boolean;
}

export default function EditBioView({ initialBio, onSave, onClose, isDarkMode }: EditBioViewProps) {
    const insets = useSafeAreaInsets();
    const [bio, setBio] = useState(initialBio);

    const bg = isDarkMode ? '#111827' : '#fff';
    const textPrimary = isDarkMode ? '#f3f4f6' : '#000';
    const textSecondary = isDarkMode ? '#9ca3af' : '#666';

    return (
        <View className="flex-1" style={{ backgroundColor: bg }}>
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-5 pb-3 self-center w-full max-w-[800px] md:px-10"
                style={{
                    paddingTop: Platform.OS === 'android' ? (insets.top + 8) : (insets.top + 2),
                    backgroundColor: bg
                }}
            >
                <TouchableOpacity onPress={onClose} className="p-1">
                    <Ionicons name="close" size={28} color={textPrimary} />
                </TouchableOpacity>
                <Text className="text-[18px] font-bold" style={{ color: textPrimary }}>Edit bio</Text>
                <TouchableOpacity onPress={() => onSave(bio)} className="p-1">
                    <Ionicons name="checkmark" size={28} color={textPrimary} />
                </TouchableOpacity>
            </View>

            <View className="flex-1 px-4 pt-4 self-center w-full max-w-[800px] md:px-10">
                {/* Main Card */}
                <View
                    style={{
                        backgroundColor: bg,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                        padding: 16,
                        minHeight: 140
                    }}
                >
                    <Text className="text-[15px] font-bold mb-1" style={{ color: textPrimary }}>Bio</Text>
                    <TextInput
                        placeholder="Write a bio..."
                        placeholderTextColor="#ccc"
                        className="text-[15px] p-0"
                        style={{ color: textPrimary, textAlignVertical: 'top' }}
                        multiline
                        autoFocus
                        value={bio}
                        onChangeText={setBio}
                    />
                </View>

                {/* Footer Text */}
                <Text className="text-center mt-4 text-[13px]" style={{ color: textSecondary }}>
                    Your bio is public.
                </Text>
            </View>
        </View>
    );
}
