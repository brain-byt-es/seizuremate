import { spacing } from '@/constants/theme'; // Import spacing
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Redirect, Tabs } from 'expo-router'; // Import Link
import { TouchableOpacity, View } from 'react-native'; // Import necessary components

export default function TabsLayout() {
  const { isSignedIn } = useAuth();
  const primaryColor = useThemeColor('primary');
  const mutedColor = useThemeColor('muted');
  const backgroundColor = useThemeColor('background'); // Get background color for FAB

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <View style={{ flex: 1 }}> {/* Wrap Tabs in a View to allow absolute positioning */}
      <Tabs screenOptions={{
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: mutedColor,
        headerShown: false, // The header will be provided by the nested stack
      }}>
        <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} /> }} />
        <Tabs.Screen name="log" options={{ title: 'Log', tabBarIcon: ({ color }) => <MaterialIcons name="edit-square" size={24} color={color} /> }} />
        <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: ({ color }) => <MaterialIcons name="calendar-today" size={24} color={color} /> }} />
        <Tabs.Screen name="insights" options={{ title: 'Insights', tabBarIcon: ({ color }) => <MaterialIcons name="insights" size={24} color={color} /> }} />
        <Tabs.Screen name="(settings)" options={{ title: 'Settings', tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
            headerShown: false, // Important: let the nested stack manage its own header
          }}
        />
      </Tabs>

      {/* Floating Action Button */}
      <Link href="/modal/LogSelectionModal" asChild>
        <TouchableOpacity
          style={{ width: 56, height: 56, backgroundColor: primaryColor, borderRadius: 28, justifyContent: 'center', alignItems: 'center',
            position: 'absolute',
            bottom: spacing.lg, // Adjust as needed for tab bar height
            right: spacing.lg,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <MaterialIcons name="add" size={30} color={backgroundColor} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
