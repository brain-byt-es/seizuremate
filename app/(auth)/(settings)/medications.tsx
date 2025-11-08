import { Text } from '@/components/nativewindui/Text';
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

  const handleEdit = () => {
    router.push({
      pathname: '/(modal)/medication-form',
      params: { med: JSON.stringify(med) },
    });
  };

  return (
    <View className="flex-row items-center gap-4 rounded-xl bg-card p-4 shadow-sm">
      <View style={styles.cardContent}>
        <Text variant="bodySemibold" className="text-card-foreground">{med.name}</Text>
        <Text className="mt-1 text-sm text-muted-foreground">{med.dosage}</Text>
        <Text className="mt-1 text-sm text-muted-foreground">{med.schedule}</Text>
      </View>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={handleEdit}
      >
        <MaterialIcons name="more-vert" size={24} className="text-muted-foreground" />
      </TouchableOpacity>
    </View>
  );
};

export default function MedicationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} className="text-foreground" />
        </TouchableOpacity>
        <Text variant="title3" className="flex-1 text-center">Medications</Text>
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
        className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        onPress={() => router.push('/(modal)/medication-form')}
      >
        <MaterialIcons name="add" size={30} className="text-primary-foreground" />
      </TouchableOpacity>
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
    height: 64,
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});