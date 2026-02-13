import { Image } from 'expo-image';
import { Text, View, ScrollView, TouchableOpacity, useWindowDimensions, Platform, Modal, Animated as RNAnimated, DeviceEventEmitter, TextInput, Alert, StyleSheet, Easing as RNEasing, PanResponder, ViewProps, useColorScheme } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, Stack, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import FeedPost from '../../components/FeedPost'; // Import Custom FeedPost Component
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  FadeInDown,
  FadeInUp,
  FadeIn,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  Easing,
  cancelAnimation,
  runOnJS,
  interpolate,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';

// Modular Components
import FeedsView from '../../components/home/FeedsView';
import FeaturesDrawer from '../../components/home/FeaturesDrawer';
import SearchView from '../../components/home/SearchView';
import MainContent from '../../components/home/MainContent';
import ProfileView from '../../components/profile/ProfileView';
import EditProfileView from '../../components/profile/EditProfileView';
import ShareProfileView from '../../components/profile/ShareProfileView';
import SettingsView from '../../components/profile/SettingsView';
import EditBioView from '../../components/profile/EditBioView';



// Sidebar Menu Items
// Main App Component

// Mock Data


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


const TOP_SEARCHES = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Web Development', 'React Native', 'UI/UX Design'
];

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// --- Isolated Sidebar Components to prevent recursion ---



export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Sync with system theme changes
  useEffect(() => {
    const isDark = systemColorScheme === 'dark';
    setIsDarkMode(isDark);
    DeviceEventEmitter.emit('themeChanged', isDark);
  }, [systemColorScheme]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isSidebarOpenRef = useRef(false);
  const [drawerType, setDrawerType] = useState<'features' | 'profile' | 'edit-profile' | 'search' | 'feeds' | 'share-profile' | 'settings' | 'edit-bio'>('feeds');
  const navigation = useNavigation();
  const isTablet = width >= 768;
  const drawerWidth = isTablet ? 400 : width * 0.85;
  const sidebarAnim = useSharedValue(-drawerWidth); // Initialize with exact drawerWidth

  // Sync sidebarAnim if drawerWidth changes (e.g. orientation)
  useEffect(() => {
    if (!isSidebarOpenRef.current) {
      sidebarAnim.value = -drawerWidth;
    }
  }, [drawerWidth]);

  // Custom Search Transition State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchAnim = useSharedValue(width); // Reanimated Shared Value
  const mainAnim = useSharedValue(0); // Reanimated Shared Value
  const mainScale = useSharedValue(1); // Reanimated Shared Value for Depth Effect
  const [triggerFocus, setTriggerFocus] = useState(false);
  const [userBio, setUserBio] = useState('');

  // Profile Transition State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileAnim = useSharedValue(width);

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

  // Sidebar Animation Styles
  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarAnim.value }]
  }));

  const mainStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: mainAnim.value },
      { scale: mainScale.value }
    ]
  }));

  const searchStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: searchAnim.value }]
  }));

  const profileStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: profileAnim.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(mainAnim.value, [0, drawerWidth], [0, 0.10])
  }));

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!isSidebarOpenRef.current && gestureState.dx > 10 && Math.abs(gestureState.dy) < 30) return true;
        if (isSidebarOpenRef.current && gestureState.dx < -10) return true;
        return false;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        if (!isSidebarOpenRef.current && gestureState.dx > 20 && Math.abs(gestureState.dy) < 20) return true;
        if (isSidebarOpenRef.current && gestureState.dx < -10) return true;
        return false;
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isSidebarOpenRef.current) {
          const moveValue = Math.min(drawerWidth, Math.max(0, gestureState.dx));
          sidebarAnim.value = -drawerWidth + moveValue;
          mainAnim.value = moveValue;
        } else {
          const moveValue = Math.min(drawerWidth, Math.max(0, drawerWidth + gestureState.dx));
          sidebarAnim.value = -drawerWidth + moveValue;
          mainAnim.value = moveValue;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 60;
        if (!isSidebarOpenRef.current) {
          if (gestureState.dx > threshold) {
            openSidebar();
          } else {
            closeSidebar();
          }
        } else {
          if (gestureState.dx < -threshold) {
            closeSidebar();
          } else {
            openSidebar();
          }
        }
      },
    })
  ).current;

  // Sidebar Logic
  const finalizeClose = () => {
    setSidebarOpen(false);
    isSidebarOpenRef.current = false;
  };

  const openSidebar = (type?: 'features' | 'profile' | 'edit-profile' | 'search' | 'feeds' | 'share-profile' | 'settings' | 'edit-bio') => {
    if (type) setDrawerType(type);
    setSidebarOpen(true);
    isSidebarOpenRef.current = true;
    const CONFIG = { duration: 650, easing: Easing.bezier(0.4, 0, 0.2, 1) };
    sidebarAnim.value = withTiming(0, CONFIG);
    mainAnim.value = withTiming(drawerWidth, CONFIG);
  };

  const closeSidebar = () => {
    const CONFIG = { duration: 650, easing: Easing.bezier(0.4, 0, 0.2, 1) };
    sidebarAnim.value = withTiming(-drawerWidth, CONFIG, (finished) => {
      if (finished) {
        runOnJS(finalizeClose)();
      }
    });
    mainAnim.value = withTiming(0, CONFIG);
  };

  const toggleSidebar = (type?: 'features' | 'profile' | 'edit-profile' | 'search' | 'feeds' | 'share-profile') => {
    if (isSidebarOpen) {
      if (type && type !== drawerType) {
        setDrawerType(type);
      } else {
        closeSidebar();
      }
    } else {
      openSidebar(type);
    }
  };

  // Custom Search Toggle
  const toggleSearch = () => {
    const CONFIG = { duration: 650, easing: Easing.bezier(0.4, 0.0, 0.2, 1) };

    if (isSearchOpen) {
      mainAnim.value = withTiming(0, CONFIG);
      mainScale.value = withTiming(1, CONFIG);
      searchAnim.value = withTiming(width, CONFIG, () => {
        runOnJS(setIsSearchOpen)(false);
      });
    } else {
      setIsSearchOpen(true);
      mainAnim.value = withTiming(-width * 0.25, CONFIG);
      mainScale.value = withTiming(0.95, CONFIG);
      searchAnim.value = withTiming(0, CONFIG);
    }
  };

  // Custom Profile Toggle
  const toggleProfile = () => {
    const CONFIG = { duration: 650, easing: Easing.bezier(0.4, 0.0, 0.2, 1) };

    if (isProfileOpen) {
      mainAnim.value = withTiming(0, CONFIG);
      mainScale.value = withTiming(1, CONFIG);
      profileAnim.value = withTiming(width, CONFIG, () => {
        runOnJS(setIsProfileOpen)(false);
      });
    } else {
      setIsProfileOpen(true);
      mainAnim.value = withTiming(-width * 0.25, CONFIG);
      mainScale.value = withTiming(0.95, CONFIG);
      profileAnim.value = withTiming(0, CONFIG);
    }
  };

  useEffect(() => {
    const sidebarSub = DeviceEventEmitter.addListener('toggleSidebar', () => {
      toggleSidebar('features');
    });
    const profileSub = DeviceEventEmitter.addListener('toggleProfile', () => {
      toggleProfile();
    });
    const closeProfileSub = DeviceEventEmitter.addListener('closeProfile', () => {
      if (isProfileOpen) toggleProfile();
    });
    return () => {
      sidebarSub.remove();
      profileSub.remove();
      closeProfileSub.remove();
    };
  }, [isSidebarOpen, drawerType, isProfileOpen]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    DeviceEventEmitter.emit('themeChanged', newMode);
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - lastContentOffset.current;

    // Ignore bounce effects (iOS)
    if (currentOffset <= 0 || currentOffset + height >= event.nativeEvent.contentSize.height) {
      lastContentOffset.current = currentOffset;
      return;
    }

    if (diff > 20 && isTabBarVisible.current) {
      // Scroll Down -> Hide Tab Bar
      DeviceEventEmitter.emit('toggleTabBar', false);
      isTabBarVisible.current = false;
    } else if (diff < -20 && !isTabBarVisible.current) {
      // Scroll Up -> Show Tab Bar
      DeviceEventEmitter.emit('toggleTabBar', true);
      isTabBarVisible.current = true;
    }

    lastContentOffset.current = currentOffset;
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDarkMode ? '#000000' : '#ffffff' }} {...panResponder.panHandlers}>
      {/* Sidebar Modal (Drawer) - Always mounted for smoothness */}
      <View
        className="absolute left-0 top-0 bottom-0 z-[1000] shadow-2xl"
        style={{ width: drawerWidth }}
        pointerEvents={isSidebarOpen ? 'auto' : 'none'}
      >
        <Animated.View
          className="flex-1"
          {...panResponder.panHandlers}
          style={[{
            backgroundColor: isDarkMode ? '#111827' : '#ffffff',
          }, sidebarStyle]}
        >
          <SafeAreaView className="flex-1">
            {drawerType === 'features' ? (
              <FeaturesDrawer
                isDarkMode={isDarkMode}
                onHide={closeSidebar}
                menuItems={[
                  { id: '1', title: 'AI Resume Builder', icon: 'document-text-outline', color: '#3b82f6' },
                  { id: '2', title: 'AI Mock Interview', icon: 'mic-outline', color: '#a855f7' },
                  { id: '3', title: 'AI Grammar', icon: 'text-outline', color: '#ec4899' },
                  { id: '4', title: 'Freelancing', icon: 'briefcase-outline', color: '#f59e0b' },
                  { id: '5', title: 'Fund Raising', icon: 'cash-outline', color: '#10b981' },
                  { id: '6', title: 'Connect with mentors', icon: 'people-outline', color: '#6366f1' },
                  { id: '7', title: 'Notifications', icon: 'notifications-outline', color: '#64748b' },
                ]}
              />
            ) : drawerType === 'search' ? (
              <SearchView
                isDarkMode={isDarkMode}
                onHide={closeSidebar}
                shouldFocus={false}
              />
            ) : (
              <FeedsView
                isDarkMode={isDarkMode}
                onHide={closeSidebar}
              />
            )}
          </SafeAreaView>
        </Animated.View>
      </View>

      {/* Main Content with Parallax Push Animation */}
      <Animated.View className="flex-1 overflow-hidden" style={[mainStyle, { width: width }]}>
        <View className={`flex-1 ${isDarkMode ? '' : 'bg-white'}`}>
          {isDarkMode && (
            <LinearGradient
              colors={['#4a044e', '#2e1065', '#172554', '#000000']}
              locations={[0, 0.3, 0.6, 1]}
              className="absolute inset-0"
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.3 }}
            />
          )}
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />

          {/* Clickable Overlay to Dim when Sidebar Open */}
          <Animated.View
            className="absolute inset-0 z-[999]"
            style={[{ backgroundColor: '#000' }, overlayStyle]}
            pointerEvents={isSidebarOpen ? 'auto' : 'none'}
          >
            <TouchableOpacity
              activeOpacity={1}
              className="flex-1"
              onPress={closeSidebar}
            />
          </Animated.View>

          <SafeAreaView className="flex-1">
            <MainContent
              headerBg={headerBg}
              iconColor={iconColor}
              handleScroll={handleScroll}
              toggleTheme={toggleTheme}
              toggleSidebar={toggleSidebar}
              onSearch={toggleSearch}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              cardBg={cardBg}
              cardBorder={cardBorder}
              isDarkMode={isDarkMode}
              navigation={navigation}
              mainAnim={mainAnim}
              drawerWidth={drawerWidth}
            />
          </SafeAreaView>
        </View>
      </Animated.View>

      {/* Dedicated Search Overlay */}
      {isSearchOpen && (
        <Animated.View
          className="absolute inset-0 z-[2000]"
          style={searchStyle}
        >
          <SearchView isDarkMode={isDarkMode} onHide={toggleSearch} shouldFocus={triggerFocus} />
        </Animated.View>
      )}

      {/* Dedicated Profile Overlay */}
      {/* Optimized: Always mounted to prevent lag */}
      <Animated.View
        className="absolute inset-0 z-[2100]"
        style={profileStyle}
        pointerEvents={isProfileOpen ? 'auto' : 'none'}
      >
        <View className="flex-1 bg-white">
          <ProfileView
            isDarkMode={isDarkMode}
            onEditProfile={() => setDrawerType('edit-profile')}
            onShareProfile={() => setDrawerType('share-profile')}
            onSettings={() => setDrawerType('settings')}
          />

          {drawerType === 'share-profile' && (
            <View className="absolute inset-0 z-[2200]">
              <ShareProfileView
                isDarkMode={isDarkMode}
                onClose={() => setDrawerType('profile')}
              />
            </View>
          )}

          {drawerType === 'settings' && (
            <View className="absolute inset-0 z-[2400]">
              <SettingsView
                isDarkMode={isDarkMode}
                onBack={() => setDrawerType('profile')}
              />
            </View>
          )}
        </View>
      </Animated.View>

      {/* Dedicated Edit Profile Overlay (Slides from bottom) */}
      {isProfileOpen && drawerType === 'edit-profile' && (
        <Animated.View
          entering={SlideInDown.duration(400).easing(Easing.bezier(0.33, 1, 0.68, 1))}
          exiting={SlideOutDown.duration(300)}
          className="absolute inset-0 z-[2300]"
        >
          <View className="flex-1 bg-white">
            <EditProfileView
              isDarkMode={isDarkMode}
              onBack={() => setDrawerType('profile')}
              onOpenEditBio={() => setDrawerType('edit-bio')}
              currentBio={userBio}
            />
          </View>
        </Animated.View>
      )}

      {/* Dedicated Edit Bio Overlay (Slides from bottom) */}
      {isProfileOpen && drawerType === 'edit-bio' && (
        <Animated.View
          entering={SlideInDown.duration(400).easing(Easing.bezier(0.33, 1, 0.68, 1))}
          exiting={SlideOutDown.duration(300)}
          className="absolute inset-0 z-[2400]"
        >
          <View className="flex-1 bg-white">
            <EditBioView
              isDarkMode={isDarkMode}
              onClose={() => setDrawerType('edit-profile')}
              initialBio={userBio}
              onSave={(newBio: string) => {
                setUserBio(newBio);
                setDrawerType('edit-profile');
              }}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}


