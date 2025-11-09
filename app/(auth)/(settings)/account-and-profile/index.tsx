import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/nativeui/alert-dialog';
import { Card } from '@/components/ui/nativeui/card';
import { Input } from '@/components/ui/nativeui/input';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';

export default function AccountAndProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await user.update({ firstName, lastName });
      Alert.alert('Success', 'Your profile has been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await user.delete();
      // The user will be signed out automatically and redirected by the root layout.
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
      console.error('Account deletion error:', error);
    }
  };

  const onSelectImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && user) {
      setLoading(true);
      try {
        await user.setProfileImage({ file: result.assets[0].uri });
      } catch (err) {
        Alert.alert('Error', 'Failed to upload profile image.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="items-center gap-4 py-6">
        {/* Profile Header */}
        <View>
          <Image
            source={{ uri: user?.imageUrl }}
            className="w-32 h-32 rounded-full"
          />
          <TouchableOpacity onPress={onSelectImage} className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-accent">
            <MaterialIcons name="edit" size={20} className="text-accent-foreground" />
          </TouchableOpacity>
        </View>

        {/* Profile Information Section */}
        <Card className="w-full max-w-sm gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">First Name</Text>
            <Input
              placeholder="Your first name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Last Name</Text>
            <Input
              placeholder="Your last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Email</Text>
            <Input
              value={user?.primaryEmailAddress?.emailAddress}
              editable={false}
            />
            <Text className="px-1 text-xs text-muted-foreground">
              Used for account recovery only.
            </Text>
          </View>
          <Button className="mt-2" onPress={handleSaveChanges} disabled={loading}>
            {loading ? <ActivityIndicator color="hsl(var(--primary-foreground))" /> : <Text>Save Changes</Text>}
          </Button>
        </Card>

        {/* Account Management Section */}
        <Card className="w-full max-w-sm p-2">
          <TouchableOpacity className="flex-row items-center min-h-[56px] px-2 gap-4" onPress={() => router.push('/(public)/(auth)/forgot-password' as any)}>
            <MaterialIcons name="lock" size={24} className="text-foreground" />
            <Text className="flex-1 text-base">Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center min-h-[56px] px-2 gap-4" onPress={() => Alert.alert('Coming Soon', 'This feature is not yet implemented.')}>
            <MaterialIcons name="devices" size={24} className="text-foreground" />
            <Text className="flex-1 text-base">Connected Devices</Text>
            <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center min-h-[56px] px-2 gap-4" onPress={() => Alert.alert('Coming Soon', 'This feature is not yet implemented.')}>
            <MaterialIcons name="download" size={24} className="text-foreground" />
            <Text className="flex-1 text-base">Export Personal Data</Text>
            <MaterialIcons name="chevron-right" size={24} className="text-muted-foreground" />
          </TouchableOpacity>
        </Card>

        {/* Account Actions */}
        <View className="w-full max-w-sm gap-4 my-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">
                <Text>Log Out</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out of your account?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel><Button variant="plain"><Text>Cancel</Text></Button></AlertDialogCancel>
                <AlertDialogAction><Button onPress={handleLogout}><Text>Log Out</Text></Button></AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="plain" className="border border-destructive">
                <Text className="text-base font-bold text-destructive">Delete Account</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is irreversible and will permanently delete your account and all associated data. Are you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel><Button variant="plain"><Text>Cancel</Text></Button></AlertDialogCancel>
                <AlertDialogAction><Button className="bg-destructive" onPress={handleDeleteAccount}><Text className="text-destructive-foreground">Delete</Text></Button></AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      </View>
    </ScrollView>
  );
}
