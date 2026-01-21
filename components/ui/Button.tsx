import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { ReactNode } from 'react';

import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'outline' | 'google';
    children: ReactNode;
    icon?: ReactNode;
    gradientColors?: string[];
}

export function Button({ variant = 'primary', children, icon, className, gradientColors, ...props }: ButtonProps) {
    let baseClass = "h-11 rounded-xl flex-row justify-center items-center w-full"; // Removed from here if gradient used? No, keep container classes.
    let baseContainerClass = "h-11 rounded-xl w-full";
    let variantClass = "";
    let textClass = "";

    switch (variant) {
        case 'primary':
            variantClass = gradientColors ? "" : "bg-blue-600";
            textClass = "text-white font-bold text-base";
            break;
        case 'outline':
            variantClass = "bg-transparent border border-gray-200";
            textClass = "text-gray-900 font-semibold text-base";
            break;
        case 'google':
            variantClass = "bg-white border border-gray-200";
            textClass = "text-gray-700 font-semibold text-base";
            break;
    }

    const content = (
        <>
            {icon && <View className="mr-3">{icon}</View>}
            <Text className={textClass}>{children}</Text>
        </>
    );

    if (gradientColors) {
        return (
            <TouchableOpacity className={`${baseContainerClass} ${className}`} {...props}>
                <LinearGradient
                    colors={gradientColors as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-1 rounded-xl flex-row justify-center items-center overflow-hidden"
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity className={`${baseClass} ${variantClass} ${className}`} {...props}>
            {content}
        </TouchableOpacity>
    );
}
