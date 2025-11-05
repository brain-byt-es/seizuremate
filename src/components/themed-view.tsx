import { View, type ViewProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const theme = useColorScheme() ?? 'light';
  const defaultBackgroundColor = useThemeColor('background');
  const overrideColor = theme === 'light' ? lightColor : darkColor;
  const backgroundColor = overrideColor ?? defaultBackgroundColor;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
