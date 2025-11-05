import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
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

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const borderColor = useThemeColor('border');
  const inputBackgroundColor = useThemeColor('surface'); // Changed from 'inputBackground' to 'surface'
  const placeholderColor = useThemeColor('muted'); // Changed from 'placeholder' to 'muted'

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
    <ThemedView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* App Logo Placeholder */}
        <View style={[styles.logoPlaceholder, { backgroundColor: inputBackgroundColor }]}>
          <MaterialIcons name="psychology" size={40} color={textColor} />
        </View>

        {/* Headline Text */}
        <ThemedText type="h1" style={[styles.headline, { color: textColor }]}>Welcome</ThemedText>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email TextField */}
          <View style={styles.inputFieldWrapper}>
            <ThemedText style={[styles.inputLabel, { color: textColor }]}>Email Address</ThemedText>
            <TextInput
              style={[styles.input, { borderColor, color: textColor, backgroundColor: inputBackgroundColor }]}
              placeholder="Enter your email"
              placeholderTextColor={placeholderColor}
              value={emailAddress}
              onChangeText={setEmailAddress}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password TextField */}
          <View style={styles.inputFieldWrapper}>
            <ThemedText style={[styles.inputLabel, { color: textColor }]}>Password</ThemedText>
            <View style={[styles.passwordInputContainer, { borderColor, backgroundColor: inputBackgroundColor }]}>
              <TextInput
                style={[styles.passwordInput, { color: textColor }]}
                placeholder="Enter your password"
                placeholderTextColor={placeholderColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordVisibilityToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={textColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'This feature is not yet implemented.')}>
              <ThemedText style={[styles.forgotPasswordText, { color: textColor }]}>Forgot Password?</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ButtonGroup */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: primaryColor }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={backgroundColor} />
            ) : (
              <ThemedText type="defaultSemiBold" style={[styles.primaryButtonText, { color: backgroundColor }]}>
                Sign In
              </ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles.orSeparatorContainer}>
            <View style={[styles.orSeparatorLine, { borderColor }]} />
            <ThemedText style={[styles.orSeparatorText, { color: textColor, backgroundColor }]}>or</ThemedText>
          </View>

          {/* Continue with Google */}
          <TouchableOpacity
            style={[styles.socialButton, { borderColor, backgroundColor: inputBackgroundColor }]}
            onPress={() => Alert.alert('Social Login', 'Google login not yet implemented.')}
          >
            {/* Placeholder for Google Icon */}
            <View style={styles.socialIconPlaceholder}>
              <ThemedText style={{ color: textColor }}>G</ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={[styles.socialButtonText, { color: textColor }]}>
              Continue with Google
            </ThemedText>
          </TouchableOpacity>

          {/* Continue with Apple */}
          <TouchableOpacity
            style={[styles.socialButton, { borderColor, backgroundColor: inputBackgroundColor }]}
            onPress={() => Alert.alert('Social Login', 'Apple login not yet implemented.')}
          >
            {/* Placeholder for Apple Icon */}
            <View style={styles.socialIconPlaceholder}>
              <ThemedText style={{ color: textColor }}>A</ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={[styles.socialButtonText, { color: textColor }]}>
              Continue with Apple
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <ThemedText type="defaultSemiBold" style={[styles.createAccountButtonText, { color: textColor }]}>
              Create Account
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <ThemedText style={styles.footerText}>
          By continuing, you agree to our <ThemedText type="link">Terms of Service</ThemedText> and <ThemedText type="link">Privacy Policy</ThemedText>.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // p-4
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 448, // max-w-md
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    marginBottom: 32, // mb-8
    height: 80, // h-20
    width: 80, // w-20
    borderRadius: 9999, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 40, // text-4xl
  },
  headline: {
    fontSize: 32, // text-[32px]
    fontWeight: 'bold',
    lineHeight: 36, // leading-tight
  },
  formContainer: {
    width: '100%',
    marginTop: 32, // mt-8
  },
  inputFieldWrapper: {
    width: '100%',
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
  },
  inputLabel: {
    fontSize: 16, // text-base
    fontWeight: '500', // font-medium
    lineHeight: 24, // leading-normal
    paddingBottom: 8, // pb-2
  },
  input: {
    width: '100%',
    height: 56, // h-14
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    paddingHorizontal: 15, // p-[15px]
    fontSize: 16, // text-base
    lineHeight: 24, // leading-normal
  },
  passwordInputContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 56, // h-14
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingLeft: 15, // p-[15px]
    fontSize: 16, // text-base
    lineHeight: 24, // leading-normal
    paddingRight: 8, // pr-2
  },
  passwordVisibilityToggle: {
    paddingRight: 15, // pr-[15px]
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordContainer: {
    width: '100%',
    paddingHorizontal: 16, // px-4
    paddingTop: 4, // pt-1
    paddingBottom: 12, // pb-3
    alignItems: 'flex-end', // text-right
  },
  forgotPasswordText: {
    fontSize: 14, // text-sm
    lineHeight: 20, // leading-normal
    textDecorationLine: 'underline',
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'column',
    gap: 12, // gap-3
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
  },
  primaryButton: {
    minWidth: 84, // min-w-[84px]
    height: 56, // h-14
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 20, // px-5
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16, // text-base
    fontWeight: 'bold',
    lineHeight: 24, // leading-normal
    letterSpacing: 0.015, // tracking-[0.015em]
  },
  orSeparatorContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12, // my-3
  },
  orSeparatorLine: {
    position: 'absolute',
    width: '100%',
    borderTopWidth: 1,
  },
  orSeparatorText: {
    paddingHorizontal: 8, // px-2
    fontSize: 14, // text-sm
  },
  socialButton: {
    flexDirection: 'row',
    minWidth: 84, // min-w-[84px]
    height: 56, // h-14
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 20, // px-5
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12, // gap-3
  },
  socialIconPlaceholder: {
    height: 24, // h-6
    width: 24, // w-6
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 16, // text-base
    fontWeight: 'bold',
    lineHeight: 24, // leading-normal
    letterSpacing: 0.015, // tracking-[0.015em]
  },
  createAccountButton: {
    minWidth: 84, // min-w-[84px]
    height: 56, // h-14
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 20, // px-5
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  createAccountButtonText: {
    fontSize: 16, // text-base
    fontWeight: 'bold',
    lineHeight: 24, // leading-normal
    letterSpacing: 0.015, // tracking-[0.015em]
  },
  footerText: {
    marginTop: 32, // mt-8
    paddingHorizontal: 16, // px-4
    fontSize: 12, // text-xs
    textAlign: 'center',
  },
});