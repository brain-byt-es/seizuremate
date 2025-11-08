import { Text } from '@/components/nativewindui/Text';
import { useSignIn } from '@clerk/clerk-expo';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; // For the eye icon
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';


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
            <TextInput
              className="h-14 w-full rounded-xl border border-border bg-card p-4 text-base leading-normal text-foreground"
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
              <TextInput
                className="flex-1 p-4 pr-2 text-base leading-normal text-foreground"
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
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'This feature is not yet implemented.')}>
              <Text className="text-sm leading-normal text-foreground underline">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ButtonGroup */}
        <View className="w-full flex-col gap-3 px-4 py-3">
          <TouchableOpacity
            className="h-14 min-w-[84px] items-center justify-center rounded-xl bg-primary px-5"
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="hsl(var(--primary-foreground))" />
            ) : (
              <Text className="text-base font-bold leading-normal tracking-wide text-primary-foreground">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.orSeparatorContainer}>
            <View className="absolute w-full border-t border-border" />
            <Text className="bg-background px-2 text-sm text-foreground">or</Text>
          </View>

          {/* Continue with Google */}
          <TouchableOpacity
            className="h-14 min-w-[84px] flex-row items-center justify-center gap-3 rounded-xl border border-border bg-card px-5"
            onPress={() => Alert.alert('Social Login', 'Google login not yet implemented.')}
          >
            {/* Placeholder for Google Icon */}
            <View className="h-6 w-6 items-center justify-center">
              <Text className="text-foreground">G</Text>
            </View>
            <Text className="text-base font-bold leading-normal tracking-wide text-foreground">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Continue with Apple */}
          <TouchableOpacity
            className="h-14 min-w-[84px] flex-row items-center justify-center gap-3 rounded-xl border border-border bg-card px-5"
            onPress={() => Alert.alert('Social Login', 'Apple login not yet implemented.')}
          >
            {/* Placeholder for Apple Icon */}
            <View className="h-6 w-6 items-center justify-center">
              <Text className="text-foreground">A</Text>
            </View>
            <Text className="text-base font-bold leading-normal tracking-wide text-foreground">
              Continue with Apple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="h-14 min-w-[84px] items-center justify-center rounded-xl bg-transparent px-5"
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text className="text-base font-bold leading-normal tracking-wide text-foreground">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <Text className="mt-8 px-4 text-center text-xs">
          By continuing, you agree to our <Text className="text-primary">Terms of Service</Text> and <Text className="text-primary">Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  forgotPasswordContainer: {
    width: '100%',
    paddingHorizontal: 16, // px-4
    paddingTop: 4, // pt-1
    paddingBottom: 12, // pb-3
    alignItems: 'flex-end', // text-right
  },
  orSeparatorContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12, // my-3
  },
});