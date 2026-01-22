import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('themeChanged', (mode) => {
      setIsDarkMode(mode);
    });
    return () => subscription.remove();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#fff' : '#000000',
        tabBarInactiveTintColor: isDarkMode ? '#9ca3af' : '#9ca3af',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          isDarkMode ? (
            <LinearGradient
              colors={['rgba(31, 41, 55, 0.9)', '#000000']} // Dark Gray -> Black (Footer Gradient)
              className="absolute inset-0"
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          ) : (
            <View className="absolute inset-0 bg-white" />
          )
        ),
        tabBarStyle: {
          backgroundColor: isDarkMode ? 'transparent' : '#ffffff',
          borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
          height: Platform.OS === 'android' ? 70 : 70,
          paddingBottom: Platform.OS === 'android' ? 10 : 10,
          paddingTop: 10,
          position: 'absolute', // Needed for gradient background to show if transparent
          elevation: 0, // Remove shadow
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
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
          tabBarIcon: ({ color }) => <Ionicons size={24} name="book-outline" color={color} />,
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
          tabBarIcon: ({ color }) => <Ionicons size={24} name="chatbubble-outline" color={color} />,
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
          tabBarIcon: ({ color }) => <Ionicons size={24} name="briefcase-outline" color={color} />,
        })}
      />
      <Tabs.Screen
        name="more"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            navigation.navigate('index'); // Go to Home
            setTimeout(() => {
              DeviceEventEmitter.emit('toggleSidebar'); // Open Sidebar
            }, 100);
          },
        })}
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="reorder-three-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
