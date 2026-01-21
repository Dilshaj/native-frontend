import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    cancelAnimation
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

// 4 Rings with Alternating Directions and Varied Speeds
const ORBITS = [
    { size: width * 0.4, duration: 25000, direction: 1 },  // Clockwise
    { size: width * 0.6, duration: 35000, direction: -1 }, // Counter-Clockwise
    { size: width * 0.8, duration: 45000, direction: 1 },  // Clockwise
    { size: width * 1.0, duration: 55000, direction: -1 }, // Counter-Clockwise
];

// Tech Stack Mapping
const ICONS = [
    // --- Ring 0: React, JS, TS (3 Icons) ---
    { icon: 'react', color: '#61dafb', orbitIndex: 0, angle: 0 },
    { icon: 'language-javascript', color: '#f7df1e', orbitIndex: 0, angle: 120 },
    { icon: 'language-typescript', color: '#3178c6', orbitIndex: 0, angle: 240 },

    // --- Ring 1: Python, Java, Django, Flask, C (5 Icons) ---
    { icon: 'language-python', color: '#3776ab', orbitIndex: 1, angle: 0 },
    { icon: 'language-java', color: '#007396', orbitIndex: 1, angle: 72 },
    { icon: 'alpha-d-circle', color: '#092e20', orbitIndex: 1, angle: 144 }, // Django approx
    { icon: 'bottle-tonic-plus', color: '#333', orbitIndex: 1, angle: 216 }, // Flask approx
    { icon: 'language-c', color: '#555555', orbitIndex: 1, angle: 288 },

    // --- Ring 2: HTML, CSS, Next, Nest, Tailwind (5 Icons) ---
    { icon: 'language-html5', color: '#e34f26', orbitIndex: 2, angle: 36 },
    { icon: 'language-css3', color: '#264de4', orbitIndex: 2, angle: 108 },
    { icon: 'alpha-n-box', color: '#000000', orbitIndex: 2, angle: 180 }, // Next.js approx
    { icon: 'api', color: '#e0234e', orbitIndex: 2, angle: 252 }, // NestJS approx (abstract)
    { icon: 'weather-windy', color: '#38bdf8', orbitIndex: 2, angle: 324 }, // Tailwind approx

    // --- Ring 3: GitHub, DevOps, Jenkins, AWS, Mongo (5 Icons) ---
    { icon: 'github', color: '#333', orbitIndex: 3, angle: 18 },
    { icon: 'infinity', color: '#007acc', orbitIndex: 3, angle: 90 }, // DevOps
    { icon: 'account-tie', color: '#335061', orbitIndex: 3, angle: 162 }, // Jenkins (Butler)
    { icon: 'aws', color: '#ff9900', orbitIndex: 3, angle: 234 },
    { icon: 'leaf', color: '#47a248', orbitIndex: 3, angle: 306 }, // MongoDB (Leaf)
];

export function OrbitalAnimations() {
    return (
        <View className="flex-1 w-full relative">
            {/* App Logo Section */}
            {/* App Logo Section */}
            <View className="absolute top-[18%] left-6 flex-row gap-1 items-center  z-20">
                <Image
                    source={require('../assets/images/Eduprova logo (2).png')}
                    style={{ width: 12, height: 12 }}
                    contentFit="contain"
                />
                <Image
                    source={require('../assets/images/eduprova_logo copy.png')}
                    style={{ width: 60, height: 15 }}
                    contentFit="contain"
                />
            </View>

            {/* Orbital Center - Bottom of Container */}
            <View className="absolute bottom-0 left-0 right-0 items-center justify-end">
                {ORBITS.map((orbit, index) => (
                    <OrbitRing key={index} size={orbit.size} duration={orbit.duration} direction={orbit.direction}>
                        {ICONS.filter(i => i.orbitIndex === index).map((iconItem, i) => (
                            <View
                                key={i}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginLeft: -16,
                                    marginTop: -16,
                                    // Rotate around center, then push to rim
                                    transform: [
                                        { rotate: `${iconItem.angle}deg` },
                                        { translateY: -orbit.size / 2 }
                                    ]
                                }}
                            >
                                <View
                                    // Counter-rotate to keep icon upright vs the ring's rotation + placement angle?
                                    // Actually, if the ring rotates, the icon rotates with it.
                                    // To keep it upright RELATIVE TO SCREEN, we need to counter-rotate:
                                    // -(RingRotation + PlacementAngle)
                                    // But doing that inside a static keyframe map is hard without accessing shared value.
                                    // However, usually "orbital" icons rotate *with* the planet/ring so expected behavior is fine.
                                    // Users usually just want the icon to not be upside down relative to the rim.
                                    // Let's just correct for the placement angle so it's upright at top (0deg).
                                    style={{ transform: [{ rotate: `${-iconItem.angle}deg` }] }}
                                    className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100 z-50 overflow-hidden"
                                >
                                    <MaterialCommunityIcons name={iconItem.icon as any} size={18} color={iconItem.color} />
                                </View>
                            </View>
                        ))}
                    </OrbitRing>
                ))}
            </View>
        </View>
    );
}

function OrbitRing({ size, duration, direction, children }: { size: number, duration: number, direction: number, children: React.ReactNode }) {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360 * direction, {
                duration: duration,
                easing: Easing.linear,
            }),
            -1,
            false
        );
        return () => cancelAnimation(rotation);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <View
            className="absolute justify-center items-center rounded-full border border-blue-300"
            style={{
                width: size,
                height: size,
                bottom: -size / 2,
                borderWidth: 1.5 // Thick borders as requested
            }}
        >
            <Animated.View style={[{ width: '100%', height: '100%' }, animatedStyle]}>
                {children}
            </Animated.View>
        </View>
    );
}
