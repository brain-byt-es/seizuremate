import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Input } from '@/components/ui/nativeui/input';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

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
        firstName: name,
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
      router.push({ pathname: '/(public)/(auth)/verify-code', params: { email: emailAddress } });
    } catch (err: any) {
      Alert.alert('Sign Up Error', err.errors?.[0]?.longMessage || 'Something went wrong.');
      console.error('Sign up error', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <View className="w-full max-w-sm">
        <Text variant="largeTitle" className="mb-2 text-center">Join SeizureMate</Text>
        <Text className="mb-8 text-center text-lg text-muted-foreground">Create an account to get started.</Text>

        <View className="gap-4">
          <Input
            placeholder="Name"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={name}
            onChangeText={setName}
            textContentType="name"
          />
          <Input
            placeholder="Email"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            placeholder="Password"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            placeholder="Confirm Password"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />
        </View>

        <Button className="mt-6 w-full" onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="hsl(var(--primary-foreground))" /> : <Text>Sign Up</Text>}
        </Button>

        <View className="mt-5 flex-row justify-center">
          <Text className="text-muted-foreground">Already have an account? </Text>
          <Link href="/(public)/(auth)/sign-in" asChild>
            <TouchableOpacity><Text className="font-bold text-primary">Sign In</Text></TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}