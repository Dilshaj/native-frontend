import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    interpolateColor,
} from 'react-native-reanimated';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: ViewStyle;
    borderRadius?: number;
    isDarkMode?: boolean;
}

export default function Skeleton({
    width = '100%',
    height = 20,
    style,
    borderRadius = 4,
    isDarkMode = false,
}: SkeletonProps) {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000, easing: Easing.ease }),
                withTiming(0.5, { duration: 1000, easing: Easing.ease })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const backgroundColor = isDarkMode ? '#374151' : '#e5e7eb';

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    backgroundColor,
                    borderRadius,
                },
                style,
                animatedStyle,
            ]}
        />
    );
}
