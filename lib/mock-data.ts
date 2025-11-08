export type LogItem = {
  type: 'seizure' | 'meds' | 'symptom';
  intensity?: number;
  name?: string;
  time?: string;
  icon?: string;
  duration?: number; // duration in seconds
};

export type MockLogsType = {
  [key: string]: LogItem[];
};

export const MOCK_LOGS: MockLogsType = {
  '2024-10-03': [{ type: 'seizure', intensity: 0.2, duration: 60 }],
  '2024-10-05': [{ type: 'seizure', intensity: 0.4, duration: 90 }],
  '2024-10-10': [{ type: 'seizure', intensity: 0.2, duration: 45 }],
  '2024-10-15': [
    { type: 'seizure', name: 'Tonic-Clonic Seizure', time: '08:15 AM', icon: 'bolt', duration: 120 },
    { type: 'meds', name: 'Keppra 500mg', time: '09:00 AM', icon: 'medication' },
    { type: 'symptom', name: 'Dizziness', time: '02:30 PM', icon: 'sentiment_dissatisfied' },
  ],
  '2024-10-16': [{ type: 'seizure', intensity: 0.8, duration: 150 }],
  '2024-10-17': [{ type: 'seizure', intensity: 0.6, duration: 75 }],
  '2024-10-20': [{ type: 'seizure', intensity: 0.2, duration: 30 }],
  '2024-10-27': [{ type: 'seizure', intensity: 0.4, duration: 85 }],
};