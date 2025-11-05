import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FormInput = ({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) => {
  const textColor = useThemeColor('text');
  const placeholderColor = useThemeColor('muted');
  const borderColor = useThemeColor('border');
  const inputBackgroundColor = useThemeColor('surface');

  return (
    <View style={styles.inputFieldWrapper}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        style={[styles.input, { borderColor, color: textColor, backgroundColor: inputBackgroundColor }]}
        placeholderTextColor={placeholderColor}
        {...props}
      />
    </View>
  );
};

const ToggleRow = ({ label, description, value, onValueChange }: { label: string, description: string, value: boolean, onValueChange: (value: boolean) => void }) => {
  const surfaceColor = useThemeColor('surface');
  const textColor = useThemeColor('text');
  const mutedColor = useThemeColor('muted');
  const primaryColor = useThemeColor('primary');
  const borderColor = useThemeColor('border');

  return (
    <View style={[styles.toggleRow, { backgroundColor: surfaceColor, borderColor }]}>
      <View style={styles.toggleTextContainer}>
        <ThemedText style={{ color: textColor, fontWeight: '500' }}>{label}</ThemedText>
        <ThemedText style={{ color: mutedColor, fontSize: 14 }}>{description}</ThemedText>
      </View>
      <Switch
        trackColor={{ false: '#767577', true: primaryColor }}
        thumbColor={'#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

export default function MedicationFormModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Determine if we are editing or creating
  const isEditing = !!params.med;
  const medToEdit = isEditing ? JSON.parse(params.med as string) : null;

  const [name, setName] = useState(medToEdit?.name || '');
  const [dosage, setDosage] = useState(medToEdit?.dosage || '');
  const [reminders, setReminders] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const primaryTextColor = useThemeColor('primaryText');
  const mutedColor = useThemeColor('muted');
  const borderColor = useThemeColor('border');

  const handleSave = () => {
    Alert.alert('Save Medication', `Name: ${name}, Dosage: ${dosage}`);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Medication', 'Are you sure you want to delete this medication?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="h3" style={styles.headerTitle}>{isEditing ? 'Edit' : 'Add'} Medication</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Medication Details */}
        <View>
          <Text style={[styles.sectionTitle, { color: mutedColor }]}>Medication Details</Text>
          <FormInput
            label="Medication Name"
            placeholder="e.g., Lamotrigine"
            value={name}
            onChangeText={setName}
          />
          <FormInput
            label="Dosage"
            placeholder="e.g., 50 mg or 1 tablet"
            value={dosage}
            onChangeText={setDosage}
          />
        </View>

        {/* Schedule & Reminders */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: mutedColor }]}>Schedule & Reminders</Text>
          <View style={styles.inputFieldWrapper}>
            <ThemedText style={styles.inputLabel}>Frequency</ThemedText>
            <TouchableOpacity style={[styles.input, { borderColor, backgroundColor: useThemeColor('surface'), justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}>
              <ThemedText>Every 8 hours</ThemedText>
              <MaterialIcons name="chevron-right" size={24} color={mutedColor} />
            </TouchableOpacity>
          </View>
          <ToggleRow label="Reminders" description="Receive a notification when it's time." value={reminders} onValueChange={setReminders} />
          <ToggleRow label="Quiet Hours" description="Mute notifications during specific times." value={quietHours} onValueChange={setQuietHours} />
        </View>

        {/* Delete Button */}
        {isEditing && (
          <View style={styles.deleteContainer}>
            <TouchableOpacity onPress={handleDelete}>
              <ThemedText style={{ color: 'red', fontWeight: '500' }}>Delete Medication</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.saveButtonContainer, { borderTopColor: borderColor }]}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: primaryColor }]} onPress={handleSave}>
          <ThemedText type="defaultSemiBold" style={{ color: primaryTextColor }}>Save Medication</ThemedText>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Set dynamically
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Space for save button
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  inputFieldWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  toggleTextContainer: {
    flex: 1,
    gap: 4,
  },
  deleteContainer: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32, // Extra padding for home bar
    borderTopWidth: 1,
    backgroundColor: 'rgba(245, 241, 233, 0.8)', // From your theme, with opacity
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});