import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export interface DisplaySettings {
  calmMode: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  textSizeMultiplier: number;
}

interface DisplaySettingsContextType extends DisplaySettings {
  setCalmMode: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
  setTextSizeMultiplier: (value: number) => void;
}

const DisplaySettingsContext = createContext<DisplaySettingsContextType | undefined>(undefined);

export const DisplaySettingsProvider = ({ children }: { children: ReactNode }) => {
  const [calmMode, setCalmMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1);

  const value = useMemo(
    () => ({
      calmMode,
      highContrast,
      reduceMotion,
      textSizeMultiplier,
      setCalmMode,
      setHighContrast,
      setReduceMotion,
      setTextSizeMultiplier,
    }),
    [calmMode, highContrast, reduceMotion, textSizeMultiplier]
  );

  return <DisplaySettingsContext.Provider value={value}>{children}</DisplaySettingsContext.Provider>;
};

export const useDisplaySettings = () => {
  const context = useContext(DisplaySettingsContext);
  if (context === undefined) {
    throw new Error('useDisplaySettings must be used within a DisplaySettingsProvider');
  }
  return context;
};

/**
 * Converts a slider value (0-100) to a text size multiplier.
 * 50 corresponds to a multiplier of 1 (default size).
 * @param sliderValue - The value from the slider, between 0 and 100.
 * @returns The calculated text size multiplier (e.g., 0.8 to 1.5).
 */
export const sliderToMultiplier = (sliderValue: number) => 0.8 + (sliderValue / 100) * 0.7;

/**
 * Converts a text size multiplier back to a slider value (0-100).
 * @param multiplier - The text size multiplier.
 * @returns The corresponding value for the slider.
 */
export const multiplierToSlider = (multiplier: number) => ((multiplier - 0.8) / 0.7) * 100;