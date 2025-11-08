import { Text } from '@/components/nativewindui/Text';
import { ProfileHeader } from '@/components/profile-header';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SectionList, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SECTIONS = [
  {
    title: 'Account',
    data: [
      {
        id: 'account-and-profile',
        label: 'Account & Profile',
        icon: 'person-outline',
        href: '/(auth)/(settings)/account-and-profile',
      },
      {
        id: 'app-lock',
        label: 'App Lock',
        icon: 'lock-outline',
        href: '/(auth)/(settings)/app-lock',
      },
    ],
  },
  {
    title: 'Features',
    data: [
      {
        id: 'medication',
        label: 'Medication',
        icon: 'medication',
        href: '/(auth)/(settings)/medications',
      },
      {
        id: 'care-circle',
        label: 'Care Circle',
        icon: 'people-outline',
        href: '/(auth)/(settings)/care-circle',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'notifications-outline',
        href: '/(auth)/(settings)/notifications',
      },
      {
        id: 'reports-and-exports',
        label: 'Reports & Exports',
        icon: 'assessment',
        href: '/(auth)/(settings)/reports-and-exports',
      },
    ],
  },
  {
    title: 'Customization',
    data: [
      {
        id: 'accessibility-and-display',
        label: 'Accessibility & Display',
        icon: 'accessibility',
        href: '/(auth)/(settings)/accessibility-and-display',
      },
      {
        id: 'language-and-region',
        label: 'Language & Region',
        icon: 'language',
        href: '/(auth)/(settings)/language-and-region',
      },
      {
        id: 'data-connections',
        label: 'Data Connections',
        icon: 'sync',
        href: '/(auth)/(settings)/data-connections',
      },
    ],
  },
  {
    title: 'Support',
    data: [
      {
        id: 'help-and-support',
        label: 'Help & Support',
        icon: 'help-outline',
        href: '/(auth)/(settings)/help-and-support',
      },
      {
        id: 'about',
        label: 'About',
        icon: 'info-outline',
        href: '/(auth)/(settings)/about',
      },
    ],
  },
];


const MOCK_USER = {
  name: 'Henrik',
  email: 'henrik@example.com',
};

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pb-3" style={{ paddingTop: insets.top }}>
        <Text variant="title2">Settings</Text>
      </View>

      <SectionList
        sections={SECTIONS}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center gap-4 rounded-xl bg-card p-4" onPress={() => router.push(item.href as any)}>
            <MaterialIcons name={item.icon as any} size={24} className="text-foreground" />
            <Text className="flex-1 text-base">{item.label}</Text>
            <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text variant="subhead" className="mt-6 mb-2 ml-4 font-bold text-muted-foreground">{title}</Text>
        )}
        ListHeaderComponent={
          <>
            <ProfileHeader user={MOCK_USER} />
            <View className="px-4 mb-4">{/* Search bar placeholder */}</View>
          </>
        }
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
}