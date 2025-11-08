import { Text } from '@/components/nativewindui/Text';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const handleSignUp = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    if (password !== passwordConfirm) {
      Alert.alert('Sign Up Error', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

    } catch (err: any) {
      // This can happen if the user signed up before, but hasn't verified their email.
      if (err.errors?.[0]?.code === 'form_identifier_exists') {
        console.log('User already exists, proceeding to verification.');
      } else {
        Alert.alert('Sign Up Error', err.errors?.[0]?.longMessage || 'Something went wrong.');
        console.error('Sign up error', JSON.stringify(err, null, 2));
        setLoading(false); // Stop loading on other errors
        return;
      }
    }
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Sign Up Error', err.errors?.[0]?.longMessage || 'Something went wrong.');
      console.error('Sign up error', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/(onboarding)');
    } catch (err: any) {
      Alert.alert('Verification Error', err.errors[0]?.longMessage || 'Something went wrong.');
      console.error('Verification error', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-5">
        <View className="w-full max-w-sm">
          <Text variant="largeTitle" className="mb-2 text-center">Verify Your Email</Text>
          <Text className="mb-8 text-center text-lg text-muted-foreground">A code has been sent to your email address.</Text>
          <TextInput
            className="h-14 w-full rounded-xl border border-border bg-card p-4 text-center text-2xl tracking-[8px] text-foreground"
            placeholder="------"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity
            className="mt-4 h-14 w-full items-center justify-center rounded-xl bg-primary"
            onPress={onVerifyPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="hsl(var(--primary-foreground))" />
            ) : (
              <Text className="text-base font-bold text-primary-foreground">
                Verify Email
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <View className="w-full max-w-sm">
        <Text variant="largeTitle" className="mb-2 text-center">Join SeizureMate</Text>
        <Text className="mb-8 text-center text-lg text-muted-foreground">Create an account to get started.</Text>

        <View className="gap-4">
          <TextInput
            className="h-14 w-full rounded-xl border border-border bg-card p-4 text-base text-foreground"
            placeholder="Email"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            className="h-14 w-full rounded-xl border border-border bg-card p-4 text-base text-foreground"
            placeholder="Password"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            className="h-14 w-full rounded-xl border border-border bg-card p-4 text-base text-foreground"
            placeholder="Confirm Password"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />
        </View>

        <TouchableOpacity className="mt-6 h-14 w-full items-center justify-center rounded-xl bg-primary" onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="hsl(var(--primary-foreground))" /> : <Text className="text-base font-bold text-primary-foreground">Sign Up</Text>}
        </TouchableOpacity>

        <View className="mt-5 flex-row justify-center">
          <Text className="text-muted-foreground">Already have an account? </Text>
          <Link href="/(public)/(auth)/sign-in" replace asChild>
            <TouchableOpacity><Text className="font-bold text-primary">Sign In</Text></TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}