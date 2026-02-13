import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withRepeat,
    Easing,
    cancelAnimation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedProps,
    runOnJS,
    withSpring,
    Extrapolation,
    SharedValue,
    useAnimatedReaction
} from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, Audio } from 'expo-av';
import FeedPost from '../FeedPost';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Gesture, GestureDetector, Directions, GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomRefreshControl } from '../CustomRefreshControl';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Mock Data
const STORY_USERS = [
    { id: '1', name: 'Sarah K.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80', seen: false },
    { id: '2', name: 'v.narashimha logisa', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80', seen: true },
    { id: '3', name: 'Emma L.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80', seen: false },
    { id: '4', name: 'James P.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', seen: true },
    { id: '5', name: 'Zoe R.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80', seen: false },
    { id: '6', name: 'Mike T.', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&q=80', seen: true },
    { id: '7', name: 'Rachel G.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', seen: false },
    { id: '8', name: 'Chris H.', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80', seen: true },
    { id: '9', name: 'Maya J.', image: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=100&q=80', seen: false },
    { id: '10', name: 'Liam N.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', seen: true },
    { id: '11', name: 'Sophia W.', image: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=100&q=80', seen: false },
    { id: '12', name: 'Daniel S.', image: 'https://images.unsplash.com/photo-1503023345030-cf7bc2da60dc?w=100&q=80', seen: false },
];

export const STORIES = STORY_USERS.map(user => ({
    ...user,
    items: [
        {
            id: `${user.id}-1`,
            uri: require('../../assets/images/video.mp4'),
            type: 'video',
            seen: user.seen
        },
        {
            id: `${user.id}-2`,
            uri: require('../../assets/Python Operators Intro.mp4'),
            type: 'video',
            seen: user.seen
        }
    ]
}));

export const POSTS = [
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
    },
    {
        id: '5',
        user: 'Robert Fox',
        role: 'Full Stack Dev @Meta',
        time: '12h ago',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
        isVerified: true,
        aiBadge: false,
        content: "React Native is evolving so fast. The new architecture is a game changer for performance. What are your thoughts on the Fabric renderer?",
        tags: ['#ReactNative', '#MobileDev', '#JavaScript'],
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
        likes: '1,204',
        comments: 85,
        shares: 42,
        isAiGenerated: false,
    },
    {
        id: '6',
        user: 'Jenny Wilson',
        role: 'Content Creator',
        time: '1d ago',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
        isVerified: true,
        aiBadge: false,
        content: "Just finished a new tutorial on advanced CSS animations. It's amazing how much you can achieve with just vanilla CSS and keyframes! 🎬✨",
        tags: ['#WebDesign', '#CSS', '#CreativeCoding'],
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        likes: '4,567',
        comments: 156,
        shares: 231,
        isAiGenerated: false,
    },
    {
        id: '7',
        user: 'Arlene McCoy',
        role: 'CTO @FastTech',
        time: '1d ago',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        isVerified: true,
        aiBadge: true,
        content: "Scaling infrastructure is always a challenge. We've just moved to a serverless architecture and the cost savings are incredible.",
        tags: ['#CloudComputing', '#Serverless', '#TechStack'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        likes: '892',
        comments: 64,
        shares: 15,
        isAiGenerated: true,
    },
    {
        id: '8',
        user: 'Kristin Watson',
        role: 'UI/UX Lead @Airbnb',
        time: '2d ago',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
        isVerified: true,
        aiBadge: false,
        content: "Good design is invisible. We should focus more on user psychology and less on just making things look pretty. #DesignThinking",
        tags: ['#UXDesign', '#UserExperience', '#Design'],
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
        likes: '10.5k',
        comments: 1200,
        shares: 450,
        isAiGenerated: false,
    }
];

export const TOPICS = [
    { id: '1', title: 'Artificial Intelligence', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80', count: '12k Posts', author: 'Randy Rangers', role: 'UIUX Designer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
    { id: '2', title: 'Product Design', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80', count: '8.5k Posts', author: 'Sarah Kline', role: 'Product Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { id: '3', title: 'Machine Learning', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&q=80', count: '9.2k Posts', author: 'James Wilson', role: 'AI Researcher', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' },
    { id: '4', title: 'UX Research', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80', count: '5.1k Posts', author: 'Emily Chen', role: 'User Researcher', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80' },
    { id: '5', title: 'Web Development', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80', count: '15k Posts', author: 'Michael Brown', role: 'Frontend Dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    { id: '6', title: 'Data Science', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80', count: '7.3k Posts', author: 'Linda Davis', role: 'Data Scientist', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
    { id: '7', title: 'Mobile Apps', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80', count: '6.4k Posts', author: 'David Lee', role: 'Mobile Eng', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    { id: '8', title: 'Blockchain', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&q=80', count: '4.2k Posts', author: 'Alex Smith', role: 'Crypto Analyst', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80' },
    { id: '9', title: 'App Development', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80', count: '10.1k Posts', author: 'Guy Hawkins', role: 'App Dev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    { id: '10', title: 'Cyber Security', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80', count: '6.8k Posts', author: 'Bessie Cooper', role: 'Security Expert', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80' },
    { id: '11', title: 'Cloud Computing', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80', count: '8.4k Posts', author: 'Courtney Henry', role: 'Cloud Arch', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { id: '12', title: 'Game Development', image: 'https://images.unsplash.com/photo-1556438158-8d8116ae2d7b?w=500&q=80', count: '5.5k Posts', author: 'Eleanor Pena', role: 'Game Designer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
];

const ROW_TOPICS = TOPICS; // Use all topics in one row

function StoryItem({
    story,
    isDarkMode,
    textSecondary,
    onPress,
    onLongPress,
    isCurrentUser,
    onAddStory
}: {
    story: any,
    isDarkMode: boolean,
    textSecondary: string,
    onPress: () => void,
    onLongPress?: () => void,
    isCurrentUser?: boolean,
    onAddStory?: () => void
}) {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    // Dynamic Seen Status: If ANY item is unseen, the whole story is unseen
    const isSeen = story.items ? story.items.every((i: any) => i.seen) : story.seen;

    useEffect(() => {
        if (!isSeen) {
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 6000,
                    easing: Easing.linear,
                }),
                -1,
                false
            );
        } else {
            cancelAnimation(rotation);
            rotation.value = 0;
        }
    }, [isSeen]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <View className="mr-2 items-center gap-1.5 relative">
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={500}
                onPressIn={() => scale.value = withTiming(0.95, { duration: 150 })}
                onPressOut={() => scale.value = withTiming(1, { duration: 150 })}
            >
                <Animated.View style={[scaleStyle]}>
                    <View className="w-[75px] h-[100px] rounded-[22px] justify-center items-center overflow-hidden relative">
                        <AnimatedLinearGradient
                            colors={['#0066FF', '#E056FD']}
                            style={[
                                { position: 'absolute', width: 220, height: 220, opacity: isSeen ? 0 : 1 },
                                animatedStyle
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                        {/* Gray Ring for Seen Stories */}
                        {isSeen && (
                            <View style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 22, borderWidth: 2, borderColor: isDarkMode ? '#374151' : '#e5e7eb' }} />
                        )}

                        <View className={`w-[71px] h-[96px] rounded-[21px] ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-[2px]`}>
                            <View className="flex-1 rounded-[19px] overflow-hidden bg-gray-100">
                                <Image
                                    source={{ uri: story.image }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                />
                            </View>
                        </View>

                        {/* Add Button for Current User - Inside Card Container */}
                        {isCurrentUser && onAddStory && (
                            <TouchableOpacity
                                onPress={onAddStory}
                                className="absolute bottom-1 right-1 w-6 h-6 rounded-full items-center justify-center bg-green-500 border-[1.5px] border-white z-50 elevation-sm shadow-sm"
                            >
                                <Ionicons name="add" size={16} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </TouchableOpacity>

            <Text className="text-[11px] font-medium w-[75px] text-center" style={{ color: isSeen ? textSecondary : (isDarkMode ? '#f3f4f6' : '#111827') }} numberOfLines={1}>
                {story.name}
            </Text>
        </View>
    );
}

function YourStoryItem({ isDarkMode, textSecondary, onPress }: { isDarkMode: boolean, textSecondary: string, onPress: () => void }) {
    const scale = useSharedValue(1);
    const dashOffset = useSharedValue(0);

    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    useEffect(() => {
        dashOffset.value = withRepeat(
            withTiming(28, { // Total length of dash pattern (8 + 6 = 14) * 2 = 28 for smooth loop
                duration: 1500,
                easing: Easing.linear,
            }),
            -1, // Infinite repeat
            false // No reverse
        );
    }, []);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: -dashOffset.value, // Negative to move clockwise
    }));

    return (
        <TouchableOpacity
            className="mr-2 items-center gap-1.5"
            activeOpacity={0.9}
            onPress={onPress}
            onPressIn={() => scale.value = withTiming(0.95, { duration: 150 })}
            onPressOut={() => scale.value = withTiming(1, { duration: 150 })}
        >
            <Animated.View style={[scaleStyle]}>
                <View className="w-[75px] h-[100px] justify-center items-center relative">
                    {/* Static Container with SVG Overlay */}
                    <View style={{ position: 'absolute', width: 75, height: 100 }} pointerEvents="none">
                        <Svg width="75" height="100" viewBox="0 0 75 100">
                            <Defs>
                                <SvgLinearGradient id="grad" x1="0" y1="0" x2="75" y2="0" gradientUnits="userSpaceOnUse">
                                    <Stop offset="0" stopColor="#0066FF" />
                                    <Stop offset="1" stopColor="#E056FD" />
                                </SvgLinearGradient>
                            </Defs>
                            <AnimatedRect
                                x="1.25"
                                y="1.25"
                                width="72.5"
                                height="97.5"
                                rx="21"
                                fill="none"
                                stroke="url(#grad)"
                                strokeWidth="2.5"
                                strokeDasharray="8 6"
                                animatedProps={animatedProps}
                            />
                        </Svg>
                    </View>

                    {/* Static Card Content */}
                    <View className="w-[71px] h-[96px] rounded-[21px] overflow-hidden items-center justify-center">
                        <View className={`flex-1 w-full items-center justify-center ${isDarkMode ? 'bg-black/40' : 'bg-white'}`}>
                            <Ionicons name="add" size={32} color={isDarkMode ? '#4b5563' : '#9ca3af'} />
                        </View>
                    </View>
                </View>
            </Animated.View>
            <Text className="text-[11px] font-medium" style={{ color: textSecondary }}>Your Story</Text>
        </TouchableOpacity>
    );
}

interface MainContentProps {
    headerBg: string;
    iconColor: string;
    handleScroll: (event: any) => void;
    toggleTheme: () => void;
    toggleSidebar: (type?: any) => void;
    onSearch: () => void;
    textPrimary: string;
    textSecondary: string;
    cardBg: string;
    cardBorder: string;
    isDarkMode: boolean;
    navigation: any;
    mainAnim: any;
    drawerWidth: number;
}

// Helper for sorting: Unseen first, then Seen
const sortStories = (storiesList: any[]) => {
    return [...storiesList].sort((a, b) => Number(!!a.seen) - Number(!!b.seen));
};


// Component for individual Full Screen Story logic
const FullStoryScreen = React.memo(({
    story,
    initialStoryIndex = 0,
    onClose,
    onNextUser,
    onPrevUser,
    isActive,
    x,
    index,
    globalDragY,
    currentVisibleIndex
}: {
    story: any,
    initialStoryIndex?: number,
    onClose: () => void,
    onNextUser: () => void,
    onPrevUser: () => void,
    isActive: boolean,
    x: SharedValue<number>,
    index: number,
    globalDragY: SharedValue<number>,
    currentVisibleIndex: number
}) => {
    const [storyIndex, setStoryIndex] = useState(initialStoryIndex);
    const [progress, setProgress] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false); // Track loading state
    const videoRef = useRef<Video>(null);
    const { width, height } = Dimensions.get('window');

    // Optimization: Only mount video if it's the current one or immediate neighbor
    // This drastically reduces memory usage and "stuck" frames on fast scrolling
    const shouldRenderVideo = Math.abs(index - currentVisibleIndex) <= 1;


    // Reset state when story changes or becomes inactive
    useEffect(() => {
        setStoryIndex(initialStoryIndex);
        setProgress(0);
    }, [story.id]);

    useEffect(() => {
        if (!isActive) {
            // Stop immediately and reset to ensure no lingering sound
            videoRef.current?.stopAsync();
        } else {
            videoRef.current?.playAsync();
        }
    }, [isActive]);

    const currentItem = story.items ? story.items[storyIndex] : null;

    // Gestures for Swipe Down to Close
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const borderRadius = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onChange((e) => {
            // Only handle vertical swipes for closing
            if (e.translationY > 0) {
                translateY.value = e.translationY;
                globalDragY.value = e.translationY; // Update global value

                // Smooth scale down
                scale.value = interpolate(e.translationY, [0, 400], [1, 0.75], Extrapolation.CLAMP);
                borderRadius.value = interpolate(e.translationY, [0, 200], [0, 20], Extrapolation.CLAMP);
            }
        })
        .onEnd((e) => {
            // Close if dragged down sufficiently OR flicked down fast enough
            if (e.translationY > 80 || e.velocityY > 600) {
                // Animate all shared values for a smooth "disappearing" exit
                globalDragY.value = withTiming(height, { duration: 250 }); // Fade out background
                scale.value = withTiming(0.6, { duration: 250 }); // Shrink card
                borderRadius.value = withTiming(30, { duration: 250 }); // Round corners more
                translateY.value = withTiming(height, { duration: 250 }, () => runOnJS(onClose)());
            } else {
                translateY.value = withSpring(0, { damping: 15 });
                globalDragY.value = withSpring(0, { damping: 15 }); // Reset global value
                scale.value = withSpring(1);
                borderRadius.value = withTiming(0);
            }
        });

    // Reactive Audio Muting for instant silence on interaction
    const pauseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pauseAsync();
        }
    };

    const playVideo = () => {
        if (videoRef.current && isActive) {
            videoRef.current.playAsync();
        }
    };

    useAnimatedReaction(
        () => {
            const offset = index * width;
            // Check if swiping away or dragging down
            return (
                translateY.value > 50 || // Dragging down significantly
                Math.abs(x.value - offset) > width * 0.1 // Swiping sideways > 10%
            );
        },
        (shouldMute, prevShouldMute) => {
            if (shouldMute !== prevShouldMute) {
                if (shouldMute) {
                    runOnJS(pauseVideo)();
                } else if (isActive) {
                    // Only resume if still active and not dragging
                    runOnJS(playVideo)();
                }
            }
        },
        [isActive, index, width]
    );

    // 3D Cube Transition Logic combined with Pan Gesture
    const animatedStyle = useAnimatedStyle(() => {
        const offset = index * width;
        const diff = x.value - offset; // relative position

        // Clamp diff to avoid weird glitches at edges of list
        const clampedDiff = Math.max(-width, Math.min(width, diff));

        // Refined Rotation: Use 60 degrees for a cleaner look that minimizes the gap
        const rotateY = interpolate(
            clampedDiff,
            [-width, width],
            [60, -60],
            Extrapolation.CLAMP
        );

        // Pivot/Translate Logic for cleaner seam
        const translateX = interpolate(
            clampedDiff,
            [-width, width],
            [width / 2, -width / 2],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { perspective: width * 2 }, // Increased perspective for flatter, more modern look
                { translateX: translateX },
                { rotateY: `${rotateY}deg` },
                { translateX: -translateX },
                { translateY: translateY.value },
                { scale: scale.value }
            ],
            // Optimize zIndex to ensure current item is on top during transition
            zIndex: index === Math.round(x.value / width) ? 10 : 0,
            borderRadius: borderRadius.value,
            overflow: 'hidden', // Crucial for borderRadius clipping
        };
    });



    // Navigation Logic
    const handleNext = () => {
        if (storyIndex < (story.items?.length || 0) - 1) {
            setStoryIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onNextUser();
        }
    };

    const handlePrev = () => {
        if (storyIndex > 0) {
            setStoryIndex(prev => prev - 1);
            setProgress(0);
        } else {
            onPrevUser();
        }
    };

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsVideoLoaded(true);
            const p = status.durationMillis ? status.positionMillis / status.durationMillis : 0;
            setProgress(p);
            if (status.didJustFinish) {
                handleNext();
            }
        } else {
            setIsVideoLoaded(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ width, height }}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', overflow: 'hidden' }, animatedStyle]}>
                    <View
                        style={[{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'black', zIndex: -1
                        }]}
                    />

                    {/* Progress Bar */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, zIndex: 40 }}
                    />
                    <View className="absolute top-12 left-2 right-2 z-50 flex-row gap-1 h-[3px]">
                        {story.items && story.items.map((_: any, index: number) => (
                            <View key={index} className="flex-1 h-full bg-white/30 rounded-full overflow-hidden">
                                <View
                                    style={{
                                        width: index < storyIndex ? '100%' : (index === storyIndex ? `${progress * 100}%` : '0%')
                                    }}
                                    className="h-full bg-white rounded-full"
                                />
                            </View>
                        ))}
                    </View>

                    {/* User Info */}
                    <View className="absolute top-16 left-4 z-50 flex-row items-center gap-2">
                        <Image
                            source={{ uri: story.image }}
                            style={{ width: 32, height: 32, borderRadius: 16 }}
                        />
                        <Text className="text-white font-bold text-shadow">{story.name}</Text>
                        <Text className="text-white/70 text-xs ml-1">• {currentItem?.type === 'video' ? 'Video' : 'Photo'}</Text>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        className="absolute top-16 right-4 z-50 p-2"
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    {/* Content Layering */}

                    {/* Activity Indicator (Spinner) - Shows while video is loading */}
                    {!isVideoLoaded && currentItem?.type === 'video' && isActive && (
                        <View style={{ position: 'absolute', zIndex: 2, alignItems: 'center', justifyContent: 'center', width, height }}>
                            <ActivityIndicator size="large" color="#ffffff" />
                        </View>
                    )}

                    {/* Video Component - Loads on top */}
                    {currentItem && shouldRenderVideo ? (
                        <Video
                            key={currentItem.uri} // Force re-render on video change
                            ref={videoRef}
                            style={{ width: width, height: height, backgroundColor: 'black' }}
                            source={
                                currentItem.uri
                                    ? (typeof currentItem.uri === 'string' ? { uri: currentItem.uri } : currentItem.uri)
                                    : require('../../assets/images/video.mp4')
                            }
                            useNativeControls={false}
                            resizeMode={ResizeMode.CONTAIN} // "Perfect visible" (No zooming/cropping)
                            shouldPlay={isActive}
                            isLooping={false}
                            isMuted={false}
                            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                            usePoster={false} // Clean loading, rely on Spinner
                        />
                    ) : null}

                    {/* Bottom Gradient */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)']}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, zIndex: 40 }}
                    />

                    {/* Navigation Overlay */}
                    <View className="absolute inset-0 flex-row w-full h-full z-40">
                        <TouchableOpacity className="w-[30%] h-full" onPress={handlePrev} activeOpacity={1} />
                        <TouchableOpacity className="flex-1 h-full" activeOpacity={1} />
                        <TouchableOpacity className="w-[30%] h-full" onPress={handleNext} activeOpacity={1} />
                    </View>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
});

export default function MainContent({
    headerBg,
    iconColor,
    handleScroll,
    toggleTheme,
    toggleSidebar,
    onSearch,
    textPrimary,
    textSecondary,
    cardBg,
    cardBorder,
    isDarkMode,
    navigation,
    mainAnim,
    drawerWidth
}: MainContentProps) {
    const insets = useSafeAreaInsets();
    const isTablet = width > 768;
    const headerTopPadding = 15;

    useEffect(() => {
        const configureAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
            } catch (error) {
                console.error("Error configuring audio:", error);
            }
        };
        configureAudio();
    }, []);

    // Initialize with sorted stories
    const [stories, setStories] = useState(() => sortStories(STORIES));
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // For FlatList logic
    const flatListRef = useRef<any>(null);
    const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);

    // X Scroll Value for 3D Transition
    const x = useSharedValue(0);
    const globalDragY = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        },
    });

    const globalBackgroundStyle = useAnimatedStyle(() => ({
        opacity: interpolate(globalDragY.value, [0, 200], [1, 0], Extrapolation.CLAMP)
    }));

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simulate network request
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const handleAddStory = async () => {
        // ... (Keep existing handleAddStory logic if possible, or adapt)
        // For brevity in this large replacement, assuming handleAddStory logic remains similar or is re-implemented if referenced.
        // Since I am replacing the whole component body, I need to include it.
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: false,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            // ... (Logic to add story - existing logic needs to be preserved)
            const newItems = result.assets.map(asset => ({
                id: Date.now().toString() + Math.random().toString(),
                uri: asset.uri,
                type: 'video',
                seen: false
            }));

            setStories(prevStories => {
                const currentUserStoryIndex = prevStories.findIndex(s => s.id === 'current-user');
                if (currentUserStoryIndex !== -1) {
                    const updatedStories = [...prevStories];
                    const existingStory = updatedStories[currentUserStoryIndex];
                    updatedStories[currentUserStoryIndex] = {
                        ...existingStory,
                        items: [...(existingStory.items || []), ...newItems],
                        seen: false,
                        image: newItems[newItems.length - 1].uri
                    };
                    const youStory = updatedStories.splice(currentUserStoryIndex, 1)[0];
                    updatedStories.unshift(youStory);
                    return updatedStories;
                } else {
                    const newStory = {
                        id: 'current-user',
                        name: 'You',
                        image: newItems[0].uri,
                        seen: false,
                        items: newItems
                    };
                    return [newStory, ...prevStories];
                }
            });
        }
    };

    const handleStoryPress = (story: any, index: number) => {
        // Normalize
        if (!story.items) {
            story.items = [{ id: story.id, uri: story.videoUri || story.image, type: 'video', seen: story.seen }];
        }

        setCurrentVisibleIndex(index);

        // Initialize Shared Values immediately to prevent "half-swiped" glitch
        x.value = index * width;
        globalDragY.value = 0; // Ensure background is opaque

        setModalVisible(true);
        // Removed setTimeout for instant open. Using initialScrollIndex instead.
    };

    const handleVideoClose = () => {
        setModalVisible(false);
        // Do NOT reset globalDragY here to prevent black flash.
        // It is reset in handleStoryPress.
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentVisibleIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const stripWidth = width - drawerWidth;
        const stripCenter = stripWidth / 2;
        const targetPadding = stripCenter - 20;

        return {
            paddingLeft: interpolate(
                mainAnim.value,
                [0, drawerWidth],
                [16, targetPadding]
            )
        };
    });

    return (
        <View className="flex-1">
            <Animated.View
                className="pr-5 pb-4"
                style={[{
                    backgroundColor: headerBg,
                    paddingTop: headerTopPadding,
                }, headerAnimatedStyle]}
            >
                <View className="flex-row items-center justify-between relative pl-4 pr-2">
                    <View className="flex-row items-center justify-between w-full">
                        {/* Left: Menu Button */}
                        <TouchableOpacity
                            onPress={() => toggleSidebar('feeds')}
                            className="w-10 h-10 justify-center items-center"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <View className="gap-1.5 px-0.5">
                                <View className="w-6 h-[2.5px] rounded-full" style={{ backgroundColor: textPrimary }} />
                                <View className="w-4 h-[2.5px] rounded-full" style={{ backgroundColor: textPrimary }} />
                            </View>
                        </TouchableOpacity>

                        {/* Center: Logo */}
                        <View
                            className="flex-row items-center gap-1.5 absolute left-0 right-0 justify-center"
                            pointerEvents="none"
                        >
                            <Image
                                source={require('../../assets/icons/eduprova (2).png')}
                                style={{ width: 35, height: 35 }}
                                contentFit="contain"
                            />
                        </View>

                        {/* Right: Search */}
                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity
                                onPress={onSearch}
                                className="p-2 -mr-2"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="search-outline" size={24} color={iconColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>

            <CustomRefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: 0, paddingBottom: 100 }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
            >
                {/* Stories Section */}
                <View
                    className="py-4 border-b"
                    style={{ borderColor: isDarkMode ? '#1f2937' : '#f3f4f6' }}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="flex-row"
                        overScrollMode="never"
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    >
                        {/* Only show "Add Story" if user hasn't uploaded one yet */}
                        {!stories.some(s => s.id === 'current-user') && (
                            <YourStoryItem isDarkMode={isDarkMode} textSecondary={textSecondary} onPress={handleAddStory} />
                        )}
                        {stories.map((story, index) => (
                            <StoryItem
                                key={story.id}
                                story={story}
                                isDarkMode={isDarkMode}
                                textSecondary={textSecondary}
                                onPress={() => handleStoryPress(story, index)}
                                isCurrentUser={story.id === 'current-user'}
                                onAddStory={story.id === 'current-user' ? handleAddStory : undefined}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Video Modal with FlatList */}
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleVideoClose}
                    statusBarTranslucent
                >
                    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                        {/* Global Black Background that fades on drag */}
                        <Animated.View
                            style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black' }, globalBackgroundStyle]}
                        />
                        <Animated.FlatList
                            ref={flatListRef}
                            data={stories}
                            keyExtractor={(item: any) => item.id}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            windowSize={3}
                            initialNumToRender={2}
                            maxToRenderPerBatch={2}
                            removeClippedSubviews={Platform.OS === 'android'} // Crucial for performance
                            // Attach scroll handler
                            onScroll={onScroll}
                            // Reduce scroll throttle for smoother animation
                            scrollEventThrottle={16}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            getItemLayout={(data, index) => (
                                { length: width, offset: width * index, index }
                            )}
                            initialScrollIndex={currentVisibleIndex} // Jumping to index instantly
                            renderItem={({ item, index }: any) => (
                                <FullStoryScreen
                                    story={item}
                                    isActive={index === currentVisibleIndex && modalVisible} // Check modalVisible
                                    x={x} // Pass shared value
                                    index={index}
                                    globalDragY={globalDragY} // Pass this
                                    currentVisibleIndex={currentVisibleIndex} // Pass for optimization
                                    onClose={handleVideoClose}
                                    onNextUser={() => {
                                        if (index < stories.length - 1) {
                                            flatListRef.current?.scrollToIndex({ index: index + 1, animated: true });
                                        } else {
                                            handleVideoClose();
                                        }
                                    }}
                                    onPrevUser={() => {
                                        if (index > 0) {
                                            flatListRef.current?.scrollToIndex({ index: index - 1, animated: true });
                                        }
                                    }}
                                />
                            )}
                        />
                    </View>
                </Modal>

                {/* Trending Topics Grid */}
                < View className={`mb-6 mt-4 ${isTablet ? 'self-center w-full max-w-[800px]' : ''}`
                }>
                    <View className="flex-row items-center justify-between px-5 mb-6">
                        <View className="flex-row items-center gap-2">
                            <Text className="text-2xl font-bold" style={{ color: textPrimary }}>Trending Topics</Text>
                            <Text className="text-2xl">🔥</Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-blue-500 font-bold">View all</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pl-5"
                        contentContainerStyle={{ paddingRight: 20, gap: 4 }}
                        overScrollMode="never"
                        decelerationRate="normal"
                    >
                        {ROW_TOPICS.map((topic) => (
                            <TouchableOpacity
                                key={topic.id}
                                className="w-[180px]"
                                activeOpacity={0.9}
                            >
                                <View className="flex-row items-center justify-between mb-2 px-1">
                                    <View className="flex-row items-center">
                                        <Image
                                            source={{ uri: topic.avatar }}
                                            style={{ width: 24, height: 24, borderRadius: 12, marginRight: 6, borderWidth: 1, borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}
                                            contentFit="cover"
                                        />
                                        <View className="justify-center gap-0">
                                            <Text className="text-[12px] font-bold leading-tight" numberOfLines={1} style={{ color: textPrimary }}>
                                                {topic.author}
                                            </Text>
                                            <Text className="text-[10px]" numberOfLines={1} style={{ color: textSecondary }}>
                                                {topic.role}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity>
                                        <Ionicons name="ellipsis-vertical" size={12} color={textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                <Image
                                    source={{ uri: topic.image }}
                                    style={{ width: '100%', height: 200, borderRadius: 16 }}
                                    contentFit="cover"
                                />

                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View >

                {/* Feed Posts */}
                < View className={`${isTablet ? 'items-center' : ''} `}>
                    <View className={`${isTablet ? 'w-full max-w-[600px]' : 'px-0'} `}>
                        {POSTS.map((post) => (
                            <FeedPost
                                key={post.id}
                                post={post}
                                isDarkMode={isDarkMode}
                                textPrimary={textPrimary}
                                textSecondary={textSecondary}
                                isTablet={isTablet}
                            />
                        ))}
                    </View>
                </View >
            </CustomRefreshControl >
        </View >
    );
}
