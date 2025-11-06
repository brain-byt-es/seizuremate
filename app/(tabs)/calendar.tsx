import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLogs } from '@/contexts/LogsContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { addMonths, endOfMonth, format, getDaysInMonth, startOfMonth, subMonths } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthAndSupabase } from '../_layout';

const FILTERS = ['All', 'Seizures', 'Symptoms', 'Meds'];

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('All');
  const { logs, fetchLogs } = useLogs();
  const { isSupabaseReady } = useAuthAndSupabase();
  const { isLoaded, isSignedIn } = useAuth();

  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const primaryTextColor = useThemeColor('primaryText');
  const accentColor = useThemeColor('accent');
  const surfaceColor = useThemeColor('surface');
  const mutedColor = useThemeColor('muted');
  const borderColor = useThemeColor('border');

  useEffect(() => {
    // Do not fetch until Clerk is loaded, the user is signed in, AND the Supabase session is ready.
    if (!isLoaded || !isSignedIn || !isSupabaseReady) {
      return;
    }

    const firstDay = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    const lastDay = format(endOfMonth(currentDate), 'yyyy-MM-dd');
    fetchLogs(firstDay, lastDay).catch((e) => {
      // We can show a toast or a small inline error here in the future.
      console.error("Failed to fetch logs for calendar:", e);
    });
  }, [currentDate, fetchLogs, isLoaded, isSignedIn, isSupabaseReady]);

  // This is the key change: Transform the flat `logs` array into the grouped structure your UI expects.
  const groupedLogs = useMemo(() => {
    return logs.reduce((acc, log) => {
      const dateKey = format(new Date(log.created_at), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(log);
      return acc;
    }, {} as Record<string, any[]>);
  }, [logs]);

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const startDayOfWeek = monthStart.getDay(); // 0 for Sunday
    const todayString = format(new Date(), 'yyyy-MM-dd');

    const days = [];
    // Add blank days for the start of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<View key={`blank-${i}`} style={styles.dayCell} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = format(dayDate, 'yyyy-MM-dd');
      const logsForDay = groupedLogs[dateString];
      const isSelected = format(selectedDate, 'yyyy-MM-dd') === dateString;
      const isToday = dateString === todayString;

      let dayStyle: object = {};
      let textStyle: object = { color: textColor };

      if (logsForDay) {
        const seizureLog = logsForDay.find((log) => log.type === 'seizure');
        if (seizureLog && seizureLog.duration) { // Assuming intensity is now duration
          const opacity = Math.min(1, (seizureLog.duration / 300)).toFixed(2); // Example: opacity based on duration up to 5 mins
          dayStyle = { backgroundColor: `${primaryColor}${Math.floor(parseFloat(opacity) * 255).toString(16).padStart(2, '0')}` };
        }
      }

      if (isToday) {
        dayStyle = { ...dayStyle, borderWidth: 2, borderColor: accentColor };
      }

      if (isSelected) {
        dayStyle = { backgroundColor: primaryColor, borderWidth: 2, borderColor: primaryColor };
        textStyle = { color: primaryTextColor };
      }

      days.push(
        <TouchableOpacity key={day} style={styles.dayCell} onPress={() => setSelectedDate(dayDate)}>
          <View style={[styles.dayContent, dayStyle]}>
            <ThemedText style={textStyle}>{day}</ThemedText>
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const logsForSelectedDay = groupedLogs[selectedDateString] || [];

  return (
    <ThemedView style={[styles.screen, { backgroundColor }]}>
      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.headerButton}>
          <MaterialIcons name="chevron-left" size={30} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="h3" style={styles.headerTitle}>{format(currentDate, 'MMMM yyyy')}</ThemedText>
        <TouchableOpacity onPress={handleNextMonth} style={styles.headerButton}>
          <MaterialIcons name="chevron-right" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter
                  ? { backgroundColor: accentColor }
                  : { backgroundColor: surfaceColor, borderWidth: 1, borderColor: borderColor },
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <ThemedText style={[styles.filterText, activeFilter === filter && { color: 'white' }]}>{filter}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView>
        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          <View style={styles.weekDaysContainer}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <ThemedText key={index} style={[styles.weekDayText, { color: mutedColor }]}>{day}</ThemedText>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {renderCalendarGrid()}
          </View>
        </View>

        {/* Selected Day Detail View */}
        <View style={[styles.detailView, { backgroundColor: `${surfaceColor}B3` /* 70% opacity */ }]}>
          <ThemedText type="h3" style={styles.detailTitle}>Logs for {format(selectedDate, 'MMMM d')}</ThemedText>
          <View style={styles.logList}>
            {logsForSelectedDay.length > 0 ? (
              logsForSelectedDay.map((log: any, index: number) => (
                <View key={index} style={styles.logItem}>
                  <View style={styles.logItemContent}>
                    <View style={[styles.logIconContainer, { backgroundColor: `${primaryColor}33` /* 20% opacity */ }]}>
                      <MaterialIcons name={log.icon || 'edit'} size={24} color={primaryColor} />
                    </View>
                    <ThemedText style={styles.logName}>{log.name || log.type}</ThemedText>
                  </View>
                  <ThemedText style={[styles.logTime, { color: mutedColor }]}>{format(new Date(log.created_at), 'p')}</ThemedText>
                </View>
              ))
            ) : (
              <ThemedText style={{ color: mutedColor, textAlign: 'center', marginTop: 20 }}>No logs for this day.</ThemedText>
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center', // This will center all direct children horizontally
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 500,
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
  },
  filterChip: {
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  weekDaysContainer: {
    flexDirection: 'row',
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    height: 40,
    lineHeight: 40,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContent: {
    width: 40,
    height: 40,
    maxWidth: '90%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailView: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 90, // Space for bottom nav
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  detailTitle: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  logList: {
    gap: 8,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  logItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  logIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logName: {
    fontSize: 16,
    flex: 1,
  },
  logTime: {
    fontSize: 14,
  },
});