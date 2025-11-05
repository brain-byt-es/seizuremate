import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { spacing, radius, Typography } from '@/constants/theme';

export default function LogSelectionModal() {
  const router = useRouter();
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const surfaceColor = useThemeColor('surface');
  const borderColor = useThemeColor('border');

  const handleSelectLogType = (type: string) => {
    router.push({ pathname: '/modal/FullLogModal', params: { logType: type } });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.modalContent, { backgroundColor: surfaceColor, borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>What would you like to log?</Text>

        <TouchableOpacity
          style={[styles.optionButton, { borderColor: borderColor }]}
          onPress={() => handleSelectLogType('Seizure')}
        >
          <MaterialIcons name="medical-information" size={24} color={primaryColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Seizure</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, { borderColor: borderColor }]}
          onPress={() => handleSelectLogType('Medication')}
        >
          <MaterialIcons name="medication" size={24} color={primaryColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Medication</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, { borderColor: borderColor }]}
          onPress={() => handleSelectLogType('Aura')}
        >
          <MaterialIcons name="flare" size={24} color={primaryColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Aura</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: borderColor }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, { color: primaryColor }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background for modal overlay
  },
  modalContent: {
    width: '80%',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  title: {
    ...Typography.h2,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  optionText: {
    ...Typography.body,
    marginLeft: spacing.md,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.body,
    fontWeight: 'bold',
  },
});
