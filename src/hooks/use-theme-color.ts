import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTheme, Theme } from '@/constants/theme';

/**
 * A hook to access colors from the current theme, with optional overrides.
 * @param colorName The name of the color to retrieve from the theme's color palette.
 * @param props Optional override object with `light` and `dark` color values.
 */
export function useThemeColor(
  colorName: keyof Theme['colors'],
  props?: { light?: string; dark?: string }
) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = getTheme(colorScheme);

  // Check if a specific override for the current color scheme is provided
  const colorFromProps = props?.[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  }

  // Otherwise, return the color from the global theme object
  return theme.colors[colorName];
}
