import { Text, View, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AI_SKILLS = [
    { id: '1', title: 'My Courses', sub: '12 Active', icon: 'book-outline', color: '#0ea5e9', badge: '3 New' },
    { id: '2', title: 'AI Resume Builder', sub: 'Create ATS-friendly resume', icon: 'document-text-outline', color: '#8b5cf6', badge: null },
    { id: '3', title: 'Mock Interviews', sub: 'Practice with AI', icon: 'mic-outline', color: '#ec4899', badge: 'Pro' },
    { id: '4', title: 'English Grammar', sub: 'Improve your skills', icon: 'text-outline', color: '#10b981', badge: null },
];

const BUSINESS_CAREER = [
    { id: '1', title: 'Startup Fundraising', sub: 'Pitch deck & investors', icon: 'rocket-outline', color: '#f97316' },
    { id: '2', title: 'Freelancing Hub', sub: 'Find projects', icon: 'briefcase-outline', color: '#f59e0b' },
];

const COMMUNICATION = [
    { id: '1', title: 'Messages', icon: 'chatbubble-outline', color: '#3b82f6', badge: '24' },
    { id: '2', title: 'Video Calls', icon: 'videocam-outline', color: '#ef4444', badge: null },
    { id: '3', title: 'Meetings', icon: 'calendar-outline', color: '#8b5cf6', badge: null },
];

const SETTINGS_MENU = [
    { id: '1', title: 'Settings', icon: 'settings-outline' },
    { id: '2', title: 'Help & Support', icon: 'help-circle-outline' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const isDarkMode = params.isDark === 'true'; // Receive isDark param

    // Dynamic Styles
    const bgColors = isDarkMode ? ['#0f172a', '#020617'] : ['#ffffff', '#f8fafc'];
    const textColor = isDarkMode ? 'white' : '#0f172a';
    const subTextColor = isDarkMode ? '#94a3b8' : '#64748b';
    const cardBg = isDarkMode ? '#0f172a' : '#ffffff';
    const cardBorder = isDarkMode ? '#1e293b' : '#e2e8f0';
    const sectionTitleColor = isDarkMode ? 'white' : '#334155';
    const iconBg = isDarkMode ? '#1e293b' : '#f1f5f9';
    const listBg = isDarkMode ? '#0f172a' : '#ffffff';

    return (

        <View className="flex-1">
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={isDarkMode ? "light" : "dark"} />

            {/* Background Gradient */}
            <LinearGradient
                colors={bgColors as any}
                className="absolute inset-0"
            />

            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className={`flex-row items-center justify-between px-4 py-3 ${Platform.OS === 'android' ? 'mt-[30px]' : ''}`}>
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full justify-center items-center" style={{ backgroundColor: iconBg }}>
                        <Ionicons name="arrow-back" size={24} color={textColor} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold" style={{ color: textColor }}>Profile</Text>
                    <View className="w-10" />
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

                    {/* User Profile Card */}
                    <View className="mt-5 flex-row items-center">
                        <View className="relative mr-4">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
                                className="w-[70px] h-[70px] rounded-[25px] border-2"
                                style={{ borderColor: cardBorder }}
                            />
                            <View className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full justify-center items-center border-2 bg-[#8b5cf6]" style={{ borderColor: isDarkMode ? '#020617' : '#ffffff' }}>
                                <Ionicons name="ribbon" size={12} color="white" />
                            </View>
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-center gap-1.5">
                                <Text className="text-xl font-bold" style={{ color: textColor }}>Alex Johnson</Text>
                                <Ionicons name="checkmark-circle" size={18} color="#0ea5e9" />
                            </View>
                            <Text className="text-sm mt-0.5" style={{ color: subTextColor }}>alex.johnson@email.com</Text>
                            <View className="flex-row items-center mt-1.5 gap-2.5">
                                <View className="bg-[#1e3a8a] px-2 py-0.5 rounded-md border border-[#3b82f6]">
                                    <Text className="text-[#3b82f6] text-[10px] font-bold">PRO Member</Text>
                                </View>
                                <Text className="text-[#64748b] text-xs">Since 2024</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="w-10 h-10 rounded-full justify-center items-center" style={{ backgroundColor: iconBg }}>
                            <Ionicons name="pencil" size={18} color={subTextColor} />
                        </TouchableOpacity>
                    </View>

                    {/* Stats Card */}
                    <LinearGradient colors={isDarkMode ? ['#1e293b', '#0f172a'] : ['#f0f9ff', '#e0f2fe']} className="mt-6 rounded-2xl p-4 flex-row items-center border" style={{ borderColor: cardBorder }}>
                        <View className="w-12 h-12 rounded-full bg-[#f97316] justify-center items-center mr-4">
                            <Ionicons name="trophy" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold" style={{ color: textColor }}>Level 24</Text>
                            <Text className="text-xs mt-0.5" style={{ color: subTextColor }}>2,450 XP to next level</Text>
                        </View>
                        <View className="flex-row">
                            <View className="px-2.5 py-1.5 rounded-lg flex-row items-center gap-1.5 border" style={{ backgroundColor: isDarkMode ? '#1e293b' : 'white', borderColor: cardBorder }}>
                                <Ionicons name="flash" size={14} color="#eab308" />
                                <Text className="text-sm font-semibold" style={{ color: textColor }}>8,750</Text>
                            </View>
                            <View className="ml-2 px-2.5 py-1.5 rounded-lg flex-row items-center gap-1.5 border" style={{ backgroundColor: isDarkMode ? '#1e293b' : 'white', borderColor: cardBorder }}>
                                <Ionicons name="star" size={14} color="#0ea5e9" />
                                <Text className="text-sm font-semibold" style={{ color: textColor }}>156</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* AI Skills Section */}
                    <View className="flex-row justify-between items-center mt-8 mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="color-wand-outline" size={20} color="#0ea5e9" />
                            <Text className="text-base font-bold" style={{ color: sectionTitleColor }}>AI Skills & Learning</Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-[#0ea5e9] text-xs font-semibold">View All <Ionicons name="chevron-forward" size={12} /></Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap gap-3">
                        {AI_SKILLS.map((item) => (
                            <TouchableOpacity key={item.id} className="rounded-[20px] p-4 items-center border relative" style={{ width: (width - 32 - 12) / 2, backgroundColor: cardBg, borderColor: cardBorder }}>
                                {item.badge && (
                                    <View className="absolute top-3 right-3 px-1.5 py-0.5 rounded-md" style={{ backgroundColor: item.badge === 'Pro' ? '#f59e0b' : '#0ea5e9' }}>
                                        <Text className="text-white text-[10px] font-bold">{item.badge}</Text>
                                    </View>
                                )}
                                <View className="w-14 h-14 rounded-[20px] justify-center items-center mb-3 mt-2" style={{ backgroundColor: item.color }}>
                                    <Ionicons name={item.icon as any} size={28} color="white" />
                                </View>
                                <Text className="text-sm font-semibold mb-1 text-center" style={{ color: textColor }}>{item.title}</Text>
                                {item.sub && <Text className="text-[#64748b] text-[11px] text-center" style={{ color: subTextColor }}>{item.sub}</Text>}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Business Section */}
                    <View className="flex-row justify-between items-center mt-6 mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="briefcase-outline" size={20} color="#f59e0b" />
                            <Text className="text-base font-bold" style={{ color: sectionTitleColor }}>Business & Career</Text>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap gap-3">
                        {BUSINESS_CAREER.map((item) => (
                            <TouchableOpacity key={item.id} className="rounded-[20px] p-4 items-center border relative" style={{ width: (width - 32 - 12) / 2, backgroundColor: cardBg, borderColor: cardBorder }}>
                                <View className="w-14 h-14 rounded-2xl justify-center items-center mb-3 mt-2" style={{ backgroundColor: item.color }}>
                                    <Ionicons name={item.icon as any} size={28} color="white" />
                                </View>
                                <Text className="text-sm font-semibold mb-1 text-center" style={{ color: textColor }}>{item.title}</Text>
                                <Text className="text-[#64748b] text-[11px] text-center" style={{ color: subTextColor }}>{item.sub}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Communication Section */}
                    <View className="flex-row justify-between items-center mt-6 mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="chatbubbles-outline" size={20} color="#3b82f6" />
                            <Text className="text-base font-bold" style={{ color: sectionTitleColor }}>Communication</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        {COMMUNICATION.map((item) => (
                            <TouchableOpacity key={item.id} className="flex-1 rounded-2xl p-4 items-center border relative" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                                {item.badge && (
                                    <View className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-[10px] bg-[#ef4444] justify-center items-center border-2" style={{ borderColor: isDarkMode ? '#020617' : '#ffffff' }}>
                                        <Text className="text-white text-[10px] font-bold">{item.badge}</Text>
                                    </View>
                                )}
                                <View className="w-11 h-11 rounded-[14px] justify-center items-center mb-2.5" style={{ backgroundColor: item.color }}>
                                    <Ionicons name={item.icon as any} size={24} color="white" />
                                </View>
                                <Text className="text-xs font-semibold" style={{ color: textColor }}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Vouchers */}
                    <View className="flex-row justify-between items-center mt-6 mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="gift-outline" size={20} color="#ec4899" />
                            <Text className="text-base font-bold" style={{ color: sectionTitleColor }}>Vouchers</Text>
                        </View>
                    </View>

                    <TouchableOpacity className="flex-row items-center p-4 rounded-2xl border-b border" style={{ backgroundColor: listBg, borderBottomColor: cardBorder, borderColor: cardBorder }}>
                        <View className="w-9 h-9 rounded-[10px] bg-[#ec4899] justify-center items-center mr-3">
                            <Ionicons name="gift" size={20} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold" style={{ color: textColor }}>Collected Vouchers</Text>
                            <Text className="text-[#64748b] text-xs">5 vouchers available</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                    </TouchableOpacity>

                    {/* Payments */}
                    <View className="flex-row justify-between items-center mt-6 mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="wallet-outline" size={20} color="#10b981" />
                            <Text className="text-base font-bold" style={{ color: sectionTitleColor }}>Payments</Text>
                        </View>
                    </View>

                    <View className="rounded-2xl border overflow-hidden" style={{ backgroundColor: listBg, borderColor: cardBorder }}>
                        <TouchableOpacity className="flex-row items-center p-4 border-b" style={{ backgroundColor: listBg, borderBottomColor: cardBorder }}>
                            <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3" style={{ backgroundColor: iconBg }}>
                                <Ionicons name="card-outline" size={20} color="#94a3b8" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold" style={{ color: textColor }}>Transaction History</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center p-4 border-b" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', borderBottomColor: cardBorder }}>
                            <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3" style={{ backgroundColor: iconBg }}>
                                <Ionicons name="wallet-outline" size={20} color="#94a3b8" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold" style={{ color: textColor }}>Eduprova Wallet</Text>
                            </View>
                            <View className="bg-[#064e3b] px-2 py-0.5 rounded-md mr-2">
                                <Text className="text-[#34d399] text-xs font-bold">$125.00</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center p-4 border-b-0" style={{ backgroundColor: listBg }}>
                            <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3" style={{ backgroundColor: iconBg }}>
                                <Ionicons name="gift-outline" size={20} color="#94a3b8" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold" style={{ color: textColor }}>Redeem Gift Card</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                        </TouchableOpacity>
                    </View>

                    {/* Settings & More */}
                    <View className="flex-row justify-between items-center mt-6 mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="settings-outline" size={20} color="#94a3b8" />
                            <Text className="text-base font-bold" style={{ color: sectionTitleColor }}>Settings & More</Text>
                        </View>
                    </View>

                    <View className="mb-10 rounded-2xl border overflow-hidden" style={{ backgroundColor: listBg, borderColor: cardBorder }}>
                        {SETTINGS_MENU.map((item, index) => (
                            <TouchableOpacity key={item.id} className="flex-row items-center p-4 border-b" style={{ backgroundColor: listBg, borderBottomColor: cardBorder }}>
                                <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3" style={{ backgroundColor: iconBg }}>
                                    <Ionicons name={item.icon as any} size={20} color="#94a3b8" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold" style={{ color: textColor }}>{item.title}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity className="flex-row items-center p-4 border-b-0" style={{ backgroundColor: listBg }}>
                            <View className="w-9 h-9 rounded-[10px] justify-center items-center mr-3" style={{ backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2' }}>
                                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[#ef4444] text-sm font-semibold">Sign Out</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ef4444" />
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}


