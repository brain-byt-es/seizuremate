/**
 * SeizureMate Design Tokens — single-file theme
 * - Brand tokens
 * - Light/Dark palettes
 * - Semantic colors
 * - Spacing, radius, shadow, motion
 * - Typography
 * - Calm Mode support (reduced motion + boosted contrast)
 * - Backwards-compatible Colors + Fonts exports
 */

import { Platform } from "react-native";

// -----------------------------------------------------------------------------
// 1) Brand Tokens (raw)
// -----------------------------------------------------------------------------
const BRAND = {
  clarityBlue: "#3B82F6",   // primary
  supportSage: "#7FA08C",   // calm/stability
  accentCoral: "#D5705D",   // gentle emphasis
  neutralSand: "#F5F1E9",   // base background (light)
  contrastTaupe: "#4F4B42", // primary text/icon
  // Dark-mode neutrals
  darkInk: "#141a1e",
  darkTaupe: "#2A2725",
  mistGrey: "#CFCAC6",
  white: "#E2E8F0",
};

// Helpful aliases for charts
export const ChartColors = {
  frequency: BRAND.clarityBlue,
  sleep: BRAND.supportSage,
  attention: BRAND.accentCoral,
};

// -----------------------------------------------------------------------------
// 2) Palettes by mode (UI-level colors)
// -----------------------------------------------------------------------------
const PALETTE = {
  light: {
    text: BRAND.contrastTaupe,
    background: BRAND.neutralSand,
    surface: "#F7F6F3",
    surfaceAlt: "#F2F5F5",
    border: "#D8D4CF",
    primary: BRAND.clarityBlue,
    primaryText: BRAND.white,
    accent: BRAND.accentCoral,
    accentText: BRAND.white,
    muted: "#8A8682",
    // icons & states
    icon: "#6F6A66",
    success: BRAND.supportSage,
    warning: BRAND.accentCoral,
    // tabs
    tabIconDefault: "#8E8A86",
    tabIconSelected: BRAND.clarityBlue,
  },
  dark: {
    text: BRAND.white,
    background: BRAND.darkInk,
    surface: BRAND.darkTaupe,
    surfaceAlt: "#23201E",
    border: "#3B3734",
    primary: "#7AB4DA", // lifted blue for contrast in dark
    primaryText: BRAND.darkInk,
    accent: "#E88A79",
    accentText: BRAND.darkInk,
    muted: BRAND.mistGrey,
    icon: BRAND.mistGrey,
    success: "#A4C0AF",
    warning: "#E88A79",
    tabIconDefault: "#A39E99",
    tabIconSelected: "#7AB4DA",
  },
} as const;

// -----------------------------------------------------------------------------
// 3) Design tokens (spacing, radius, motion, typography)
// -----------------------------------------------------------------------------
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 8, md: 16, lg: 24, xl: 28 } as const;
export const shadow = {
  light: "0px 4px 12px rgba(0,0,0,0.08)",
  dark: "0px 4px 12px rgba(0,0,0,0.35)",
} as const;

export const motion = {
  duration: { fast: 120, normal: 200, slow: 280 },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    inOut: "ease-in-out",
  },
} as const;

// Typography scale (Inter recommended)
export const Typography = {
  h1: { fontSize: 28, fontWeight: "600" as const, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: "600" as const, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: "600" as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  small: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
};

// -----------------------------------------------------------------------------
// 4) Backwards-compatible Colors export (keeps your existing imports working)
// -----------------------------------------------------------------------------
export const Colors = {
  light: {
    text: PALETTE.light.text,
    background: PALETTE.light.background,
    tint: PALETTE.light.primary,
    icon: PALETTE.light.icon,
    tabIconDefault: PALETTE.light.tabIconDefault,
    tabIconSelected: PALETTE.light.tabIconSelected,
  },
  dark: {
    text: PALETTE.dark.text,
    background: PALETTE.dark.background,
    tint: PALETTE.dark.primary,
    icon: PALETTE.dark.icon,
    tabIconDefault: PALETTE.dark.tabIconDefault,
    tabIconSelected: PALETTE.dark.tabIconSelected,
  },
} as const;

// -----------------------------------------------------------------------------
// 5) Fonts export (kept from your original file)
// -----------------------------------------------------------------------------
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// -----------------------------------------------------------------------------
// 6) Theme types + helper to assemble theme by mode + calmMode
// -----------------------------------------------------------------------------
export type ColorScheme = "light" | "dark";

export type Theme = {
  mode: ColorScheme;
  colors: {
    text: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    primary: string;
    primaryText: string;
    accent: string;
    accentText: string;
    muted: string;
    icon: string;
    success: string;
    warning: string;
    tabIconDefault: string;
    tabIconSelected: string;
  };
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
  motion: typeof motion & { reducedMotion: boolean };
  typography: typeof Typography;
  chart: typeof ChartColors;
};

/**
 * getTheme
 * @param scheme - 'light' | 'dark'
 * @param calmMode - when true: reduce motion + slightly increase contrast
 */
export function getTheme(scheme: ColorScheme = "light", calmMode = false): Theme {
  const p = PALETTE[scheme];

  // Optional contrast tweak for Calm Mode: nudge text vs. background
  const text = calmMode
    ? scheme === "light"
      ? "#3E3A38" // slightly darker than taupe for readability
      : "#F2F2F2" // slightly brighter in dark
    : p.text;

  const background = calmMode
    ? scheme === "light"
      ? BRAND.neutralSand
      : BRAND.darkInk
    : p.background;

  return {
    mode: scheme,
    colors: {
      text,
      background,
      surface: p.surface,
      surfaceAlt: p.surfaceAlt,
      border: p.border,
      primary: p.primary,
      primaryText: p.primaryText,
      accent: p.accent,
      accentText: p.accentText,
      muted: p.muted,
      icon: p.icon,
      success: p.success,
      warning: p.warning,
      tabIconDefault: p.tabIconDefault,
      tabIconSelected: p.tabIconSelected,
    },
    spacing,
    radius,
    shadow,
    motion: {
      ...motion,
      reducedMotion: !!calmMode, // consumer can check and skip animations
    },
    typography: Typography,
    chart: ChartColors,
  };
}

// -----------------------------------------------------------------------------
// 7) Optional: default theme (light, calmMode off) for non-hook usage
// -----------------------------------------------------------------------------
export const DefaultTheme = getTheme("light", false);
