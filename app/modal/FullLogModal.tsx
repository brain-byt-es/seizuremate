import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { spacing, radius, Typography } from '@/constants/theme';
import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';

export default function FullLogModal() {
  const router = useRouter();
  const { logType } = useLocalSearchParams();

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const primaryTextColor = useThemeColor('primaryText');
  const surfaceColor = useThemeColor('surface');
  const surfaceAltColor = useThemeColor('surfaceAlt');
  const borderColor = useThemeColor('border');
  const mutedColor = useThemeColor('muted');
  const successColor = useThemeColor('success');

  // State for form fields
  const [seizureType, setSeizureType] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('10:32 AM, Today');
  const [duration, setDuration] = useState<string>('1 min 45 sec');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [medicationsTaken, setMedicationsTaken] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [confidence, setConfidence] = useState<string>('75'); // Using string for TextInput

  const toggleSelection = (list: string[], item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const renderChip = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const isSelected = list.includes(item);
    return (
      <TouchableOpacity
        key={item}
        style={[
          styles.chip,
          isSelected
            ? { borderColor: successColor, backgroundColor: successColor + '1A' } // 1A is ~10% opacity
            : { borderColor: borderColor, backgroundColor: surfaceColor },
        ]}
        onPress={() => toggleSelection(list, item, setList)}
      >
        <Text style={[styles.chipText, isSelected ? { color: successColor } : { color: textColor }]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      {/* Top App Bar */}
      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="h3" style={styles.headerTitle}>Log a {logType || 'Seizure'}</ThemedText>
        <View style={styles.backButton} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Seizure Type Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Seizure Type</ThemedText>
          <View style={[styles.segmentedControl, { backgroundColor: surfaceAltColor }]}>
            {[ 'Tonic-clonic', 'Absence', 'Focal' ].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.segmentedControlOption,
                  seizureType === type && { backgroundColor: surfaceColor, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
                ]}
                onPress={() => setSeizureType(type)}
              >
                <Text style={[styles.segmentedControlText, seizureType === type ? { color: textColor } : { color: primaryColor }]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time & Duration Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Time & Duration</ThemedText>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: textColor }]}>Start Time</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: surfaceColor, borderColor: borderColor, color: textColor }]}
                placeholder="Now"
                placeholderTextColor={mutedColor}
                value={startTime}
                onChangeText={setStartTime}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: textColor }]}>Duration</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: surfaceColor, borderColor: borderColor, color: textColor }]}
                placeholder="e.g., 5 min"
                placeholderTextColor={mutedColor}
                value={duration}
                onChangeText={setDuration}
              />
            </View>
          </View>
        </View>

        {/* Triggers Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Triggers</ThemedText>
          <View style={styles.chipContainer}>
            {[ 'Stress', 'Lack of Sleep', 'Flashing Lights', 'Missed Meds', 'Fever', 'Alcohol' ].map((trigger) =>
              renderChip(trigger, selectedTriggers, setSelectedTriggers)
            )}
          </View>
        </View>

        {/* Symptoms Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Symptoms</ThemedText>
          <View style={styles.chipContainer}>
            {[ 'Confusion', 'Muscle Jerks', 'Loss of Awareness', 'Staring Spell', 'Fatigue' ].map((symptom) =>
              renderChip(symptom, selectedSymptoms, setSelectedSymptoms)
            )}
          </View>
        </View>

        {/* Medications Section */}
        <View style={styles.section}>
          <Collapsible title="Medications Taken">
            <TextInput
              style={[styles.textInput, { backgroundColor: surfaceColor, borderColor: borderColor, color: textColor }]}
              placeholder="e.g., Keppra 500mg"
              placeholderTextColor={mutedColor}
              value={medicationsTaken}
              onChangeText={setMedicationsTaken}
            />
          </Collapsible>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notes</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: surfaceColor, borderColor: borderColor, color: textColor }]}
            placeholder="Add any extra details..."
            placeholderTextColor={mutedColor}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Confidence Level Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>How sure are you of these details?</Text>
          {/* Placeholder for Slider - A proper slider component would be ideal here */}
          <TextInput
            style={[styles.textInput, { backgroundColor: surfaceAltColor, borderColor: borderColor, color: textColor, marginTop: spacing.md }]}
            placeholder="e.g., 75%"
            placeholderTextColor={mutedColor}
            value={confidence}
            onChangeText={setConfidence}
            keyboardType="numeric"
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, { color: mutedColor }]}>Not Sure</Text>
            <Text style={[styles.sliderLabel, { color: mutedColor }]}>Very Sure</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { backgroundColor }]}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: primaryColor }]}>
          <Text style={[styles.saveButtonText, { color: primaryTextColor }]}>Review & Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Will be overridden by theme
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl * 2, // Extra padding for footer button
  },
  section: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: spacing.sm,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  segmentedControlOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  segmentedControlText: {
    ...Typography.body,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  inputWrapper: {
    flex: 1,
    minWidth: 120,
  },
  inputLabel: {
    ...Typography.small,
    marginBottom: spacing.xs,
  },
  textInput: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    ...Typography.body,
    minHeight: 56, // h-14 equivalent
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipText: {
    ...Typography.small,
    fontWeight: '500',
  },
  textArea: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    ...Typography.body,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  sliderLabel: {
    ...Typography.caption,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'transparent', // Will be overridden by theme
  },
  saveButton: {
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  saveButtonText: {
    ...Typography.body,
    fontWeight: 'bold',
  },
});
