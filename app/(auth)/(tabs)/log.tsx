import { Text } from '@/components/nativewindui/Text';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type LogState = 'idle' | 'running' | 'finished';

export default function LogScreen() {
  const [logState, setLogState] = useState<LogState>('idle');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

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
    <View className="flex-1 items-center justify-center bg-background p-4">
      {showSuccessMessage && (
        <Animated.View className="absolute top-16 z-10 w-[90%] max-w-sm flex-row items-center justify-center rounded-3xl bg-primary p-2" style={{ opacity: successMessageOpacity }}>
          <MaterialIcons name="check-circle" size={20} className="text-primary-foreground" />
          <Text className="ml-1 text-sm font-medium text-primary-foreground">Log saved — you’re building awareness.</Text>
        </Animated.View>
      )}

      {logState === 'idle' && (
        <View className="flex-1 items-center justify-center w-full">
          <TouchableOpacity
            className="h-48 w-48 items-center justify-center rounded-full bg-primary shadow-lg"
            onPress={handleStartSeizure}
          >
            <Text variant="title2" className="font-bold text-primary-foreground">Start Seizure</Text>
          </TouchableOpacity>
          <Text className="mt-2 text-sm text-muted-foreground">Tap to start timing</Text>
        </View>
      )}

      {logState === 'running' && (
        <View className="flex-1 items-center justify-center w-full">
          <Text className="mb-8 text-6xl font-bold">{formatTime(elapsedTime)}</Text>
          <TouchableOpacity
            className="h-48 w-48 items-center justify-center rounded-full bg-accent shadow-lg"
            onPress={handleEndSeizure}
          >
            <Text variant="title2" className="font-bold text-accent-foreground">End Seizure</Text>
          </TouchableOpacity>
          <View style={styles.noteContainer}>
            <TextInput
              className="min-h-[100px] rounded-xl bg-card p-4 text-base text-foreground"
              placeholder="How are you feeling?"
              placeholderTextColor="hsl(var(--muted-foreground))"
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
  noteContainer: {
    width: '100%',
    maxWidth: 350, // Equivalent to max-w-sm
    paddingHorizontal: 16,
    marginTop: 32,
  },
});