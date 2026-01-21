import { Text, View, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Platform, Modal, Animated as RNAnimated, DeviceEventEmitter } from 'react-native';
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
  const navigation = useNavigation();
  const sidebarAnim = useRef(new RNAnimated.Value(-width * 0.8)).current; // Start off-screen

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
      toValue: isSidebarOpen ? 0 : -width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen]);

  // Sidebar Event Listener
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('toggleSidebar', () => {
      setSidebarOpen(prev => !prev);
    });
    return () => subscription.remove();
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    DeviceEventEmitter.emit('themeChanged', newMode);
  };

  // Scroll Handler
  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > 0 && currentOffset > lastContentOffset.current ? 'down' : 'up';

    if (direction === 'down' && isTabBarVisible.current) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
      isTabBarVisible.current = false;
    } else if (direction === 'up' && !isTabBarVisible.current) {
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
          height: Platform.OS === 'android' ? 110 : 90,
          paddingBottom: Platform.OS === 'android' ? 50 : 30,
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
            <View className="flex-row items-center gap-2">
              {/* Header Icon Removed as per user request */}
              <LinearGradient
                colors={['#c084fc', '#e879f9']}
                className="w-8 h-8 rounded-xl justify-center items-center"
              >
                <Ionicons name="school-outline" size={20} color="white" />
              </LinearGradient>
              <Text className={`text-xl font-[800]`} style={{ color: isDarkMode ? '#e879f9' : '#a855f7' }}>Eduprova</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={toggleTheme}>
                <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={iconColor} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="search-outline" size={24} color={iconColor} />
              </TouchableOpacity>
              <TouchableOpacity className="relative">
                <Ionicons name="notifications-outline" size={24} color={iconColor} />
                <View className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#8b5cf6] border border-white" />
              </TouchableOpacity>
              <TouchableOpacity className="relative" onPress={() => (navigation as any).navigate('profile', { isDark: String(isDarkMode) })}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }} className="w-9 h-9 rounded-[18px] bg-[#eee]" />
                <View className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-white" />
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

      {/* Sidebar Modal (Drawer) */}
      {isSidebarOpen && (
        <View className="absolute inset-0 z-[1000] flex-row">
          <TouchableOpacity className="flex-1 bg-black/50" onPress={toggleSidebar} />
          <RNAnimated.View className="w-[80%] h-full absolute left-0 top-0 bottom-0 pt-[Platform.OS === 'android' ? 30 : 50] shadow-xl elevation-5" style={{ backgroundColor: sidebarBg, transform: [{ translateX: sidebarAnim }], paddingTop: Platform.OS === 'android' ? 30 : 50 }}>
            <View className={`flex-row justify-between items-center px-5 pb-5 border-b`} style={{ borderBottomColor: isDarkMode ? '#1f1f2e' : '#f3f4f6' }}>
              <Text className="text-2xl font-bold" style={{ color: textPrimary }}>Features</Text>
              <TouchableOpacity onPress={toggleSidebar}>
                <Ionicons name="close" size={24} color={textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 pt-5">
              {MENU_ITEMS.map((item) => (
                <TouchableOpacity key={item.id} className="flex-row items-center py-4 px-5">
                  <View className={`w-10 h-10 rounded-xl justify-center items-center mr-4 ${isDarkMode ? 'bg-[#1f1f2e]' : 'bg-[#f3f4f6]'}`}>
                    <Ionicons name={item.icon as any} size={20} color={isDarkMode ? '#e879f9' : '#a855f7'} />
                  </View>
                  <Text className="text-base font-semibold" style={{ color: textPrimary }}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color={textSecondary} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View className="p-5 border-t" style={{ borderTopColor: isDarkMode ? '#1f1f2e' : '#f3f4f6' }}>
              <TouchableOpacity className="flex-row items-center gap-3">
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text className="text-base font-semibold text-[#ef4444]">Log Out</Text>
              </TouchableOpacity>
            </View>
          </RNAnimated.View>
        </View>
      )}
    </View>
  );
}


