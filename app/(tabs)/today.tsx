import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useThemeShadow } from '@/hooks/use-theme-shadow';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionProps {
  icon: string;
  text: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  boxShadow: string;
}

export default function TodayScreen() {
  const backgroundColor = useThemeColor('background');
  const primaryColor = useThemeColor('primary');
  const primaryTextColor = useThemeColor('primaryText');
  const boxShadow = useThemeShadow();
  const textColor = useThemeColor('text');
  const mutedColor = useThemeColor('muted');
  const surfaceColor = useThemeColor('surface');
  const surfaceAltColor = useThemeColor('surfaceAlt');

  const QuickAction = ({ icon, text, color, backgroundColor, onPress }: QuickActionProps) => (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor }]} onPress={onPress}>
      <IconSymbol name={icon} size={32} color={color} />
      <Text style={[styles.quickActionText, { color }]}>{text}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ label, value, description, boxShadow }: StatCardProps) => (
    <View style={[styles.statCard, { backgroundColor: surfaceColor, boxShadow }]}>
      <ThemedText type="small" style={{ color: mutedColor }}>{label}</ThemedText>
      <ThemedText type="h2" style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={{ fontSize: 12, color: mutedColor }}>{description}</ThemedText>
    </View>
  );

  return (
    <ScrollView style={[styles.screen, { backgroundColor }]}>
      <ThemedView style={styles.container}>
        <header style={styles.header}>
          <ThemedText type="h1">Good morning</ThemedText>
          <ThemedText style={{ color: mutedColor, marginTop: 4 }}>You&apos;re doing great today.</ThemedText>
        </header>

        <View style={styles.quickActionsGrid}>
          <QuickAction icon="bolt.fill" text="Start Quick Log" color={primaryTextColor} backgroundColor={primaryColor} onPress={() => {}} />
          <QuickAction icon="message.fill" text="Add Symptom" color={textColor} backgroundColor={surfaceAltColor} onPress={() => {}} />
          <QuickAction icon="pills.fill" text="Log Medication" color={textColor} backgroundColor={surfaceAltColor} onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>Upcoming Reminders</ThemedText>
          <TouchableOpacity style={[styles.reminderCard, { backgroundColor: surfaceColor, boxShadow }]}>
            <View style={[styles.reminderIcon, { backgroundColor: surfaceAltColor }]}>
              <IconSymbol name="bell.fill" size={24} color={textColor} />
            </View>
            <View style={styles.reminderTextContainer}>
              <ThemedText style={{ fontWeight: '600' }}>Neurologist Appointment</ThemedText>
              <ThemedText type="small" style={{ color: mutedColor }}>Tomorrow at 10:00 AM</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color={mutedColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <StatCard label="Seizures this week" value="1" description="One day at a time." boxShadow={boxShadow} />
            <StatCard label="Adherence" value="98%" description="Consistency is key." boxShadow={boxShadow} />
            <View style={styles.fullWidthStat}>
                <StatCard label="Sleep trend" value="7h 45m" description="Rest helps recovery." boxShadow={boxShadow} />
            </View>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 120, // Space for bottom nav
  },
  header: {
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  quickAction: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 120, // Add a max width to prevent boxes from becoming too large on web
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  reminderCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    flexGrow: 1,
    flexBasis: '40%', // ensures two columns with gap
  },
  statValue: {
    marginTop: 4,
    marginBottom: 8,
  },
  fullWidthStat: {
    flexBasis: '100%',
  }
});