import { Text } from '@/components/nativewindui/Text';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function AccountAndProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      {/* Profile Header */}
      <View style={styles.profileHeaderContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiybfbJ1JuhhvIVNUrP9MWYxD4NvyiCJepkE-3vIjSbRpCb_Jz83AI_aaQdyw8gJpetGkJMZETBIDNsnlpjt4iNpKbJzvPphdoQD62eOw3Zou-hgSOS7O-8Je3s0X1G1Xrikny_iVgtWgoucN9DteR4dx4vgVJrnaZQzBgPmKrpbiO7ZQSXb_kANW3lbby1KaF2BQsULU7jvEVt3cmiH7AD78k7ZJUv8PZLc-fUvDRdTbD6swDbSNjSS3LEexzufbtqqijAETA6J4' }}
            style={styles.avatar}
          />
          <TouchableOpacity className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-accent">
            <MaterialIcons name="edit" size={20} className="text-accent-foreground" />
          </TouchableOpacity>
        </View>
        {/* Profile Information Section */}
        <View className="mx-4 mb-6 gap-4 rounded-xl bg-card p-4">
          <View style={styles.inputGroup}>
            <Text className="text-sm font-medium text-muted-foreground">Name</Text>
            <TextInput
              className="h-14 rounded-lg bg-background p-4 text-base text-foreground"
              placeholder="Enter your name"
              defaultValue="Alex Doe"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text className="text-sm font-medium text-muted-foreground">Email</Text>
            <TextInput
              className="h-14 rounded-lg bg-background p-4 text-base text-foreground"
              value="alex.doe@email.com"
              editable={false}
            />
            <Text className="px-1 text-xs text-muted-foreground">
              Used for account recovery only.
            </Text>
          </View>
          <TouchableOpacity className="mt-2 h-14 items-center justify-center rounded-lg bg-accent">
            <Text className="text-base font-bold text-accent-foreground">Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Account Management Section */}
        <View className="mx-4 mb-6 rounded-xl bg-card p-2">
          <TouchableOpacity style={styles.listItem}>
            <MaterialIcons name="lock" size={24} className="text-foreground" />
            <Text style={styles.listItemText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <MaterialIcons name="devices" size={24} className="text-foreground" />
            <Text style={styles.listItemText}>Connected Devices</Text>
            <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <MaterialIcons name="download" size={24} className="text-foreground" />
            <Text style={styles.listItemText}>Export Personal Data</Text>
            <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.accountActionsSection}>
          <TouchableOpacity className="mt-2 h-14 items-center justify-center rounded-lg bg-card">
            <Text className="text-base font-bold text-accent">Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mt-2 h-14 items-center justify-center rounded-lg bg-transparent">
            <Text className="text-base font-bold text-destructive">Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeaderContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  inputGroup: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 8,
    gap: 16,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
  },
  accountActionsSection: {
    marginHorizontal: 16,
    gap: 16,
    marginVertical: 24,
  },
});
