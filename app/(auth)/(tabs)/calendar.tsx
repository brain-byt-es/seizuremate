import { Text } from '@/components/nativewindui/Text';
import { useLogs } from '@/contexts/LogsContext';
import { useAuth } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { addMonths, endOfMonth, format, getDaysInMonth, startOfMonth, subMonths } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS = ['All', 'Seizures', 'Symptoms', 'Meds'];

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('All');
  const { logs, fetchLogs } = useLogs();
  const { isLoaded, isSignedIn } = useAuth();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Do not fetch until Clerk is loaded, the user is signed in, AND the Supabase session is ready.
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const firstDay = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    const lastDay = format(endOfMonth(currentDate), 'yyyy-MM-dd');
    fetchLogs(firstDay, lastDay).catch((e) => {
      // We can show a toast or a small inline error here in the future.
      console.error("Failed to fetch logs for calendar:", e);
    });
  }, [currentDate, fetchLogs, isLoaded, isSignedIn]);

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

      const dayClasses = [];
      const textClasses = ['text-foreground'];

      if (logsForDay) {
        const seizureLog = logsForDay.find((log) => log.type === 'seizure');
        if (seizureLog && seizureLog.duration) { // Assuming intensity is now duration
          const opacity = Math.min(1, (seizureLog.duration / 300)).toFixed(2); // Example: opacity based on duration up to 5 mins
          dayClasses.push(`bg-primary/[${opacity}]`);
        }
      }

      if (isToday) {
        dayClasses.push('border-2 border-accent');
      }

      if (isSelected) {
        dayClasses.push('bg-primary border-2 border-primary');
        textClasses.push('text-primary-foreground');
      }

      days.push(
        <TouchableOpacity key={day} className="w-[14.28%] h-12 justify-center items-center" onPress={() => setSelectedDate(dayDate)}>
          <View className={`w-10 h-10 max-w-[90%] aspect-square rounded-lg justify-center items-center ${dayClasses.join(' ')}`}>
            <Text className={textClasses.join(' ')}>{day}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const logsForSelectedDay = useMemo(() => {
    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
    return groupedLogs[selectedDateString] || [];
  }, [groupedLogs, selectedDate]);

  const filteredLogs = useMemo(() => {
    if (activeFilter === 'All') {
      return logsForSelectedDay;
    }
    // Map filter name to log type (e.g., 'Seizures' -> 'seizure')
    const filterType = activeFilter.slice(0, -1).toLowerCase();
    return logsForSelectedDay.filter((log) => log.type === filterType);
  }, [logsForSelectedDay, activeFilter]);

  return (
    <View className="flex-1 items-center bg-background">
      {/* Top App Bar */}
      <View className="w-full max-w-lg flex-row items-center justify-between px-4 pb-2" style={{ paddingTop: insets.top + 8 }}>
        <TouchableOpacity onPress={handlePrevMonth} className="w-12 h-12 items-center justify-center">
          <MaterialIcons name="chevron-left" size={30} className="text-foreground" />
        </TouchableOpacity>
        <Text variant="title3" className="text-center">
          {format(currentDate, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} className="w-12 h-12 items-center justify-center">
          <MaterialIcons name="chevron-right" size={30} className="text-foreground" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, width: '100%', maxWidth: 500, justifyContent: 'center', alignSelf: 'center', gap: 8 }}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              className={`h-8 rounded-2xl items-center justify-center px-4 ${
                activeFilter === filter ? 'bg-accent' : 'bg-card border border-border'
              }`}
              onPress={() => setActiveFilter(filter)}
            >
              <Text className={`text-sm font-medium ${activeFilter === filter ? 'text-accent-foreground' : ''}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView>
        {/* Calendar Grid */}
        <View className="w-full max-w-lg self-center px-4 pb-4">
          <View className="flex-row">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} className="flex-1 text-center text-xs font-bold h-10 leading-10 text-muted-foreground">{day}</Text>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {renderCalendarGrid()}
          </View>
        </View>

        {/* Selected Day Detail View */}
        <View className="w-full max-w-lg self-center flex-1 rounded-t-2xl bg-card/70 px-4 pb-24">
          <Text variant="title3" className="pt-6 pb-2">Logs for {format(selectedDate, 'MMMM d')}</Text>
          <View className="gap-2">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log: any, index: number) => (
                <View key={index} className="flex-row items-center justify-between min-h-[56px]">
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-10 h-10 rounded-lg items-center justify-center bg-primary/20">
                      <MaterialIcons name={log.icon || 'edit'} size={24} className="text-primary" />
                    </View>
                    <Text className="text-base flex-1">{log.name || log.type}</Text>
                  </View>
                  <Text className="text-sm text-muted-foreground">{format(new Date(log.created_at), 'p')}</Text>
                </View>
              ))
            ) : (
              <Text className="text-muted-foreground text-center mt-5">No logs for this day.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dayCell: {
    width: '14.28%', // Corresponds to w-[14.28%]
    height: 48,      // Corresponds to h-12
  },
});