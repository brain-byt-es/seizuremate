import { Text } from '@/components/nativewindui/Text';
import {
  multiplierToSlider,
  sliderToMultiplier,
  useDisplaySettings,
} from '@/contexts/DisplaySettingsContext';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

export default function AccessibilityAndDisplayScreen() {
  const {
    calmMode,
    setCalmMode,
    highContrast,
    setHighContrast,
    reduceMotion,
    setReduceMotion,
    textSizeMultiplier,
    setTextSizeMultiplier,
  } = useDisplaySettings();

  const handleSliderChange = (value: number) => {
    setTextSizeMultiplier(sliderToMultiplier(value));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Display Section */}
      <Text variant="title2" className="mt-6 mb-3">Display</Text>
      <View className="overflow-hidden rounded-xl bg-card">
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Ionicons name="color-palette-outline" size={24} className="text-primary" />
            </View>
            <View>
              <Text variant="body">Calm Mode</Text>
              <Text variant="heading">Calm Mode</Text>
              <Text variant="body">Calm Mode</Text>
              <Text variant="subhead" color="secondary">Simplify colors and reduce visual intensity.</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: 'hsl(var(--primary))' }}
            thumbColor={'#f4f3f4'}
            onValueChange={setCalmMode}
            value={calmMode}
          />
        </View>
      </View>

      {/* Text Section */}
      <Text variant="title2" className="mt-6 mb-3">Text</Text>
      <View className="overflow-hidden rounded-xl bg-card p-4">
        <Text className="py-2 text-center" style={{ fontSize: 18 * textSizeMultiplier }}>
          This is how text will appear.
        </Text>
        <View style={styles.sliderContainer}>
          <Ionicons name="text" size={20} className="text-muted-foreground" />
          <Slider
            style={{ flex: 1, height: 40 }}
            minimumValue={0}
            maximumValue={100}
            value={multiplierToSlider(textSizeMultiplier)}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="hsl(var(--primary))"
            maximumTrackTintColor="hsl(var(--border))"
          />
          <Ionicons name="text" size={28} className="text-muted-foreground" />
        </View>
      </View>

      {/* Visuals Section */}
      <Text variant="title2" className="mt-6 mb-3">Visuals</Text>
      <View className="overflow-hidden rounded-xl bg-card">
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Ionicons name="contrast-outline" size={24} className="text-primary" />
            </View>
            <View>
              <Text variant="body">High Contrast</Text>
              <Text variant="heading">High Contrast</Text>
              <Text variant="body">High Contrast</Text>
              <Text variant="subhead" color="secondary">Increase text and interface contrast.</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: 'hsl(var(--primary))' }}
            thumbColor={'#f4f3f4'}
            onValueChange={setHighContrast}
            value={highContrast}
          />
        </View>
        <View style={[styles.row, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'hsl(var(--border))' }]}>
          <View style={styles.rowLeft}>
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Ionicons name="flash-off-outline" size={24} className="text-primary" />
            </View>
            <View>
              <Text variant="body">Reduce Motion</Text>
              <Text variant="heading">Reduce Motion</Text>
              <Text variant="body">Reduce Motion</Text>
              <Text variant="subhead" color="secondary">Limit animations and effects in the app.</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: 'hsl(var(--primary))' }}
            thumbColor={'#f4f3f4'}
            onValueChange={setReduceMotion}
            value={reduceMotion}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
