import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/nativeui/tabs';
import { useLogs } from '@/contexts/LogsContext';
import { useAuth } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { endOfMonth, endOfWeek, endOfYear, format, getDay, getDaysInMonth, getMonth, isWithinInterval, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const TIMEFRAMES = ['Weekly', 'Monthly', 'Yearly'];

const StatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <View className="flex-1 gap-1 rounded-xl bg-card p-4 shadow-md">
      <Text className="text-sm font-medium text-muted-foreground">{label}</Text>
      <Text className="text-2xl font-bold tracking-tighter">{value}</Text>
    </View>
  );
};

const AreaChart = ({ data, width, height, color }: { data: number[], width: number, height: number, color: string }) => {
  if (!data || data.length === 0) {
    return <View style={{ width, height }} />;
  }

  const maxDataValue = Math.max(...data, 1); // Avoid division by zero
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (value / maxDataValue) * height;
    return { x, y };
  });

  // Function to create a smooth path
  const createPath = (chartPoints: {x: number, y: number}[]) => {
    let path = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const xMid = (chartPoints[i].x + chartPoints[i + 1].x) / 2;
      const yMid = (chartPoints[i].y + chartPoints[i + 1].y) / 2;
      const cp1x = (xMid + chartPoints[i].x) / 2;
      const cp2x = (xMid + chartPoints[i + 1].x) / 2;
      path += ` Q ${cp1x}, ${chartPoints[i].y}, ${xMid}, ${yMid}`;
      path += ` Q ${cp2x}, ${chartPoints[i + 1].y}, ${chartPoints[i + 1].x}, ${chartPoints[i + 1].y}`;
    }
    return path;
  };

  const linePath = createPath(points);

  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#gradient)" />
        <Path d={linePath} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </View>
  );
};

const ChartCard = ({ title, children, ...props }: { title: string } & ComponentProps<typeof View>) => {
  return (
    <View className="gap-2 rounded-2xl bg-card p-6 shadow-md" {...props}>
      <Text variant="body" className="font-semibold">{title}</Text>
      {children}
    </View>
  );
};

export default function InsightsScreen() {
  const [timeframe, setTimeframe] = useState('Weekly');
  const insets = useSafeAreaInsets();

  const { logs, fetchLogs } = useLogs();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }
    // Fetch a year's worth of data for the insights page to work with
    const today = new Date('2024-10-17'); // Using fixed date for consistency with demo
    const firstDay = format(startOfYear(today), 'yyyy-MM-dd');
    const lastDay = format(endOfYear(today), 'yyyy-MM-dd');
    fetchLogs(firstDay, lastDay).catch(e => console.error("Failed to fetch logs for insights:", e));
  }, [fetchLogs, isLoaded, isSignedIn]);

  // --- Data Processing Logic ---
  const insightData = useMemo(() => {
    // In a real app, 'today' would be new Date(). We use a fixed date to match the mock data.
    const today = new Date('2024-10-17');
    let start, end;
    let labels: string[] = [];
    let dataPoints = 0;

    switch (timeframe) {
      case 'Monthly':
        start = startOfMonth(today);
        end = endOfMonth(today);
        dataPoints = getDaysInMonth(today);
        labels = ['W1', 'W2', 'W3', 'W4']; // Simplified labels for monthly view
        break;
      case 'Yearly':
        start = startOfYear(today);
        end = endOfYear(today);
        dataPoints = 12;
        labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
        break;
      case 'Weekly':
      default:
        start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        end = endOfWeek(today, { weekStartsOn: 1 });
        dataPoints = 7;
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
    }

    const seizuresInPeriod = logs
      .filter(log => isWithinInterval(new Date(log.created_at), { start, end }) && log.type === 'seizure');

    const totalSeizures = seizuresInPeriod.length;

    const totalDuration = seizuresInPeriod.reduce((sum, log) => sum + (log.duration || 0), 0);
    const avgDuration = totalSeizures > 0 ? totalDuration / totalSeizures : 0;
    const avgDurationFormatted = `${Math.floor(avgDuration / 60)}m ${Math.round(avgDuration % 60)}s`;

    // Busiest Day/Month Logic
    const seizuresByTimeUnit: { [key: number]: number } = {};
    seizuresInPeriod
      .forEach(log => {
        const d = new Date(log.created_at);
        const unit = timeframe === 'Yearly' ? getMonth(d) : getDay(d);
        const seizureCount = 1; // Each log in seizuresInPeriod is one seizure
        if (seizureCount > 0) { // This check is a bit redundant now but safe
          seizuresByTimeUnit[unit] = (seizuresByTimeUnit[unit] || 0) + seizureCount;
        }
      });

    const busiestUnitIndex = Object.keys(seizuresByTimeUnit).length > 0
      ? parseInt(Object.entries(seizuresByTimeUnit).reduce((a, b) => a[1] > b[1] ? a : b)[0])
      : -1;

    let busiestPeriod = 'N/A';
    if (busiestUnitIndex !== -1) {
      if (timeframe === 'Yearly') {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        busiestPeriod = monthNames[busiestUnitIndex];
      } else {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        busiestPeriod = dayNames[busiestUnitIndex];
      }
    }

    // Chart Data
    const frequencyData = Array(dataPoints).fill(0);
    const durationData = Array(dataPoints).fill(0);
    const durationCounts = Array(dataPoints).fill(0);

    logs
      .filter(log => isWithinInterval(new Date(log.created_at), { start, end }))
      .forEach(log => {
        const d = new Date(log.created_at);
        let index;
        if (timeframe === 'Yearly') {
          index = getMonth(d);
        } else if (timeframe === 'Monthly') {
          // Simple weekly buckets for the month view
          index = Math.floor((d.getDate() - 1) / 7);
        } else { // Weekly
          index = (getDay(d) + 6) % 7; // Monday = 0
        }

        if (log.type === 'seizure' && index < dataPoints) {
          frequencyData[index]++;
          durationData[index] += log.duration || 0;
          durationCounts[index]++;
        }
      });

    const avgDailyDuration = durationData.map((total, i) => durationCounts[i] > 0 ? total / durationCounts[i] : 0);
    const maxDuration = Math.max(...avgDailyDuration, 1); // Avoid division by zero
    const barChartHeights = avgDailyDuration.map(d => (d / maxDuration) * 100);

    const busiestLabel = timeframe === 'Yearly' ? 'Busiest Month' : 'Busiest Day';

    return { totalSeizures, avgDurationFormatted, busiestPeriod, frequencyData, barChartHeights, labels, busiestLabel };
  }, [timeframe, logs]); // Recalculate when timeframe or logs change

  return (
    <View className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 pb-2" style={{ paddingTop: insets.top }}>
        <View className="w-12" />
        <Text variant="title3" className="flex-1 text-center">Insights & Reports</Text>
        <Button variant="plain" className="w-12 items-end" onPress={() => Alert.alert('Export', 'Export functionality is not yet implemented.')}>
          <Text variant="body" className="font-semibold text-primary">Export</Text>
        </Button>
      </View>

      {/* Segmented Buttons */}
      <View className="px-4 py-3">
        <Tabs value={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            {TIMEFRAMES.map((item) => (
              <TabsTrigger key={item} value={item}>{item}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>
        <Text variant="title3" className="pt-4 pb-2">{timeframe} Overview</Text>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Total Seizures" value={String(insightData.totalSeizures)} />
          <StatCard label="Avg. Duration" value={insightData.avgDurationFormatted} />
          <StatCard label={insightData.busiestLabel} value={insightData.busiestPeriod} />
        </View>

        {/* Charts */}
        <View className="py-6 gap-4">
          {/* Note: The charts below are static representations. For dynamic charts,
              consider using a library like 'react-native-svg' with 'd3-shape' or a dedicated charting library. */}

          {/* Weekly Seizure Frequency Chart */}
          <ChartCard title={`${timeframe} Seizure Frequency`}>
            <View style={styles.chartContainer}>
              <AreaChart data={insightData.frequencyData} width={300} height={150} color="hsl(var(--primary))" />
            </View>
            <View style={styles.chartXAxis}>
              {insightData.labels.map((day) => (
                <Text key={day} className="text-xs font-bold tracking-wider">{day}</Text>
              ))}
            </View>
          </ChartCard>

          {/* Average Daily Duration Chart */}
          <ChartCard title={`Average Duration (${timeframe})`}>
            <View style={styles.barChartContainer}>
              {insightData.barChartHeights.map((height, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View style={[styles.bar, { height: `${height}%`, backgroundColor: height > 60 ? 'hsl(var(--primary))' : 'hsla(var(--primary), 0.3)' }]} />
                  <Text className="text-xs font-bold tracking-wider">{insightData.labels[index]}</Text>
                </View>
              ))}
            </View>
          </ChartCard>
        </View>

        {/* Action Button */}
        <Button size="lg" className="flex-row gap-2" onPress={() => Alert.alert('Generate Report', 'Report generation is not yet implemented.')}>
          <MaterialIcons name="download" size={20} className="text-primary-foreground" />
          <Text variant="body" className="font-semibold text-primary-foreground">
            Generate Report
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  chartContainer: {
    height: 180,
    paddingTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  barChartContainer: {
    minHeight: 180,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 32,
    paddingBottom: 8,
    paddingHorizontal: 12,
    gap: 16,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 9999,
  },
});
