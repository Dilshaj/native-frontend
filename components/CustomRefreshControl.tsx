import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    withRepeat,
    useAnimatedScrollHandler,
    runOnJS,
    interpolate,
    Extrapolation,
    cancelAnimation,
    Easing,
    useAnimatedProps,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
// Replaced MaskedView with Svg for better compatibility
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Mask, Rect, Image as SvgImage } from 'react-native-svg';

const REFRESH_HEIGHT = 80;
const THRESHOLD = 100;
const LOGO_SIZE = 35;

// Create Animated components for SVG
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedSvgImage = Animated.createAnimatedComponent(SvgImage);

export function CustomRefreshControl({ refreshing, onRefresh, children, style, onScroll: externalOnScroll, ...props }: any) {
    const scrollY = useSharedValue(0);
    const isRefreshing = useSharedValue(false);
    const rotation = useSharedValue(0);

    // Synchronize local refreshing state with prop
    useEffect(() => {
        isRefreshing.value = refreshing;
        if (refreshing) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 1000, easing: Easing.linear }),
                -1,
                false
            );
        } else {
            cancelAnimation(rotation);
            rotation.value = 0;
        }
    }, [refreshing]);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
            if (externalOnScroll) {
                runOnJS(externalOnScroll)({ nativeEvent: event });
            }
        },
        onEndDrag: () => {
            if (scrollY.value <= -THRESHOLD && !isRefreshing.value) {
                isRefreshing.value = true;
                runOnJS(onRefresh)();
            }
        },
    });

    // Header Animation Styles
    const headerStyle = useAnimatedStyle(() => {
        // Reveal header only when pulling down
        const translateY = interpolate(
            scrollY.value,
            [-THRESHOLD, 0],
            [0, -REFRESH_HEIGHT],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ translateY }],
            opacity: interpolate(scrollY.value, [-50, 0], [1, 0], Extrapolation.CLAMP),
        };
    });

    // Rotation for the entire SVG container (for spinning)
    const rotationStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${rotation.value}deg` }
            ]
        };
    });

    // Scale effect on pull
    const scaleStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollY.value,
            [-THRESHOLD, 0],
            [1.2, 0.8],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ scale }]
        }
    });

    // Gradient Fill Animation (SVG Rect Y position)
    // Initially (scrollY = 0), rect is below (y = LOGO_SIZE).
    // At -THRESHOLD, rect is at top (y = 0).
    const animatedRectProps = useAnimatedProps(() => {
        let translateY;
        if (isRefreshing.value) {
            translateY = 0; // Full fill
        } else {
            translateY = interpolate(
                scrollY.value,
                [-THRESHOLD, 0],
                [0, LOGO_SIZE],
                Extrapolation.CLAMP
            );
        }

        return {
            y: translateY
        };
    });

    return (
        <View style={[styles.container, style]}>
            {/* Animated Header Layer */}
            <Animated.View style={[styles.headerContainer, headerStyle]}>
                <Animated.View style={[{ width: LOGO_SIZE, height: LOGO_SIZE }, rotationStyle, scaleStyle]}>
                    <Svg height={LOGO_SIZE} width={LOGO_SIZE} viewBox={`0 0 ${LOGO_SIZE} ${LOGO_SIZE}`}>
                        <Defs>
                            <SvgLinearGradient id="grad" x1="0" y1="1" x2="0" y2="0">
                                <Stop offset="0" stopColor="#0066FF" stopOpacity="1" />
                                <Stop offset="1" stopColor="#E056FD" stopOpacity="1" />
                            </SvgLinearGradient>
                            <Mask id="mask">
                                {/* The mask is the logo image itself. 
                          White pixels = visible, Transparent = hidden.
                          We assume outline-logo.png has transparency.
                      */}
                                <SvgImage
                                    href={require('../assets/images/outline-logo.png')}
                                    x="0"
                                    y="0"
                                    height={LOGO_SIZE}
                                    width={LOGO_SIZE}
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            </Mask>
                        </Defs>

                        {/* Background Track (Gray Logo) - Unfilled state */}
                        <SvgImage
                            href={require('../assets/images/outline-logo.png')}
                            x="0"
                            y="0"
                            height={LOGO_SIZE}
                            width={LOGO_SIZE}
                            opacity="0.3"
                        />

                        {/* The Gradient Rectangle, masked by the logo */}
                        <AnimatedRect
                            x="0"
                            width={LOGO_SIZE}
                            height={LOGO_SIZE}
                            fill="url(#grad)"
                            mask="url(#mask)"
                            animatedProps={animatedRectProps}
                        />
                    </Svg>
                </Animated.View>
            </Animated.View>

            {/* Scrollable Content */}
            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: 0 }}
                contentInset={{ top: refreshing ? REFRESH_HEIGHT : 0 }}
                contentOffset={{ x: 0, y: refreshing ? -REFRESH_HEIGHT : 0 }}
                {...props}
            >
                {children}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: REFRESH_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        marginTop: 35
    },
});
