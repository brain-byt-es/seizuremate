import { Text } from '@/components/nativewindui/Text';
import { Calendar } from '@/components/ui/nativeui/calendar';
import { useLogs } from '@/contexts/LogsContext';
import { useAuth } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const FILTERS = ['All', 'Seizures', 'Symptoms', 'Meds'];

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('All');
  const { logs, fetchLogs } = useLogs();
  const { isLoaded, isSignedIn } = useAuth();

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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
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
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect as any}
          onMonthChange={handleMonthChange}
          firstDayOfWeek={0} // Sunday
        />

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