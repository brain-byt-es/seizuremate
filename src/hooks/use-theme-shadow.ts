import { useColorScheme } from 'react-native';
import { shadow } from '@/constants/theme';

export function useThemeShadow() {
  const theme = useColorScheme() ?? 'light';
  return shadow[theme];
}
