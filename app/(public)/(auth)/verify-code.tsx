import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Input } from '@/components/ui/nativeui/input';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

export default function VerifyCodeScreen() {
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const router = useRouter();
  const { email, resetPassword } = useLocalSearchParams<{ email: string; resetPassword?: string }>();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isPasswordReset = resetPassword === 'true';

  const onVerifySignUp = async () => {
    if (!isSignUpLoaded || !signUp) return;
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/(onboarding)'); // Or wherever you want to direct new users
    } catch (err: any) {
      Alert.alert('Verification Error', err.errors?.[0]?.longMessage || 'Something went wrong.');
      console.error('Verification error', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPasswordReset = async () => {
    if (!isSignInLoaded || !signIn) return;
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code,
      });

      if (result.status === 'needs_new_password') {
        const resetResult = await signIn.resetPassword({
          password: newPassword,
        });
        if (resetResult.status === 'complete') {
          await setSignInActive({ session: resetResult.createdSessionId });
          router.replace('/(tabs)/today');
        } else {
          Alert.alert('Error', 'Failed to set new password.');
        }
      } else {
        Alert.alert('Error', 'Could not complete password reset.');
      }
    } catch (err: any) {
      Alert.alert('Reset Error', err.errors?.[0]?.longMessage || 'Something went wrong.');
      console.error('Password reset error', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onContinue = isPasswordReset ? onVerifyPasswordReset : onVerifySignUp;

  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <View className="w-full max-w-sm">
        <Text variant="largeTitle" className="mb-2 text-center">
          {isPasswordReset ? 'Reset Your Password' : 'Verify Your Email'}
        </Text>
        <Text className="mb-8 text-center text-lg text-muted-foreground">
          A code has been sent to {email}.
        </Text>

        <View className="gap-4">
          <Input
            className="h-14 text-center text-2xl tracking-[8px]"
            placeholder="------"
            placeholderTextColor="hsl(var(--muted-foreground))"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />

          {isPasswordReset && (
            <Input
              placeholder="New Password"
              placeholderTextColor="hsl(var(--muted-foreground))"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          )}
        </View>

        <Button
          onPress={onContinue}
          disabled={loading}
          className="mt-4 w-full"
        >
          {loading ? (
            <ActivityIndicator color="hsl(var(--primary-foreground))" />
          ) : (
            <Text>
              {isPasswordReset ? 'Set New Password' : 'Verify and Continue'}
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
}