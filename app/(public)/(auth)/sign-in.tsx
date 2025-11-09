import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Input } from '@/components/ui/nativeui/input';
import { useSignIn } from '@clerk/clerk-expo';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; // For the eye icon
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSignIn = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace('/(tabs)/today');
    } catch (err: any) {
      Alert.alert('Sign In Error', err.errors[0]?.longMessage || 'Something went wrong.');
      console.error('Sign in error', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <View className="w-full max-w-md flex-1 self-center items-center justify-center">
        {/* App Logo Placeholder */}
        <View className="mb-8 h-20 w-20 items-center justify-center rounded-full bg-card">
          <MaterialIcons name="psychology" size={40} className="text-foreground" />
        </View>

        {/* Headline Text */}
        <Text variant="largeTitle" className="text-center">Welcome</Text>

        {/* Form */}
        <View className="w-full mt-8">
          {/* Email TextField */}
          <View className="w-full px-4 py-3">
            <Text className="pb-2 text-base font-medium leading-normal">Email Address</Text>
            <Input
              placeholder="Enter your email"
              placeholderTextColor="hsl(var(--muted-foreground))"
              value={emailAddress}
              onChangeText={setEmailAddress}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password TextField */}
          <View className="w-full px-4 py-3">
            <Text className="pb-2 text-base font-medium leading-normal">Password</Text>
            <View className="h-14 w-full flex-row items-center rounded-xl border border-border bg-card">
              <Input
                className="flex-1 border-0 bg-transparent p-4 pr-2 text-base leading-normal text-foreground"
                placeholder="Enter your password"
                placeholderTextColor="hsl(var(--muted-foreground))"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="items-center justify-center pr-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  className="text-foreground"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <View className="w-full items-end px-4 pt-1 pb-3">
            <Link href="/(public)/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="text-sm leading-normal text-foreground underline">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* ButtonGroup */}
        <View className="w-full flex-col gap-3 px-4 py-3">
          <Button onPress={handleSignIn} disabled={loading} className="w-full">
            {loading ? (
              <ActivityIndicator color="hsl(var(--primary-foreground))" />
            ) : (
              <Text>Sign In</Text>
            )}
          </Button>

          <View className="relative my-3 flex-row items-center justify-center">
            <View className="absolute w-full border-t border-border" />
            <Text className="bg-background px-2 text-sm text-foreground">or</Text>
          </View>

          {/* Continue with Google */}
          <Button
            variant="secondary"
            onPress={() => Alert.alert('Social Login', 'Google login not yet implemented.')}
            className="w-full flex-row gap-3"
          >
            {/* Placeholder for Google Icon */}
            <View className="h-6 w-6 items-center justify-center">
              <Text className="text-foreground">G</Text>
            </View>
            <Text>Continue with Google</Text>
          </Button>

          {/* Continue with Apple */}
          <Button variant="secondary" onPress={() => Alert.alert('Social Login', 'Apple login not yet implemented.')} className="w-full flex-row gap-3">
            {/* Placeholder for Apple Icon */}
            <View className="h-6 w-6 items-center justify-center">
              <Text className="text-foreground">A</Text>
            </View>
            <Text>Continue with Apple</Text>
          </Button>

          <View className="mt-2 flex-row justify-center">
            <Text className="text-muted-foreground">Don&apos;t have an account? </Text>
            <Link href="/(public)/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="font-bold text-primary">Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}