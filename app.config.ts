import 'dotenv/config';

export default {
  expo: {
    name: "yourapp",
    slug: "yourapp",
    scheme: "yourapp",
    ios: { bundleIdentifier: "com.yourapp" },
    android: { package: "com.yourapp" },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  },
};
