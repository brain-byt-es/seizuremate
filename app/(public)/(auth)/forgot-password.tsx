import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Input } from '@/components/ui/nativeui/input';
import { useSignIn } from '@clerk/clerk-expo';
import type { SignInFactor } from '@clerk/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: emailAddress,
      });

      const isEmailFactor = (factor: SignInFactor) => factor.strategy === 'email_code';
      const emailFactor = supportedFirstFactors?.find(isEmailFactor);

      if (emailFactor && 'emailAddressId' in emailFactor) {
        const { emailAddressId } = emailFactor;
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId,
        });
        router.push({ pathname: '/(public)/(auth)/verify-code', params: { email: emailAddress, resetPassword: 'true' } });
      } else {
        Alert.alert('Error', 'Password reset via email is not available for this account.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.longMessage || 'Something went wrong.');
      console.error('Forgot password error', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <View className="w-full max-w-sm">
        <Text variant="largeTitle" className="mb-2 text-center">Reset Password</Text>
        <Text className="mb-8 text-center text-lg text-muted-foreground">Enter your email. We&apos;ll send a code to confirm it&apos;s you.</Text>
        <Input
          placeholder="Email"
          placeholderTextColor="hsl(var(--muted-foreground))"
          value={emailAddress}
          onChangeText={setEmailAddress}
          autoCapitalize="none"
          keyboardType="email-address" />
        <Button onPress={handleSendCode} disabled={loading} className="mt-4 w-full">
          {loading ? <ActivityIndicator color="hsl(var(--primary-foreground))" /> : <Text>Send Code</Text>}
        </Button>
      </View>
    </View>
  );
}