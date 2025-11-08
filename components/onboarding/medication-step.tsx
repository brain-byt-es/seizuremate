import * as Crypto from 'expo-crypto';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Input } from '@/components/ui/Input';

interface Medication {
  id: string;
  name: string;
  dosage: string;
}

export const MedicationStep = ({ onNext }: { onNext: (medications: Medication[]) => void }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');

  const addMedication = () => {
    if (name && dosage) {
      setMedications([...medications, { id: Crypto.randomUUID(), name, dosage }]);
      setName('');
      setDosage('');
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 w-full max-w-sm">
      <Text variant="title2" className="text-center mb-8">
        Add your medications
      </Text>
      <View className="w-full mb-4">
        <Input
          className="mb-4"
          placeholder="Medication Name"
          value={name}
          onChangeText={setName}
        />
        <Input
          className="mb-4"
          placeholder="Dosage (e.g., 10mg)"
          value={dosage}
          onChangeText={setDosage}
        />
        <Button variant="secondary" onPress={addMedication} disabled={!name || !dosage}>
          <Text>Add Medication</Text>
        </Button>
      </View>
      <FlatList
        className="w-full"
        data={medications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="bg-muted p-3 rounded-md mb-2">
            <Text>
              {item.name} ({item.dosage})
            </Text>
          </View>
        )}
      />
      <Button className="w-full mt-4" onPress={() => onNext(medications)}>
        <Text>Next</Text>
      </Button>
    </View>
  );
};
