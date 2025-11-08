import { Text } from '@/components/nativewindui/Text';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FormInput = ({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) => {
  return (
    <View style={styles.inputFieldWrapper}>
      <Text className="mb-2 text-base font-medium">{label}</Text>
      <TextInput
        className="h-14 rounded-xl border border-border bg-card p-4 text-base text-foreground"
        placeholderTextColor="hsl(var(--muted-foreground))"
        {...props}
      />
    </View>
  );
};

const ToggleRow = ({ label, description, value, onValueChange }: { label: string, description: string, value: boolean, onValueChange: (value: boolean) => void }) => {
  return (
    <View className="mb-3 flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
      <View style={styles.toggleTextContainer}>
        <Text className="font-medium text-foreground">{label}</Text>
        <Text className="text-sm text-muted-foreground">{description}</Text>
      </View>
      <Switch
        trackColor={{ false: '#767577', true: 'hsl(var(--primary))' }}
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
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: 'hsl(var(--border))' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} className="text-foreground" />
        </TouchableOpacity>
        <Text variant="title3" className="flex-1 text-center">{isEditing ? 'Edit' : 'Add'} Medication</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Medication Details */}
        <View>
          <Text className="mb-2 px-1 text-xs font-bold uppercase text-muted-foreground">Medication Details</Text>
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
          <Text className="mb-2 px-1 text-xs font-bold uppercase text-muted-foreground">Schedule & Reminders</Text>
          <View style={styles.inputFieldWrapper}>
            <Text className="mb-2 text-base font-medium">Frequency</Text>
            <TouchableOpacity className="h-14 flex-row items-center justify-between rounded-xl border border-border bg-card p-4">
              <Text>Every 8 hours</Text>
              <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
            </TouchableOpacity>
          </View>
          <ToggleRow label="Reminders" description="Receive a notification when it's time." value={reminders} onValueChange={setReminders} />
          <ToggleRow label="Quiet Hours" description="Mute notifications during specific times." value={quietHours} onValueChange={setQuietHours} />
        </View>

        {/* Delete Button */}
        {isEditing && (
          <View style={styles.deleteContainer}>
            <TouchableOpacity onPress={handleDelete}>
              <Text className="font-medium text-destructive">Delete Medication</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 p-4 pt-4 pb-8">
        <TouchableOpacity className="h-14 items-center justify-center rounded-full bg-primary" onPress={handleSave}>
          <Text variant="bodySemibold" className="text-primary-foreground">Save Medication</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Space for save button
  },
  section: {
    marginTop: 24,
  },
  inputFieldWrapper: {
    marginBottom: 16,
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
});