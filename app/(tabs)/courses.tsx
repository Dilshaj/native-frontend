import { Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CoursesScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#0b0f19]" edges={['top']}>
            <View className="px-5 py-4 border-b border-[#1f2937]">
                <Text className="text-2xl font-bold text-white">Courses</Text>
            </View>
            <View className="flex-1 justify-center items-center pb-[120px]">
                <Text className="text-white">Courses Content</Text>
            </View>
        </SafeAreaView>
    );
}


