import { Text, TouchableOpacity, TouchableOpacityProps, View, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { ReactNode } from 'react';

import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'outline' | 'google';
    children: ReactNode;
    icon?: ReactNode;
    gradientColors?: string[];
    textStyle?: StyleProp<TextStyle>;
}

export function Button({ variant = 'primary', children, icon, className, gradientColors, style, textStyle, ...props }: ButtonProps) {
    let baseContainerClass = "h-12 rounded-xl w-full overflow-hidden";
    let variantClass = "";
    let textClass = "";

    switch (variant) {
        case 'primary':
            variantClass = gradientColors ? "" : "bg-blue-600";
            textClass = "text-white font-bold text-base";
            break;
        case 'outline':
            variantClass = "bg-transparent border border-gray-200";
            textClass = "text-gray-900 font-bold text-base";
            break;
        case 'google':
            variantClass = "bg-white border border-gray-200";
            textClass = "text-gray-700 font-bold text-base";
            break;
    }

    const content = (
        <View style={styles.contentContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text className={textClass} style={textStyle}>{children}</Text>
        </View>
    );

    if (gradientColors) {
        return (
            <TouchableOpacity
                className={`${baseContainerClass} ${className || ''}`}
                style={style}
                activeOpacity={0.8}
                {...props}
            >
                <LinearGradient
                    colors={gradientColors as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.flexCentering}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            className={`${baseContainerClass} ${variantClass} ${className || ''}`}
            style={[styles.baseCentering, style]}
            activeOpacity={0.8}
            {...props}
        >
            {content}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 10,
    },
    baseCentering: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexCentering: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    }
});
