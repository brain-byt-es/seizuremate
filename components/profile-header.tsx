import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from './nativewindui/Text';
interface ProfileHeaderProps {
  // Replace with actual user type
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row items-center p-5 rounded-xl mx-4 mt-4 gap-4 bg-card"
      onPress={() => router.push('/(auth)/(settings)/account-and-profile')}>
      <Image
        source={{ uri: user.avatarUrl || 'https://via.placeholder.com/80' }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text variant="title3">{user.name}</Text>
        <Text className="text-muted-foreground">{user.email}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
  },
});
