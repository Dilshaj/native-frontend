
import { View, Text, TouchableOpacity, Image as RNImage, Animated as RNAnimated, Easing } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';

const FeedPost = ({ post, isDarkMode, textPrimary, textSecondary, isTablet }: any) => {
    const [liked, setLiked] = useState(false);
    const [postWidth, setPostWidth] = useState(0);
    const lastTap = useRef<number>(0);

    // Animation Values for Logo
    const scale = useRef(new RNAnimated.Value(0)).current;
    const position = useRef(new RNAnimated.ValueXY({ x: 0, y: 0 })).current;
    const opacity = useRef(new RNAnimated.Value(0)).current;

    // Enhanced Confetti Particles (20 particles)
    const particleCount = 20;

    // Use useRef to store CONSTANT particles configuration
    const particles = useRef(Array.from({ length: particleCount }).map(() => ({
        position: new RNAnimated.ValueXY({ x: 0, y: 0 }),
        opacity: new RNAnimated.Value(0),
        scale: new RNAnimated.Value(0),
        rotation: new RNAnimated.Value(0),
        angle: (Math.random() * 0.5),
        radius: Math.random() * 80 + 40,
        rotateDest: `${Math.random() * 360 + 360}deg`
    }))).current;

    const colors = ['#FFD700', '#FF1493', '#00FFFF', '#1E90FF', '#9370DB', '#FF8C00'];

    const imageHeight = isTablet ? 350 : 200;
    const targetY = -(imageHeight / 2 + 12 + 16);
    const targetX = postWidth > 0 ? (postWidth / 2) - 16 : 150;

    const triggerLikeAnimation = () => {
        position.setValue({ x: targetX, y: targetY });
        scale.setValue(0);
        opacity.setValue(1);

        particles.forEach(p => {
            p.position.setValue({ x: targetX, y: targetY });
            p.opacity.setValue(1);
            p.scale.setValue(1);
            p.rotation.setValue(0);
        });

        const explosionAnimations = particles.map((p, i) => {
            const baseAngle = (i / particleCount) * 2 * Math.PI;
            const finalAngle = baseAngle + p.angle;
            const destX = targetX + Math.cos(finalAngle) * p.radius;
            const destY = targetY + Math.sin(finalAngle) * p.radius;

            return RNAnimated.parallel([
                RNAnimated.timing(p.position, {
                    toValue: { x: destX, y: destY },
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic)
                }),
                RNAnimated.timing(p.rotation, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad)
                }),
                RNAnimated.sequence([
                    RNAnimated.delay(400),
                    RNAnimated.timing(p.opacity, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true
                    })
                ])
            ]);
        });

        RNAnimated.sequence([
            RNAnimated.parallel([
                RNAnimated.spring(scale, {
                    toValue: 2.2,
                    friction: 4,
                    tension: 100,
                    useNativeDriver: true
                }),
                RNAnimated.parallel(explosionAnimations)
            ]),
            RNAnimated.delay(100),
            RNAnimated.parallel([
                RNAnimated.timing(position, {
                    toValue: { x: 0, y: 0 },
                    duration: 700,
                    useNativeDriver: true,
                    easing: Easing.bezier(0.4, 0, 0.2, 1)
                }),
                RNAnimated.spring(scale, {
                    toValue: 1,
                    friction: 8,
                    tension: 30,
                    useNativeDriver: true
                }),
                RNAnimated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                })
            ])
        ]).start();
    };

    const handleButtonPress = () => {
        if (liked) {
            setLiked(false);
            RNAnimated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        } else {
            setLiked(true);
            triggerLikeAnimation();
        }
    };

    const handleImagePress = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
            setLiked(true);
            triggerLikeAnimation();
        }
        lastTap.current = now;
    };

    return (
        <View
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setPostWidth(width);
            }}
            className={`mb-6 pb-6 border-b ${isTablet ? 'rounded-2xl border' : ''}`}
            style={{
                borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                backgroundColor: isTablet && !isDarkMode ? '#fff' : 'transparent',
                marginHorizontal: isTablet ? 0 : 20
            }}
        >
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3">
                    <Image source={{ uri: post.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                    <View>
                        <View className="flex-row items-center gap-1">
                            <Text className="text-[15px] font-bold" style={{ color: textPrimary }}>{post.user}</Text>
                            {post.isVerified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                        </View>
                        <Text className="text-[11px]" style={{ color: textSecondary }}>
                            <Text style={{ color: '#ec4899', fontWeight: '500' }}> {post.role} </Text>
                            <Text className="text-gray-400"> • 2 hours ago</Text>
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={16} color={textSecondary} />
                </TouchableOpacity>
            </View>

            {post.image ? (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleImagePress}
                    className="w-full mb-3 rounded-xl overflow-hidden shadow-sm"
                    style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6' }}
                >
                    <Image
                        source={{ uri: post.image }}
                        style={{ width: '100%', height: imageHeight }}
                        contentFit="cover"
                    />
                </TouchableOpacity>
            ) : null}

            <View>
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-6">
                        <TouchableOpacity onPress={handleButtonPress} className="flex-row items-center gap-1.5 relative w-10 h-10 justify-center items-center z-50">
                            {!liked && (
                                <Ionicons name="heart-outline" size={26} color={textPrimary} />
                            )}

                            {particles.map((p, i) => {
                                const size = i % 2 === 0 ? 6 : 4;
                                const color = colors[i % colors.length];
                                const rotateInterp = p.rotation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', p.rotateDest]
                                });
                                return (
                                    <RNAnimated.View
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            width: size,
                                            height: size * (i % 3 === 0 ? 2 : 1),
                                            borderRadius: i % 3 === 0 ? 1 : size / 2,
                                            backgroundColor: color,
                                            opacity: p.opacity,
                                            transform: [
                                                { translateX: p.position.x },
                                                { translateY: p.position.y },
                                                { scale: p.scale },
                                                { rotate: rotateInterp }
                                            ],
                                            pointerEvents: 'none'
                                        }}
                                    />
                                );
                            })}

                            <RNAnimated.View
                                style={{
                                    position: 'absolute',
                                    opacity: opacity,
                                    transform: [
                                        { translateX: position.x },
                                        { translateY: position.y },
                                        { scale: scale }
                                    ],
                                    zIndex: 100
                                }}
                            >
                                <Image
                                    source={require('../assets/icons/eduprova (2).png')}
                                    style={{ width: 32, height: 32 }}
                                    contentFit="contain"
                                />
                            </RNAnimated.View>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center gap-1.5">
                            <Ionicons name="chatbubble-outline" size={24} color={textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center gap-1.5">
                            <Ionicons name="paper-plane-outline" size={24} color={textPrimary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="bookmark-outline" size={24} color={textPrimary} />
                    </TouchableOpacity>
                </View>

                <Text className="text-[14px] font-bold mb-1.5" style={{ color: textPrimary }}>{post.likes} likes</Text>

                <Text className="text-[14px] leading-[22px]" numberOfLines={2} style={{ color: textPrimary }}>
                    <Text className="font-bold">{post.user}</Text> {post.content}
                </Text>

                <TouchableOpacity className="mt-1">
                    <Text className="text-[13px] text-gray-500">View all {post.comments} comments</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default FeedPost;
