import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let typeClass = '';
  switch (type) {
    case 'default':
      typeClass = 'text-base leading-6';
      break;
    case 'title':
      typeClass = 'text-[32px] font-bold leading-[32px]';
      break;
    case 'defaultSemiBold':
      typeClass = 'text-base leading-6 font-semibold';
      break;
    case 'subtitle':
      typeClass = 'text-xl font-bold';
      break;
    case 'link':
      typeClass = 'text-base leading-[30px] text-[#0a7ea4]';
      break;
  }

  return (
    <Text
      className={typeClass}
      style={[
        { color },
        style,
      ]}
      {...rest}
    />
  );
}
