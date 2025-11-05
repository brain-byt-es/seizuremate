import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const borderColor = useThemeColor('border');

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
      const completeSignUp = await signUp.create({
        emailAddress,
        password,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/(onboarding)'); // Redirect to onboarding after successful sign-up
    } catch (err: any) {
      Alert.alert('Sign Up Error', err.errors[0]?.longMessage || 'Something went wrong.');
      console.error('Sign up error', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText type="h1" style={styles.title}>Join SeizureMate</ThemedText>
      <ThemedText style={[styles.subtitle, { color: textColor }]}>Create an account to get started.</ThemedText>

      <TextInput
        style={[styles.input, { borderColor, color: textColor }]} // Apply border and text color from theme
        placeholder="Email"
        placeholderTextColor={borderColor} // Use border color for placeholder
        value={emailAddress}
        onChangeText={setEmailAddress}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { borderColor, color: textColor }]} // Apply border and text color from theme
        placeholder="Password"
        placeholderTextColor={borderColor} // Use border color for placeholder
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, { borderColor, color: textColor }]} // Apply border and text color from theme
        placeholder="Confirm Password"
        placeholderTextColor={borderColor} // Use border color for placeholder
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: primaryColor }]} // Apply primary color for button
        onPress={handleSignUp}
        disabled={loading}
      >
        <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: backgroundColor }]}> {/* Use background color for button text */}
          {loading ? 'Signing Up...' : 'Sign Up'}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <ThemedText style={{ color: textColor }}>Already have an account? </ThemedText>
        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}> {/* Link to sign-in page */}
          <ThemedText type="link" style={{ color: primaryColor }}>Sign In</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});