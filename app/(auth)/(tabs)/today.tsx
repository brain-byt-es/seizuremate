import { Text } from '@/components/nativewindui/Text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface QuickActionProps {
  icon: string;
  text: string;
  className?: string;
  onPress: () => void;
}

interface StatCardProps {
  label: string;
  value: string;
  description: string;
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets();

  const QuickAction = ({ icon, text, className, onPress }: QuickActionProps) => (
    <TouchableOpacity className={`flex-1 aspect-square max-w-[120px] rounded-2xl items-center justify-center p-2 ${className}`} onPress={onPress}>
      <IconSymbol name={icon} size={32} color="" className="text-inherit" />
      <Text className="text-inherit text-sm font-semibold mt-2 text-center leading-tight">{text}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ label, value, description }: StatCardProps) => (
    <View className="rounded-2xl p-4 flex-grow basis-[40%] bg-card shadow-sm">
      <Text className="text-muted-foreground text-sm">{label}</Text>
      <Text variant="title2" className="my-1">{value}</Text>
      <Text className="text-muted-foreground text-xs">{description}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-5 pb-32" style={{ paddingTop: insets.top + 16 }}>
        <View className="mb-8">
          <Text variant="largeTitle">Good morning</Text>
          <Text className="text-muted-foreground mt-1">You&apos;re doing great today.</Text>
        </View>

        <View className="flex-row justify-between gap-3 mb-8">
          <QuickAction icon="bolt.fill" text="Start Quick Log" className="bg-primary text-primary-foreground" onPress={() => {}} />
          <QuickAction icon="message.fill" text="Add Symptom" className="bg-card text-card-foreground" onPress={() => {}} />
          <QuickAction icon="pills.fill" text="Log Medication" className="bg-card text-card-foreground" onPress={() => {}} />
        </View>

        <View className="mb-8">
          <Text variant="title3" className="mb-3">Upcoming Reminders</Text>
          <TouchableOpacity className="rounded-2xl p-4 flex-row items-center bg-card shadow-sm">
            <View className="w-12 h-12 rounded-full items-center justify-center bg-muted">
              <IconSymbol name="bell.fill" size={24} color="" className="text-muted-foreground" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-semibold">Neurologist Appointment</Text>
              <Text className="text-muted-foreground text-sm">Tomorrow at 10:00 AM</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color="" className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        <View>
          <View className="flex-row flex-wrap gap-4">
            <StatCard label="Seizures this week" value="1" description="One day at a time." />
            <StatCard label="Adherence" value="98%" description="Consistency is key." />
            <View className="basis-full">
                <StatCard label="Sleep trend" value="7h 45m" description="Rest helps recovery." />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}