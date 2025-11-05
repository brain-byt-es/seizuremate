import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing, radius, Typography } from '@/constants/theme';

export type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
};

export function ThemedButton({ title, onPress, variant = 'primary', loading = false, disabled = false }: ThemedButtonProps) {
  let bgName: keyof Theme['colors'];
  let colorName: keyof Theme['colors'];

  switch (variant) {
    case 'secondary':
      bgName = 'surfaceAlt';
      colorName = 'text';
      break;
    case 'danger':
      bgName = 'warning';
      colorName = 'accentText';
      break;
    case 'primary':
    default:
      bgName = 'primary';
      colorName = 'primaryText';
      break;
  }

  const backgroundColor = useThemeColor(bgName);
  const textColor = useThemeColor(colorName);


  const buttonStyles = {
    ...styles.button,
    backgroundColor,
    opacity: disabled || loading ? 0.7 : 1,
  };

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.body,
    fontWeight: '600',
  },
});
