import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLogs } from '@/constants/LogsContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { endOfMonth, endOfWeek, endOfYear, format, getDay, getDaysInMonth, getMonth, isWithinInterval, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const TIMEFRAMES = ['Weekly', 'Monthly', 'Yearly'];

const StatCard = ({ label, value }: { label: string; value: string }) => {
  const surfaceColor = useThemeColor('surface');
  const textColor = useThemeColor('text');
  const mutedColor = useThemeColor('muted');
  const { dark } = useTheme();

  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: !dark ? 0.08 : 0.35,
    shadowRadius: 12,
  };

  return (
    <View style={[styles.statCard, { backgroundColor: surfaceColor }, shadowStyle, { elevation: 5 }]}>
      <ThemedText style={[styles.statLabel, { color: mutedColor }]}>{label}</ThemedText>
      <ThemedText style={[styles.statValue, { color: textColor }]}>{value}</ThemedText>
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
  const surfaceColor = useThemeColor('surface');
  const { dark } = useTheme();
  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: !dark ? 0.08 : 0.35,
    shadowRadius: 12,
  };

  return (
    <View style={[styles.chartCard, { backgroundColor: surfaceColor }, shadowStyle, { elevation: 5 }]} {...props}>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      {children}
    </View>
  );
};

export default function InsightsScreen() {
  const [timeframe, setTimeframe] = useState('Weekly');
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor('background');
  const primaryColor = useThemeColor('primary');
  const surfaceColor = useThemeColor('surface');
  const mutedColor = useThemeColor('muted');
  const primaryTextColor = useThemeColor('primaryText');
  const segmentBackgroundColor = useThemeColor('surfaceAlt');
  const { dark } = useTheme();
  const { logs, fetchLogs } = useLogs();

  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: !dark ? 0.08 : 0.35,
    shadowRadius: 12,
  };

  useEffect(() => {
    // Fetch a year's worth of data for the insights page to work with
    const today = new Date('2024-10-17'); // Using fixed date for consistency with demo
    const firstDay = format(startOfYear(today), 'yyyy-MM-dd');
    const lastDay = format(endOfYear(today), 'yyyy-MM-dd');
    fetchLogs(firstDay, lastDay);
  }, [fetchLogs]);

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

    const seizuresInPeriod = Object.entries(logs)
      .filter(([date]) => isWithinInterval(new Date(date), { start, end }))
      .flatMap(([, logs]) => logs.filter(log => log.type === 'seizure'));

    const totalSeizures = seizuresInPeriod.length;

    const totalDuration = seizuresInPeriod.reduce((sum, log) => sum + (log.duration || 0), 0);
    const avgDuration = totalSeizures > 0 ? totalDuration / totalSeizures : 0;
    const avgDurationFormatted = `${Math.floor(avgDuration / 60)}m ${Math.round(avgDuration % 60)}s`;

    // Busiest Day/Month Logic
    const seizuresByTimeUnit: { [key: number]: number } = {};
    Object.entries(logs)
      .filter(([date]) => isWithinInterval(new Date(date), { start, end }))
      .forEach(([date, logs]) => {
        const d = new Date(date);
        const unit = timeframe === 'Yearly' ? getMonth(d) : getDay(d);
        const seizureCount = logs.filter(log => log.type === 'seizure').length;
        if (seizureCount > 0) {
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

    Object.entries(logs)
      .filter(([date]) => isWithinInterval(new Date(date), { start, end }))
      .forEach(([date, logs]) => {
        const d = new Date(date);
        let index;
        if (timeframe === 'Yearly') {
          index = getMonth(d);
        } else if (timeframe === 'Monthly') {
          // Simple weekly buckets for the month view
          index = Math.floor((d.getDate() - 1) / 7);
        } else { // Weekly
          index = (getDay(d) + 6) % 7; // Monday = 0
        }

        logs.forEach(log => {
          if (log.type === 'seizure') {
            if (index < dataPoints) { // Ensure index is within bounds for monthly buckets
              frequencyData[index]++;
              durationData[index] += log.duration || 0;
              durationCounts[index]++;
            }
          }
        });
      });

    const avgDailyDuration = durationData.map((total, i) => durationCounts[i] > 0 ? total / durationCounts[i] : 0);
    const maxDuration = Math.max(...avgDailyDuration, 1); // Avoid division by zero
    const barChartHeights = avgDailyDuration.map(d => (d / maxDuration) * 100);

    const busiestLabel = timeframe === 'Yearly' ? 'Busiest Month' : 'Busiest Day';

    return { totalSeizures, avgDurationFormatted, busiestPeriod, frequencyData, barChartHeights, labels, busiestLabel };
  }, [timeframe, logs]); // Recalculate when timeframe or logs change

  return (
    <ThemedView style={[styles.screen, { backgroundColor }]}>
      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerAction} />
        <ThemedText type="h3" style={styles.headerTitle}>Insights & Reports</ThemedText>
        <TouchableOpacity style={styles.headerAction} onPress={() => Alert.alert('Export', 'Export functionality is not yet implemented.')}>
          <ThemedText type="defaultSemiBold" style={{ color: primaryColor }}>Export</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Segmented Buttons */}
      <View style={styles.segmentContainer}>
        <View style={[styles.segment, { backgroundColor: segmentBackgroundColor }]}>
          {TIMEFRAMES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.segmentButton,
                timeframe === item && [styles.segmentButtonActive, { backgroundColor: surfaceColor }, shadowStyle, { shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 }],
              ]}
              onPress={() => setTimeframe(item)}
            >
              <ThemedText style={[styles.segmentText, timeframe !== item && { color: mutedColor }]}>{item}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText type="h3" style={styles.sectionTitle}>{timeframe} Overview</ThemedText>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Total Seizures" value={String(insightData.totalSeizures)} />
          <StatCard label="Avg. Duration" value={insightData.avgDurationFormatted} />
          <StatCard label={insightData.busiestLabel} value={insightData.busiestPeriod} />
        </View>

        {/* Charts */}
        <View style={styles.chartsContainer}>
          {/* Note: The charts below are static representations. For dynamic charts,
              consider using a library like 'react-native-svg' with 'd3-shape' or a dedicated charting library. */}

          {/* Weekly Seizure Frequency Chart */}
          <ChartCard title={`${timeframe} Seizure Frequency`}>
            <View style={styles.chartContainer}>
              <AreaChart data={insightData.frequencyData} width={300} height={150} color={primaryColor} />
            </View>
            <View style={styles.chartXAxis}>
              {insightData.labels.map((day) => (
                <ThemedText key={day} style={styles.xAxisLabel}>{day}</ThemedText>
              ))}
            </View>
          </ChartCard>

          {/* Average Daily Duration Chart */}
          <ChartCard title={`Average Duration (${timeframe})`}>
            <View style={styles.barChartContainer}>
              {insightData.barChartHeights.map((height, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View style={[styles.bar, { height: `${height}%`, backgroundColor: height > 60 ? primaryColor : `${primaryColor}4D` }]} />
                  <ThemedText style={styles.xAxisLabel}>{insightData.labels[index]}</ThemedText>
                </View>
              ))}
            </View>
          </ChartCard>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={[styles.reportButton, { backgroundColor: primaryColor }]} onPress={() => Alert.alert('Generate Report', 'Report generation is not yet implemented.')}>
          <MaterialIcons name="download" size={20} color={primaryTextColor} />
          <ThemedText type="defaultSemiBold" style={[styles.reportButtonText, { color: primaryTextColor }]}>
            Generate Report
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerAction: {
    width: 50,
    alignItems: 'flex-end',
  },
  headerTitle: {
    textAlign: 'center',
    flex: 1,
  },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    height: 40,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    // Shadow is applied inline
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Space for bottom nav
  },
  sectionTitle: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
    // Shadow applied inline
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  chartsContainer: {
    paddingVertical: 24,
    gap: 16,
  },
  chartCard: {
    borderRadius: 16,
    padding: 24,
    gap: 8,
    // Shadow applied inline
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
  xAxisLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.2,
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
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
