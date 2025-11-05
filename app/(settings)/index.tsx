import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const surfaceColor = useThemeColor('surface');
  const mutedColor = useThemeColor('muted');

  return (
    <ThemedView style={[styles.screen, { backgroundColor }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText type="h2">Settings</ThemedText>
      </View>

      <View style={styles.listContainer}>
        <TouchableOpacity
          style={[styles.listItem, { backgroundColor: surfaceColor }]}
          onPress={() => router.push('/(settings)/medications')}
        >
          <MaterialIcons name="medication" size={24} color={textColor} />
          <ThemedText style={styles.listItemText}>Medications</ThemedText>
          <MaterialIcons name="chevron-right" size={24} color={mutedColor} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
  },
});
