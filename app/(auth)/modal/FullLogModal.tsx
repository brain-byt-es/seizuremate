import { Text } from '@/components/nativewindui/Text';
import { Collapsible } from '@/components/ui/collapsible';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

export default function FullLogModal() {
  const router = useRouter();
  const { logType } = useLocalSearchParams();

  // State for form fields
  const [seizureType, setSeizureType] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('10:32 AM, Today');
  const [duration, setDuration] = useState<string>('1 min 45 sec');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [confidence, setConfidence] = useState<string>('75'); // Using string for TextInput

  const toggleSelection = (list: string[], item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList((currentList) =>
      currentList.includes(item) ? currentList.filter((i) => i !== item) : [...currentList, item]
    );
  };

  const renderChip = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const isSelected = list.includes(item);
    return (
      <TouchableOpacity
        key={item}
        className={`rounded-full border px-4 py-2 ${
          isSelected ? 'border-success bg-success/10' : 'border-border bg-card'
        }`}
        onPress={() => toggleSelection(list, item, setList)}
      >
        <Text className={`text-sm font-medium ${isSelected ? 'text-success' : 'text-foreground'}`}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between bg-background px-4 py-2">
        <TouchableOpacity className="h-10 w-10 items-center justify-center" onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} className="text-foreground" />
        </TouchableOpacity>
        <Text variant="title3" className="flex-1 text-center">Log a {logType || 'Seizure'}</Text>
        <View className="h-10 w-10" /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>
        {/* Seizure Type Section */}
        <View className="py-2">
          <Text variant="title3" className="mb-2">Seizure Type</Text>
          <View className="flex-row rounded-lg bg-muted p-1">
            {[ 'Tonic-clonic', 'Absence', 'Focal' ].map((type) => (
              <TouchableOpacity
                key={type}
                className={`flex-1 items-center justify-center rounded-md py-2 ${
                  seizureType === type ? 'bg-card shadow-sm' : ''
                }`}
                onPress={() => setSeizureType(type)}
              >
                <Text className={`font-medium ${seizureType === type ? 'text-foreground' : 'text-primary'}`}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time & Duration Section */}
        <View className="py-2">
          <Text variant="title3" className="mb-2">Time & Duration</Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="mb-1 text-xs text-foreground">Start Time</Text>
              <TextInput
                className="min-h-[56px] rounded-lg border border-border bg-card p-4 text-foreground"
                placeholder="Now"
                placeholderTextColor="hsl(var(--muted-foreground))"
                value={startTime}
                onChangeText={setStartTime}
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs text-foreground">Duration</Text>
              <TextInput
                className="min-h-[56px] rounded-lg border border-border bg-card p-4 text-foreground"
                placeholder="e.g., 5 min"
                placeholderTextColor="hsl(var(--muted-foreground))"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
          </View>
        </View>

        {/* Triggers & Symptoms Sections */}
        {[
          { title: 'Triggers', items: [ 'Stress', 'Lack of Sleep', 'Flashing Lights', 'Missed Meds', 'Fever', 'Alcohol' ], state: selectedTriggers, setState: setSelectedTriggers },
          { title: 'Symptoms', items: [ 'Confusion', 'Muscle Jerks', 'Loss of Awareness', 'Staring Spell', 'Fatigue' ], state: selectedSymptoms, setState: setSelectedSymptoms },
        ].map(({ title, items, state, setState }) => (
          <View key={title} className="py-2">
            <Text variant="title3" className="mb-2">{title}</Text>
            <View className="flex-row flex-wrap gap-2">
              {items.map((item) => renderChip(item, state, setState))}
            </View>
          </View>
        ))}

        {/* Collapsible Medications & Notes */}
        <View className="py-2">
          <Collapsible title="Medications Taken">
            <Text className="text-muted-foreground">This section is under development.</Text>
          </Collapsible>
        </View>

        <View className="py-2">
          <Text variant="title3" className="mb-2">Notes</Text>
          <TextInput
            className="min-h-[100px] rounded-lg border border-border bg-card p-4 text-foreground"
            placeholder="Add any extra details..."
            placeholderTextColor="hsl(var(--muted-foreground))"
            multiline
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Confidence Level Section */}
        <View className="py-2">
          <Text variant="title3" className="mb-2">How sure are you of these details?</Text>
          {/* A proper slider component would be ideal here */}
          <TextInput
            className="mt-2 rounded-lg border border-border bg-muted p-4 text-foreground"
            placeholder="e.g., 75%"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={confidence}
            onChangeText={setConfidence}
            keyboardType="numeric"
          />
          <View className="mt-1 flex-row justify-between">
            <Text className="text-xs text-muted-foreground">Not Sure</Text>
            <Text className="text-xs text-muted-foreground">Very Sure</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4 pt-2 pb-4">
        <TouchableOpacity className="items-center justify-center rounded-full bg-primary py-4 shadow-md">
          <Text className="font-bold text-primary-foreground">Review & Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
