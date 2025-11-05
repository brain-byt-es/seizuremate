import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing, radius, Typography } from '@/constants/theme';

type LogState = 'idle' | 'running' | 'finished';

export default function LogScreen() {
  const [logState, setLogState] = useState<LogState>('idle');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const primaryColor = useThemeColor('primary');
  const accentColor = useThemeColor('accent');
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const mutedColor = useThemeColor('muted');
  const surfaceAltColor = useThemeColor('surfaceAlt');

  const successMessageOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    let interval: number;
    if (logState === 'running' && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    } else if (logState === 'finished') {
      // Optionally save the log here
      console.log('Seizure Log:', { duration: elapsedTime, note });
      setShowSuccessMessage(true);
      Animated.timing(successMessageOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(successMessageOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setShowSuccessMessage(false));
        }, 3000); // Show success message for 3 seconds
      });
      setLogState('idle'); // Reset to idle after showing success
      setElapsedTime(0);
      setNote('');
      setStartTime(null);
    }
    return () => clearInterval(interval);
  }, [logState, startTime, elapsedTime, note, successMessageOpacity]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartSeizure = () => {
    setStartTime(new Date());
    setLogState('running');
  };

  const handleEndSeizure = () => {
    setLogState('finished');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {showSuccessMessage && (
        <Animated.View style={[styles.successMessage, { backgroundColor: primaryColor, opacity: successMessageOpacity }]}>
          <MaterialIcons name="check-circle" size={20} color={textColor} />
          <Text style={[styles.successMessageText, { color: textColor }]}>Log saved — you’re building awareness.</Text>
        </Animated.View>
      )}

      {logState === 'idle' && (
        <View style={styles.centerContent}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: primaryColor }]}
            onPress={handleStartSeizure}
          >
            <Text style={[styles.actionButtonText, { color: 'white' }]}>Start Seizure</Text>
          </TouchableOpacity>
          <Text style={[styles.hintText, { color: mutedColor }]}>Tap to start timing</Text>
        </View>
      )}

      {logState === 'running' && (
        <View style={styles.centerContent}>
          <Text style={[styles.timerText, { color: textColor }]}>{formatTime(elapsedTime)}</Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: accentColor }]}
            onPress={handleEndSeizure}
          >
            <Text style={[styles.actionButtonText, { color: 'white' }]}>End Seizure</Text>
          </TouchableOpacity>
          <View style={styles.noteContainer}>
            <TextInput
              style={[styles.noteInput, { backgroundColor: surfaceAltColor, color: textColor }]}
              placeholder="How are you feeling?"
              placeholderTextColor={mutedColor}
              multiline
              numberOfLines={3}
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  actionButton: {
    height: 192, // 48 * 4
    width: 192,  // 48 * 4
    borderRadius: radius.xl * 4, // Make it circular
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  actionButtonText: {
    ...Typography.h2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintText: {
    ...Typography.small,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  timerText: {
    ...Typography.h1,
    fontSize: 56, // Adjusted to be closer to 7xl from HTML
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },
  noteContainer: {
    width: '100%',
    maxWidth: 350, // Equivalent to max-w-sm
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
  },
  noteInput: {
    borderRadius: radius.md,
    padding: spacing.md,
    textAlignVertical: 'top',
    minHeight: 100,
    ...Typography.body,
  },
  successMessage: {
    position: 'absolute',
    top: spacing.xl * 2, // Adjusted from top-16
    width: '90%',
    maxWidth: 350,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: radius.xl,
    zIndex: 10,
  },
  successMessageText: {
    ...Typography.small,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
});