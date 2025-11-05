
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const primaryColor = useThemeColor('primary');
  const mutedColor = useThemeColor('muted');
  const primaryTextColor = useThemeColor('primaryText');

  const handleGetStarted = () => {
    router.push('/(public)/welcome-tour');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.backgroundGraphic1} />
      <View style={styles.backgroundGraphic2} />
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <IconSymbol name="brain.head.profile" size={40} color={primaryColor} />
        </View>
        <ThemedText type="title" style={styles.headline}>
          SeizureMate: Your calm companion for tracking and understanding seizures.
        </ThemedText>
        <ThemedText style={styles.bodyText}>
          A private and simple way to manage your seizure information.
        </ThemedText>
      </View>
      <View style={styles.footer}>
        <ThemedText style={[styles.metaText, { color: mutedColor }]}>
          A step toward understanding.
        </ThemedText>
        <TouchableOpacity style={[styles.button, { backgroundColor: primaryColor }]} onPress={handleGetStarted}>
          <Text style={[styles.buttonText, { color: primaryTextColor }]}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  backgroundGraphic1: {
    position: 'absolute',
    top: '-20%',
    left: '-30%',
    width: height * 0.8,
    height: height * 0.8,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: (height * 0.8) / 2,
  },
  backgroundGraphic2: {
    position: 'absolute',
    bottom: '-30%',
    right: '-40%',
    width: height * 0.7,
    height: height * 0.7,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: (height * 0.7) / 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    textAlign: 'center',
    maxWidth: 300,
  },
  bodyText: {
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  metaText: {
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 448, // max-w-md
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
