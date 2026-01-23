import { Text, View, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Platform, Modal, Animated as RNAnimated, DeviceEventEmitter, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Sidebar Menu Items
const MENU_ITEMS = [
  { id: '1', title: 'AI Resume Builder', icon: 'document-text-outline' },
  { id: '2', title: 'AI Mock Interview', icon: 'mic-outline' },
  { id: '3', title: 'AI Grammar', icon: 'text-outline' },
  { id: '4', title: 'Freelancing', icon: 'briefcase-outline' },
  { id: '5', title: 'Fund Raising', icon: 'cash-outline' },
  { id: '6', title: 'Connect with mentors', icon: 'people-outline' },
  { id: '7', title: 'Notifications', icon: 'notifications-outline' }, // Added at bottom
];

// Mock Data
const STORIES = [
  { id: '1', name: 'Sarah K.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', seen: false },
  { id: '2', name: 'Alex M.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', seen: false },
  { id: '3', name: 'Emma L.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', seen: true },
  { id: '4', name: 'James P.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', seen: true },
  { id: '5', name: 'Zoe R.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', seen: false },
];

const POSTS = [
  {
    id: '1',
    user: 'James Wilson',
    role: 'AI Research Lead @OpenAI',
    time: '2h ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    aiBadge: true,
    content: "Just released our latest paper on transformer architectures. The implications for real-time AI processing are incredible. Check out the full research!",
    tags: ['#AIResearch', '#Transformers', '#DeepLearning'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: '2,847',
    comments: 234,
    shares: 189,
    isAiGenerated: true,
  },
  {
    id: '2',
    user: 'Elena Rodriguez',
    role: 'ML Engineer @Google DeepMind',
    time: '4h ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    aiBadge: false,
    content: "Building the future of autonomous systems. Our latest breakthrough in reinforcement learning is pushing boundaries we never thought possible.",
    tags: ['#MachineLearning', '#Robotics', '#Innovation'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: '1,532',
    comments: 142,
    shares: 84,
    isAiGenerated: false,
  },
  {
    id: '3',
    user: 'David Chen',
    role: 'Product Designer @Figma',
    time: '6h ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    aiBadge: false,
    content: "Exploring the intersection of AI and Design Systems. How can we leverage generative models to speed up our workflow without losing creativity? 🎨✨",
    tags: ['#DesignSystems', '#GenerativeAI', '#UX'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: '3,102',
    comments: 412,
    shares: 204,
    isAiGenerated: true,
  },
  {
    id: '4',
    user: 'Sarah Miller',
    role: 'Tech Lead @Anthropic',
    time: '8h ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    aiBadge: true,
    content: "The alignment problem is more critical than ever. We need to ensure these powerful systems act in accordance with human values. #AIAlignment",
    tags: ['#SafetyFirst', '#EthicalAI'],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: '9,230',
    comments: 891,
    shares: 1.256,
    isAiGenerated: false,
  }
];

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// --- Isolated Sidebar Components to prevent recursion ---

function FeaturesView({ isDarkMode, onHide, menuItems }: { isDarkMode: boolean, onHide: () => void, menuItems: any[] }) {
  return (
    <View className="flex-1">
      <View className="flex-row items-center px-4 py-4 border-b border-gray-100 bg-white">
        <TouchableOpacity onPress={onHide} className="w-10 h-10 items-center justify-center rounded-full border border-gray-100 mr-4">
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">App Features</Text>
      </View>
      <ScrollView className="flex-1 pt-4 bg-white" showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} className="flex-row items-center py-4 px-6 border-b border-gray-50">
            <View className={`w-10 h-10 rounded-xl justify-center items-center mr-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Ionicons name={item.icon as any} size={20} color={isDarkMode ? '#e879f9' : '#a855f7'} />
            </View>
            <Text className="text-base font-semibold text-gray-800 flex-1">{item.title}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function SettingsView({ isDarkMode, onHide, onEditProfile }: { isDarkMode: boolean, onHide: () => void, onEditProfile: () => void }) {
  const iconBgColor = isDarkMode ? 'rgba(168, 85, 247, 0.15)' : '#f3f0ff';
  const iconColor = '#a855f7';

  return (
    <View className="flex-1">
      {/* Modern Settings Header */}
      <View
        className={`flex-row items-center px-4 pb-4 bg-white border-b border-gray-100 ${Platform.OS === 'android' ? 'pt-14' : 'pt-12'}`}
      >
        <TouchableOpacity
          onPress={onHide}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 mr-4"
        >
          <Ionicons name="chevron-back" size={22} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-gray-900 tracking-tight">Settings</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Quick Profile Card */}
        <View className="px-6 py-8 flex-row items-center gap-5 bg-white mb-2">
          <View className="relative">
            <LinearGradient
              colors={['#a855f7', '#3b82f6']}
              className="w-18 h-18 rounded-3xl items-center justify-center"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="person" size={32} color="white" />
            </LinearGradient>
            <TouchableOpacity
              onPress={onEditProfile}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full items-center justify-center shadow-md border-2 border-white"
            >
              <Ionicons name="camera" size={14} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 leading-tight">V. Narasimha</Text>
            <View className="flex-row items-center mt-1">
              <View className="bg-emerald-100 px-2 py-0.5 rounded-full mr-2">
                <Text className="text-emerald-700 text-[10px] font-bold">ACTIVE STUDENT</Text>
              </View>
              <Text className="text-gray-500 text-sm">79958 53246</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onEditProfile} className="bg-gray-100 p-2 rounded-xl">
            <Ionicons name="settings-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Premium Dashboard Cards - Eduprova Specific */}
        <View className="flex-row justify-between px-4 py-4 bg-white gap-3 mb-6">
          {[
            { title: 'My Courses', icon: 'book', color: '#3b82f6', sub: '12 Active' },
            { title: 'AI Tools', icon: 'sparkles', color: '#a855f7', sub: 'Pro Access' },
            { title: 'Certificates', icon: 'trophy', color: '#f59e0b', sub: '4 Earned' }
          ].map((item, i) => (
            <TouchableOpacity key={i} className="flex-1 h-[110px] bg-white border border-gray-100 rounded-3xl items-center justify-center shadow-sm p-3">
              <View className="w-10 h-10 rounded-2xl items-center justify-center mb-2" style={{ backgroundColor: `${item.color}15` }}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text className="text-[12px] font-bold text-gray-800 text-center">{item.title}</Text>
              <Text className="text-[9px] text-gray-400 mt-0.5">{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Learning & Career Section */}
        <View className="mb-8">
          <Text className="px-6 mb-4 text-[12px] font-black text-indigo-500 uppercase tracking-[2px]">Learning & Career</Text>
          <View className="bg-white rounded-[40px] mx-4 overflow-hidden border border-gray-100 shadow-sm">
            {[
              { icon: 'document-text-outline', title: 'AI Resume Builder', badge: 'New' },
              { icon: 'mic-outline', title: 'AI Mock Interviews' },
              { icon: 'school-outline', title: 'Mentor Collaborations' },
              { icon: 'briefcase-outline', title: 'Job Opportunities', sub: '15 matches' },
              { icon: 'flash-outline', title: 'Freelance Hub' },
              { icon: 'rocket-outline', title: 'Fund Raising' },
            ].map((item, index, arr) => (
              <TouchableOpacity key={index} className={`flex-row items-center px-6 py-5 ${index !== arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <View className="w-10 h-10 rounded-2xl bg-gray-50 items-center justify-center mr-4">
                  <Ionicons name={item.icon as any} size={20} color="#4b5563" />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-bold text-gray-800">{item.title}</Text>
                  {item.sub && <Text className="text-[11px] text-gray-400 mt-1">{item.sub}</Text>}
                </View>
                {item.badge && (
                  <View className="bg-indigo-500 px-2 py-0.5 rounded-full mr-2">
                    <Text className="text-white text-[10px] font-bold">{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Networking & Comm Section */}
        <View className="mb-8">
          <Text className="px-6 mb-4 text-[12px] font-black text-indigo-500 uppercase tracking-[2px]">Communications</Text>
          <View className="bg-white rounded-[40px] mx-4 overflow-hidden border border-gray-100 shadow-sm">
            {[
              { icon: 'chatbubbles-outline', title: 'Messaging Portal', sub: 'Direct chats' },
              { icon: 'videocam-outline', title: 'Video Sessions', sub: 'Live learning' },
              { icon: 'people-outline', title: 'Social Feed Hub', sub: 'My posts & interaction' },
            ].map((item, index, arr) => (
              <TouchableOpacity key={index} className={`flex-row items-center px-6 py-5 ${index !== arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <View className="w-10 h-10 rounded-2xl bg-gray-50 items-center justify-center mr-4">
                  <Ionicons name={item.icon as any} size={20} color="#4b5563" />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-bold text-gray-800">{item.title}</Text>
                  {item.sub && <Text className="text-[11px] text-gray-400 mt-1">{item.sub}</Text>}
                </View>
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* System & Support */}
        <View className="mb-6">
          <Text className="px-6 mb-4 text-[12px] font-black text-gray-400 uppercase tracking-[2px]">System</Text>
          <View className="bg-white rounded-[40px] mx-4 overflow-hidden border border-gray-100 shadow-sm">
            {[
              { icon: 'notifications-outline', title: 'Notifications' },
              { icon: 'lock-closed-outline', title: 'Privacy & Security' },
              { icon: 'help-circle-outline', title: 'Support Center' },
            ].map((item, index, arr) => (
              <TouchableOpacity key={index} className={`flex-row items-center px-6 py-5 ${index !== arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <Ionicons name={item.icon as any} size={22} color="#9ca3af" className="mr-5" />
                <Text className="text-[15px] font-semibold text-gray-700 flex-1">{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color="#e5e7eb" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout - Unique Model UI */}
        <View className="px-6 mb-4">
          <TouchableOpacity
            className="w-full h-16 rounded-3xl bg-rose-50 flex-row items-center justify-center border border-rose-100"
            onPress={() => console.log('Logout')}
          >
            <View className="w-8 h-8 rounded-full bg-rose-100 items-center justify-center mr-3">
              <Ionicons name="log-out" size={18} color="#e11d48" />
            </View>
            <Text className="text-lg font-bold text-rose-600">Sign Out</Text>
          </TouchableOpacity>
          <Text className="mt-8 text-gray-300 text-[10px] text-center mb-10 font-bold uppercase tracking-widest">Eduprova v1.0.4.premium</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function EditProfileView({ isDarkMode, onBack }: { isDarkMode: boolean, onBack: () => void }) {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 pt-8 bg-white">
        <TouchableOpacity onPress={onBack} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="w-36 h-36 rounded-full bg-gray-50 border-4 border-white shadow-xl items-center justify-center">
              <Ionicons name="person" size={80} color="#e5e7eb" />
            </View>
            <TouchableOpacity className="absolute bottom-1 right-2 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg border border-gray-100">
              <Ionicons name="pencil" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5">
          {/* Basic Info Card */}
          <View className="bg-white rounded-[32px] p-7 border border-gray-100 shadow-sm mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-8">Basic information</Text>

            {[
              { label: 'Name', placeholder: 'Enter your name' },
              { label: 'Phone number', value: '+91 7995853246', sub: 'The phone number associated with your account cannot be modified' },
              { label: 'Email', placeholder: 'Enter your email' },
              { label: 'Gender', placeholder: 'Select', isPicker: true },
              { label: 'Birthday', placeholder: 'DD / MM / YY' },
              { label: 'Anniversary', placeholder: 'DD / MM / YY' },
            ].map((field, i) => (
              <View key={i} className="mb-6">
                <Text className="text-[13px] font-bold text-gray-500 mb-2.5 ml-1">{field.label}</Text>
                {field.isPicker || field.value ? (
                  <View className="bg-white border border-gray-100 rounded-2xl h-15 px-5 flex-row items-center justify-between shadow-sm">
                    <Text className={`text-[16px] font-medium ${field.value ? 'text-gray-900' : 'text-gray-300'}`}>{field.value || field.placeholder}</Text>
                    {field.isPicker && <Ionicons name="chevron-down" size={18} color="#ccc" />}
                  </View>
                ) : (
                  <TextInput
                    placeholder={field.placeholder}
                    className="bg-white border border-gray-100 rounded-2xl h-15 px-5 text-gray-900 shadow-sm"
                    placeholderTextColor="#d1d5db"
                    style={{ fontSize: 16, fontWeight: '500' }}
                  />
                )}
                {field.sub && (
                  <View className="flex-row items-start mt-2.5 ml-1 pr-4">
                    <Ionicons name="information-circle-outline" size={16} color="#9ca3af" className="mr-2 mt-0.5" />
                    <Text className="text-[12px] text-gray-400 leading-tight flex-1">{field.sub}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Invoice Info Card */}
          <View className="bg-white rounded-[32px] p-7 border border-gray-100 shadow-sm mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-8">Invoice details</Text>
            <View className="mb-2">
              <Text className="text-[13px] font-bold text-gray-500 mb-2.5 ml-1">State</Text>
              <TouchableOpacity className="bg-white border border-gray-100 rounded-2xl h-15 px-5 flex-row items-center justify-between shadow-sm">
                <Text className="text-gray-300 text-[16px] font-medium">Select a billing state</Text>
                <Ionicons name="chevron-down" size={18} color="#ccc" />
              </TouchableOpacity>
              <Text className="text-[11px] text-gray-400 mt-2.5 ml-1 italic">This is required to generate invoice</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Button fixed at bottom above scroll */}
      <View className="absolute bottom-0 left-0 right-0 bg-white/95 px-6 py-5 border-t border-gray-50 shadow-lg">
        <TouchableOpacity className="w-full h-15 bg-gray-200 rounded-2xl items-center justify-center">
          <Text className="text-base font-bold text-gray-400 uppercase tracking-widest">Update profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StoryItem({ story, isDarkMode }: { story: any, isDarkMode: boolean }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (!story.seen) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 4000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [story.seen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <TouchableOpacity className="mr-3 w-[90px] h-[120px]">
      <View className={`flex-1 rounded-[18px] overflow-hidden relative p-1 justify-center items-center border ${isDarkMode ? 'border-[#1f1f2e]' : 'border-white'}`}>
        {!story.seen ? (
          <AnimatedLinearGradient
            colors={['#3b82f6', '#d946ef', '#ec4899', '#3b82f6']}
            className="absolute w-[200px] h-[200px] -top-10 -left-[55px]"
            style={animatedStyle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ) : (
          <View className={`absolute w-full h-full ${isDarkMode ? 'bg-[#374151]' : 'bg-[#e5e7eb]'}`} />
        )}

        <View className={`w-[86px] h-[116px] rounded-2xl overflow-hidden relative ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
          <Image source={{ uri: story.image }} className="w-full h-full" />
          <View className="absolute bottom-0 left-0 right-0 p-2 pt-5">
            <Text className="text-white text-[11px] font-bold shadow-black" style={{ textShadowRadius: 10, textShadowOffset: { width: -1, height: 1 } }}>{story.name}</Text>
          </View>

          {story.seen && (
            <View className="absolute top-1.5 right-1.5 bg-[#22c55e] w-4 h-4 rounded-full justify-center items-center border-[1.5px] border-white">
              <Ionicons name="checkmark-sharp" size={10} color="white" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'features' | 'settings' | 'edit-profile'>('settings');
  const navigation = useNavigation();
  const sidebarAnim = useRef(new RNAnimated.Value(width)).current; // Start off-screen - Full Width

  // Scroll Tracking for Tab Bar
  const lastContentOffset = useRef(0);
  const isTabBarVisible = useRef(true);

  // Dynamic Styles
  const textPrimary = isDarkMode ? '#f3f4f6' : '#111827';
  const textSecondary = isDarkMode ? '#9ca3af' : '#6b7280';
  const cardBg = isDarkMode ? 'rgba(30, 30, 40, 0.6)' : '#fff';
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6';
  const headerBg = isDarkMode ? 'transparent' : '#fff';
  const iconColor = isDarkMode ? '#fff' : '#374151';
  const sidebarBg = isDarkMode ? '#111827' : '#fff';


  // Sidebar Animation
  useEffect(() => {
    RNAnimated.timing(sidebarAnim, {
      toValue: isSidebarOpen ? 0 : width, // Slide from right (width) to 0
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  // Sidebar Event Listener
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('toggleSidebar', () => {
      setDrawerType('features');
      setSidebarOpen(true);
    });
    return () => subscription.remove();
  }, []); // Only register once

  const toggleSidebar = (type?: 'features' | 'settings' | 'edit-profile') => {
    if (type) setDrawerType(type);
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    DeviceEventEmitter.emit('themeChanged', newMode);
  };

  // Scroll Handler with debounce or threshold
  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const isScrollingDown = currentOffset > 0 && currentOffset > lastContentOffset.current;

    if (isScrollingDown && isTabBarVisible.current && currentOffset > 50) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
      isTabBarVisible.current = false;
    } else if (!isScrollingDown && !isTabBarVisible.current) {
      navigation.setOptions({
        tabBarStyle: {
          display: 'flex',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: isDarkMode ? 'transparent' : '#ffffff',
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 85 : 70,
          paddingBottom: Platform.OS === 'android' ? 25 : 10,
        }
      });
      isTabBarVisible.current = true;
    }
    lastContentOffset.current = currentOffset;
  };

  const ContentContainer = (isDarkMode ? LinearGradient : View) as any;

  // Custom Dark Mode Gradient: Deep Purple/Pink Top -> Black Middle
  const containerProps = isDarkMode
    ? {
      colors: ['#4a044e', '#2e1065', '#172554', '#000000'], // Deep Fuchsia -> Deep Violet -> Deep Blue -> Black
      locations: [0, 0.3, 0.6, 1],
      className: "flex-1 bg-white",
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0.3 } // 30% Height
    }
    : { className: "flex-1 bg-white" };

  return (
    <View className="flex-1">
      <ContentContainer {...containerProps}>
        {isDarkMode && <StatusBar style="light" />}
        {!isDarkMode && <StatusBar style="dark" />}

        <SafeAreaView className="flex-1">
          <View className={`flex-row justify-between items-center px-4 py-3 border-b ${Platform.OS === 'android' ? 'mt-[30px]' : ''}`} style={{ backgroundColor: headerBg, borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}>
            <View className="flex-row items-center gap-1.5">
              <Image
                source={require('../../assets/images/Eduprova logo (2).png')}
                style={{ width: 14, height: 14 }}
                contentFit="contain"
              />
              <Image
                source={require('../../assets/images/eduprova_logo copy.png')}
                style={{ width: 70, height: 18, marginTop: 2 }}
                contentFit="contain"
              />
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={toggleTheme}>
                <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={iconColor} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="search-outline" size={24} color={iconColor} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleSidebar('settings')}
                className={`w-10 h-10 rounded-xl justify-center items-center shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'}`}
              >
                <Ionicons name="person" size={20} color={isDarkMode ? '#e879f9' : '#a855f7'} />
              </TouchableOpacity>
              <TouchableOpacity className="relative" onPress={() => (navigation as any).navigate('profile', { isDark: String(isDarkMode) })}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }} className="w-9 h-9 rounded-[18px] bg-[#eee]" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16} // smooth scrolling
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >

            <View className={`mx-4 h-[180px] rounded-[20px] overflow-hidden mb-6 ${isDarkMode ? 'bg-[#1f1f2e]' : 'bg-[#f1f5f9]'}`}>
              <Video
                className="w-full h-full"
                source={require('@/assets/images/video.mp4')}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted
              />
            </View>

            <View className="mb-6">
              <View className="flex-row justify-between items-center px-4 mb-4">
                <View className="flex-row items-center gap-2">
                  <View className="w-1 h-5 bg-[#3b82f6] rounded-sm" />
                  <Text className="text-lg font-bold" style={{ color: textPrimary }}>AI Stories</Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-[#0ea5e9] font-semibold text-sm">See All <Ionicons name="chevron-forward" size={12} /></Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4" contentContainerStyle={{ paddingRight: 16, paddingTop: 12 }}>
                <TouchableOpacity className={`w-[90px] h-[120px] rounded-2xl border border-dashed justify-center items-center mr-3 relative`} style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}>
                  <View className="items-center gap-2">
                    <LinearGradient
                      colors={['#3b82f6', '#8b5cf6']}
                      className="w-12 h-12 rounded-full justify-center items-center"
                    >
                      <Ionicons name="add" size={24} color="white" />
                    </LinearGradient>
                    <Text className="text-xs font-semibold" style={{ color: textSecondary }}>Create</Text>
                  </View>
                  <View className="absolute -top-2 -right-2 bg-[#3b82f6] px-2 py-0.5 rounded-[10px]">
                    <Text className="text-white text-[10px] font-bold">New</Text>
                  </View>
                </TouchableOpacity>

                {STORIES.map((story) => (
                  <StoryItem key={story.id} story={story} isDarkMode={isDarkMode} />
                ))}
              </ScrollView>
            </View>

            <View className="pb-5">
              <View className="flex-row justify-between items-center px-4 mb-4">
                <View className="flex-row items-center gap-2">
                  <View className="w-1 h-5 rounded-sm bg-[#d946ef]" />
                  <Text className="text-lg font-bold" style={{ color: textPrimary }}>Your Feed</Text>
                </View>
                <View className={`flex-row p-0.5 rounded-lg ${isDarkMode ? 'bg-[#1f1f2e]' : 'bg-[#f3f4f6]'}`}>
                  <TouchableOpacity className={`px-3 py-1.5 rounded-md ${isDarkMode ? 'bg-[#0f766e]' : 'bg-[#ccfbf1]'}`}>
                    <Text className={`text-xs font-semibold ${isDarkMode ? 'text-[#ccfbf1]' : 'text-[#0f766e]'}`}>Latest</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="px-3 py-1.5 rounded-md">
                    <Text className="text-xs font-semibold" style={{ color: textSecondary }}>Trending</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="px-4 gap-5">
                {POSTS.map((post) => (
                  <View key={post.id} className="rounded-2xl border p-4 shadow-sm elevation-2" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                    <View className="flex-row mb-3">
                      <Image source={{ uri: post.avatar }} className="w-11 h-11 rounded-full mr-3" />
                      <View className="flex-1 justify-center">
                        <View className="flex-row items-center gap-1.5">
                          <Text className="text-[15px] font-bold" style={{ color: textPrimary }}>{post.user}</Text>
                          {post.aiBadge && (
                            <View className={`px-1 rounded ${isDarkMode ? 'bg-[#0c4a6e]' : 'bg-[#bae6fd]'}`}>
                              <Text className={`text-[9px] font-[800] ${isDarkMode ? 'text-[#7dd3fc]' : 'text-[#0284c7]'}`}>AI</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-xs mt-0.5" style={{ color: textSecondary }}>{post.role}</Text>
                      </View>
                      <View className="flex-row items-start gap-2">
                        <Text className="text-xs mt-0.5" style={{ color: textSecondary }}>{post.time}</Text>
                        <TouchableOpacity>
                          <Ionicons name="ellipsis-horizontal" size={20} color={textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text className="text-sm leading-[22px] mb-3" style={{ color: isDarkMode ? '#e5e7eb' : '#374151' }}>{post.content}</Text>

                    <View className="flex-row flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <View key={index} className={`px-2.5 py-1 rounded-md ${isDarkMode ? 'bg-white/10' : 'bg-[#f3f4f6]'}`}>
                          <Text className={`text-xs font-semibold ${isDarkMode ? 'text-[#d1d5db]' : 'text-[#4b5563]'}`}>{tag}</Text>
                        </View>
                      ))}
                    </View>

                    <View className={`w-full h-[220px] rounded-xl overflow-hidden mb-4 relative ${isDarkMode ? 'bg-[#1f1f2e]' : 'bg-[#f3f4f6]'}`}>
                      <Image source={{ uri: post.image }} className="w-full h-full" contentFit="cover" />
                      {post.isAiGenerated && (
                        <View className={`absolute top-3 left-3 flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg ${isDarkMode ? 'bg-black/70' : 'bg-white/90'}`}>
                          <Ionicons name="sparkles" size={12} color="#0ea5e9" />
                          <Text className={`text-[11px] font-bold ${isDarkMode ? 'text-[#bae6fd]' : 'text-[#0284c7]'}`}>AI Generated</Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-row items-center gap-5">
                      <TouchableOpacity className="flex-row items-center gap-1.5">
                        <Ionicons name="heart-outline" size={24} color={textSecondary} />
                        <Text className="text-[13px] font-semibold" style={{ color: textSecondary }}>{post.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row items-center gap-1.5">
                        <Ionicons name="chatbubble-outline" size={24} color={textSecondary} />
                        <Text className="text-[13px] font-semibold" style={{ color: textSecondary }}>{post.comments}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row items-center gap-1.5">
                        <Ionicons name="share-social-outline" size={24} color={textSecondary} />
                        <Text className="text-[13px] font-semibold" style={{ color: textSecondary }}>{post.shares}</Text>
                      </TouchableOpacity>
                      <View className="flex-1" />
                      <TouchableOpacity>
                        <Ionicons name="bookmark-outline" size={24} color={textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </ContentContainer>

      {/* Sidebar Modal (Drawer) - Using isolated components to fix recursion */}
      {isSidebarOpen && (
        <View className="absolute inset-0 z-[1000] flex-row">
          <TouchableOpacity className="absolute inset-0 bg-black/5" onPress={() => setSidebarOpen(false)} />
          <RNAnimated.View
            className="w-full h-full absolute right-0 top-0 bottom-0 shadow-xl"
            style={{
              backgroundColor: isDarkMode ? '#111827' : '#f8f9fa',
              transform: [{ translateX: sidebarAnim }]
            }}
          >
            <SafeAreaView className="flex-1">
              {drawerType === 'features' ? (
                <FeaturesView
                  isDarkMode={isDarkMode}
                  onHide={() => setSidebarOpen(false)}
                  menuItems={MENU_ITEMS}
                />
              ) : drawerType === 'settings' ? (
                <SettingsView
                  isDarkMode={isDarkMode}
                  onHide={() => setSidebarOpen(false)}
                  onEditProfile={() => setDrawerType('edit-profile')}
                />
              ) : (
                <EditProfileView
                  isDarkMode={isDarkMode}
                  onBack={() => setDrawerType('settings')}
                />
              )}
            </SafeAreaView>
          </RNAnimated.View>
        </View>
      )}
    </View>
  );
}


