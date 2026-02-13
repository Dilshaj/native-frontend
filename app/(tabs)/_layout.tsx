import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, DeviceEventEmitter, TouchableOpacity, useWindowDimensions, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

import { HapticTab } from '@/components/haptic-tab';

function AnimatedTabIcon({ name, color, focused, size = 24 }: { name: any, color: string, focused: boolean, size?: number }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      damping: 10,
      stiffness: 100,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons size={size} name={focused ? name.replace('-outline', '') : name} color={color} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const { width: windowWidth } = useWindowDimensions();
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(systemColorScheme === 'dark');

  const [isTabBarVisible, setIsTabBarVisible] = React.useState(true); // Default Visible

  const isTablet = windowWidth >= 768;
  const tabBarWidth = isTablet ? 800 : windowWidth;
  const tabBarLeft = isTablet ? (windowWidth - 800) / 2 : 0;

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('themeChanged', (mode) => {
      setIsDarkMode(mode);
    });
    const tabBarSubscription = DeviceEventEmitter.addListener('toggleTabBar', (visible) => {
      setIsTabBarVisible(visible);
    });
    return () => {
      subscription.remove();
      tabBarSubscription.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#fff' : '#000000',
        tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#9ca3af',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: undefined, // Removed custom gradient background for solid card look
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#111827' : '#ffffff', // Solid Card Background
          borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
          height: Platform.OS === 'android' ? 108 : 90, // Increased height for Android
          paddingBottom: Platform.OS === 'android' ? 48 : 30, // Increased padding for Android system buttons
          paddingTop: 10,
          position: 'absolute',
          elevation: 10, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          width: tabBarWidth,
          left: tabBarLeft,
          marginBottom: 0,
          overflow: 'hidden', // Ensures content respects the radius but might clip shadow? No, typically fine.
          display: isTabBarVisible ? 'flex' : 'none',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            DeviceEventEmitter.emit('closeProfile');
          },
        })}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon name="home-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={({ navigation }) => ({
          title: 'Courses',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon name="book-outline" color={color} focused={focused} />,
        })}
      />
      <Tabs.Screen
        name="messages"
        options={({ navigation }) => ({
          title: 'Messages',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon name="chatbubble-outline" color={color} focused={focused} />,
        })}
      />
      <Tabs.Screen
        name="jobs"
        options={({ navigation }) => ({
          title: 'Jobs',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon name="briefcase-outline" color={color} focused={focused} />,
        })}
      />
      <Tabs.Screen
        name="more"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            navigation.navigate('index'); // Go to Home
            setTimeout(() => {
              DeviceEventEmitter.emit('toggleProfile'); // Trigger Profile Overlay
            }, 50);
          },
        })}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon name="person-outline" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
