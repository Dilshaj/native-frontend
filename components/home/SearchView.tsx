import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    FadeInUp,
    FadeOut
} from 'react-native-reanimated';



// Helper components moved inside to access props


interface SearchViewProps {
    isDarkMode: boolean; // Make sure this is passed down!
    onHide: () => void;
    shouldFocus: boolean;
}

// Update Helper Components to accept isDarkMode or handle it via props/context if needed.
// For simplicity in this functional component, we can pass isDarkMode to children or define them inside.
// Since they are outside, we'll modify them to accept props or move them inside.
// Actually, let's move them inside to access isDarkMode directly or pass it.
// MOVED HELPER COMPONENTS INSIDE or pass props.
// To avoid big refactor, I will just update the external components to accept isDarkMode prop OR move them inside using "ReplacementContent" that defines them inside? 
// No, I'll update the calls to pass `isDarkMode`. But the definition is above. 
// I will just redefine them inside for cleaner access or modify the definition above.
// Modifying definition above is cleaner for diffs.


export default function SearchView({ isDarkMode, onHide, shouldFocus }: SearchViewProps) {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const inputRef = useRef<TextInput>(null);
    const focusAnim = useSharedValue(0);
    const [isFocused, setIsFocused] = useState(false);
    const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);

    const bg = isDarkMode ? '#000000' : '#ffffff';
    const textPrimary = isDarkMode ? '#f3f4f6' : '#000000';
    const textSecondary = isDarkMode ? '#9ca3af' : '#999999';
    const inputBg = isDarkMode ? '#1f2937' : '#f2f2f2';
    const cardBorder = isDarkMode ? '#374151' : '#f0f0f0';
    const chipBg = isDarkMode ? '#1f2937' : '#f9f9f9';

    // Helper components defined inside to access theme
    function Section({ title, children }: { title: string, children: React.ReactNode }) {
        return (
            <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-[17px] font-bold" style={{ color: textPrimary }}>{title}</Text>
                    {title === "Popular communities" && (
                        <TouchableOpacity><Text style={{ color: textSecondary, fontSize: 13 }}>See more</Text></TouchableOpacity>
                    )}
                </View>
                {children}
            </View>
        );
    }

    function Chip({ label, icon }: { label: string, icon?: any }) {
        return (
            <TouchableOpacity
                className="px-4 py-2.5 rounded-full mr-2 mb-3 border"
                style={{ backgroundColor: chipBg, borderColor: cardBorder }}
            >
                {icon && <Ionicons name={icon} size={14} color={textPrimary} style={{ marginRight: 6 }} />}
                <Text className="font-semibold text-[14px]" style={{ color: textPrimary }}>{label}</Text>
            </TouchableOpacity>
        );
    }

    const INITIAL_SUGGESTIONS = [
        { id: '1', name: "ruahi730", handle: "Ruhi Chaudhary", followers: "240K followers", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" },
        { id: '2', name: "akshithaaaa.a", handle: "Akshitha Addanki", followers: "309 followers", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" },
        { id: '3', name: "sania05712", handle: "sania05712", followers: "21.7K followers", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
        { id: '4', name: "fathima.__27", handle: "fathima.__27", followers: "91.7K followers", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80" },
        { id: '5', name: "laxmi_patel9027", handle: "L 🥰🥀🤩A", followers: "69.8K followers", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80" },
        { id: '6', name: "aarti770644", handle: "Aarti sarma", followers: "47.6K followers", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" },
    ];

    const TOPICS_PICKED = ['Ultra HD wallpaper', 'The Grammys', 'Hazbin Hotel', 'ChappellRoan', 'Animation', 'simple', 'nifty50'];
    const POPULAR_COMMUNITIES = [
        { name: 'Photographers of Threads', icon: 'camera-outline' },
        { name: 'Book Threads', icon: 'book-outline' },
        { name: 'Food Threads', icon: 'fast-food-outline' },
        { name: 'WNBA Threads', icon: 'basketball-outline' },
        { name: 'Cats of Threads', icon: 'paw-outline' },
    ];
    const POPULAR_TOPICS = ['doglover', 'free fire', 'dark wallpaper', 'cars Wallpaper', 'live wallpaper', 'ParadiseHulu', 'Batman wallpaper'];

    const headerTitleStyle = useAnimatedStyle(() => ({
        opacity: withTiming(focusAnim.value === 1 ? 0 : 1, { duration: 250 }),
        transform: [
            { translateY: withTiming(focusAnim.value === 1 ? -30 : 0, { duration: 250 }) },
            { scale: withTiming(focusAnim.value === 1 ? 0.9 : 1, { duration: 250 }) }
        ],
        marginBottom: withTiming(focusAnim.value === 1 ? -61 : 12, { duration: 250 }),
    }));

    const inputContainerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: withTiming(focusAnim.value === 1 ? -52 : 0, { duration: 250 }) },
            { translateX: withTiming(focusAnim.value === 1 ? 33 : 0, { duration: 250 }) }
        ],
        width: withTiming(focusAnim.value === 1 ? width - 74 : width - 32, { duration: 250 }),
        borderRadius: withTiming(12, { duration: 250 }),
    }));

    const backButtonStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: 0 },
            { translateX: withTiming(focusAnim.value === 1 ? -2 : 0, { duration: 250 }) }
        ],
    }));

    const contentContainerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: withTiming(focusAnim.value === 1 ? -55 : 10, { duration: 250 }) }
        ],
    }));

    const handleFocus = () => {
        focusAnim.value = 1;
        setIsFocused(true);
    };

    const handleBlur = () => {
        focusAnim.value = withTiming(0, { duration: 250 });
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const handleBack = () => {
        if (isFocused) {
            handleBlur();
        } else {
            onHide();
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: bg }}>
            <View
                className="px-4 pb-0 self-center w-full max-w-[800px] md:px-10"
                style={{
                    paddingTop: Platform.OS === 'android' ? (insets.top + 20) : insets.top,
                }}
            >
                <View className="flex-row items-center h-14 mb-2">
                    <Animated.View style={backButtonStyle}>
                        <TouchableOpacity
                            onPress={handleBack}
                            className={`w-10 h-10 items-center justify-center -ml-2 mr-0 rounded-full ${isDarkMode ? 'bg-white/10' : ''}`}
                        >
                            <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#fff' : '#666'} />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={headerTitleStyle}>
                        <Text style={{ color: textPrimary, fontSize: 32, fontWeight: '700', letterSpacing: -0.5 }}>Search</Text>
                    </Animated.View>
                </View>

                <Animated.View
                    style={[{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 42,
                        paddingHorizontal: 12,
                        backgroundColor: inputBg,
                    }, inputContainerStyle]}
                >
                    <Ionicons name="search" size={20} color={textSecondary} />
                    <TextInput
                        ref={inputRef}
                        placeholder="Search"
                        placeholderTextColor={textSecondary}
                        className="flex-1 ml-2 text-[17px]"
                        style={{ color: textPrimary, fontWeight: '400' }}
                        onFocus={handleFocus}
                    />
                    {isFocused && (
                        <TouchableOpacity
                            className="ml-2"
                            onPress={() => setIsFilterMenuVisible(!isFilterMenuVisible)}
                        >
                            <Ionicons name="options-outline" size={20} color={textSecondary} />
                        </TouchableOpacity>
                    )}
                </Animated.View>

                {isFilterMenuVisible && (
                    <>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={StyleSheet.absoluteFill}
                            onPress={() => setIsFilterMenuVisible(false)}
                        />
                        <Animated.View
                            entering={FadeInUp.duration(200)}
                            exiting={FadeOut.duration(150)}
                            style={{
                                position: 'absolute',
                                top: Platform.OS === 'android' ? (insets.top + 65) : insets.top + 60,
                                right: 16,
                                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                                borderRadius: 12,
                                paddingVertical: 8,
                                width: 210,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 8,
                                zIndex: 1000,
                            }}
                        >
                            {[
                                { label: 'After date', icon: 'time-outline' },
                                { label: 'Before date', icon: 'time-outline', flip: true },
                                { label: 'From profile', icon: 'person-outline' },
                            ].map((item, index, arr) => (
                                <View key={index}>
                                    <TouchableOpacity
                                        className="flex-row items-center justify-between px-4 py-3"
                                        onPress={() => setIsFilterMenuVisible(false)}
                                    >
                                        <Text style={{ fontSize: 16, color: textPrimary, fontWeight: '400' }}>{item.label}</Text>
                                        <Ionicons
                                            name={item.icon as any}
                                            size={20}
                                            color={textPrimary}
                                            style={item.flip ? { transform: [{ scaleX: -1 }] } : {}}
                                        />
                                    </TouchableOpacity>
                                    {index !== arr.length - 1 && (
                                        <View style={{ height: 1, backgroundColor: cardBorder, marginHorizontal: 0 }} />
                                    )}
                                </View>
                            ))}
                        </Animated.View>
                    </>
                )}
            </View>

            <Animated.ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                style={[contentContainerStyle, { alignSelf: 'center', width: '100%', maxWidth: 800 }]}
            >
                {!isFocused ? (
                    <View className="px-4 pt-4">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                            {['Ultra HD wallpaper', 'ChappellRoan', 'Animation'].map((chip, i) => (
                                <TouchableOpacity
                                    key={i}
                                    className="px-5 py-2 rounded-full mr-2 border"
                                    style={{ backgroundColor: chipBg, borderColor: cardBorder }}
                                >
                                    <Text className="font-semibold text-[14px]" style={{ color: textSecondary }}>{chip}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View className="gap-6">
                            {INITIAL_SUGGESTIONS.map((user) => (
                                <View key={user.id} className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1 mr-4">
                                        <Image
                                            source={{ uri: user.image }}
                                            style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }}
                                        />
                                        <View className="flex-1">
                                            <Text className="font-bold text-[15px]" style={{ color: textPrimary }}>{user.name}</Text>
                                            <Text className="text-[14px] opacity-40 leading-tight" style={{ color: textPrimary }}>{user.handle}</Text>
                                            <Text className="text-[14px] opacity-50 mt-0.5" style={{ color: textPrimary }}>{user.followers}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        className="px-6 py-2 rounded-xl border border-gray-200"
                                        style={{ backgroundColor: isDarkMode ? '#fff' : '#000' }}
                                    >
                                        <Text className="font-bold text-[14px]" style={{ color: isDarkMode ? '#000' : '#fff' }}>Follow</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View className="px-4 pt-2">
                        <Section title="Topics picked for you">
                            <View className="flex-row flex-wrap">
                                {TOPICS_PICKED.map((topic, i) => (
                                    <Chip key={i} label={topic} />
                                ))}
                            </View>
                        </Section>

                        <Section title="Popular communities">
                            <View className="flex-row flex-wrap">
                                {POPULAR_COMMUNITIES.map((community, i) => (
                                    <Chip key={i} label={community.name} icon={community.icon} />
                                ))}
                            </View>
                        </Section>

                        <Section title="Popular topics">
                            <View className="flex-row flex-wrap">
                                {POPULAR_TOPICS.map((topic, i) => (
                                    <Chip key={i} label={topic} />
                                ))}
                            </View>
                        </Section>
                    </View>
                )}
            </Animated.ScrollView>
        </View>
    );
}
