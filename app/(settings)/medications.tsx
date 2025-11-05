import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useThemeShadow } from '@/hooks/use-theme-shadow';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_MEDICATIONS = [
  {
    name: 'Levetiracetam',
    dosage: '500 mg Tablet',
    schedule: 'Twice daily - 8:00 AM, 8:00 PM',
  },
  {
    name: 'Lamotrigine',
    dosage: '100 mg Tablet',
    schedule: 'Once daily - 9:00 AM',
  },
];

const MedicationCard = ({ med }: { med: typeof MOCK_MEDICATIONS[0] }) => {
  const router = useRouter();
  const cardColor = useThemeColor('surface');
  const textColor = useThemeColor('text');
  const mutedColor = useThemeColor('muted');
  const boxShadow = useThemeShadow();

  // The useThemeShadow hook returns a string for web and an object for native.
  const shadowStyle = typeof boxShadow === 'string' ? { boxShadow } : boxShadow;

  const handleEdit = () => {
    router.push({
      pathname: '/(modal)/medication-form',
      params: { med: JSON.stringify(med) },
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: cardColor }, shadowStyle]}>
      <View style={styles.cardContent}>
        <ThemedText type="defaultSemiBold" style={{ color: textColor }}>{med.name}</ThemedText>
        <ThemedText style={[styles.cardText, { color: mutedColor }]}>{med.dosage}</ThemedText>
        <ThemedText style={[styles.cardText, { color: mutedColor }]}>{med.schedule}</ThemedText>
      </View>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={handleEdit}
      >
        <MaterialIcons name="more-vert" size={24} color={mutedColor} />
      </TouchableOpacity>
    </View>
  );
};

export default function MedicationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const primaryTextColor = useThemeColor('primaryText');

  return (
    <ThemedView style={[styles.screen, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="h3" style={styles.headerTitle}>Medications</ThemedText>
        <View style={styles.headerButton} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {MOCK_MEDICATIONS.map((med, index) => (
          <MedicationCard key={index} med={med} />
        ))}
        {/* Empty state can be added here conditionally */}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primaryColor }]}
        onPress={() => router.push('/(modal)/medication-form')}
      >
        <MaterialIcons name="add" size={30} color={primaryTextColor} />
      </TouchableOpacity>
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
    height: 64,
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
    paddingVertical: 8,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 12,
    padding: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 14,
    marginTop: 4,
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 96, // Adjust to be above the tab bar
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});