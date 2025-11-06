import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import CalendarScreen from '../../../app/(tabs)/calendar';

// Import the mocked hooks to control their return values in tests
import { useLogs } from '@/contexts/LogsContext';

// Mock the hooks used in the component
jest.mock('@/repositories/LogsContext', () => ({
  useLogs: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn().mockReturnValue('#000000'), // Return a default color
}));

describe('CalendarScreen', () => {
  const mockFetchLogs = jest.fn();

  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
    (useLogs as jest.Mock).mockReturnValue({
      logs: [],
      isLoading: false,
      error: null,
      fetchLogs: mockFetchLogs,
    });
  });

  it('should display a loading indicator when isLoading is true', () => {
    (useLogs as jest.Mock).mockReturnValue({
      isLoading: true,
      logs: [],
      error: null,
      fetchLogs: mockFetchLogs,
    });

    render(<CalendarScreen />);

    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should display an error message and a retry button when an error occurs', () => {
    const errorMessage = 'Can’t connect right now.';
    (useLogs as jest.Mock).mockReturnValue({
      isLoading: false,
      logs: [],
      error: errorMessage,
      fetchLogs: mockFetchLogs,
    });

    render(<CalendarScreen />);

    expect(screen.getByText(errorMessage)).toBeTruthy();
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeTruthy();

    fireEvent.press(retryButton);
    expect(mockFetchLogs).toHaveBeenCalledTimes(1);
  });

  it('should display the list of logs when data is fetched successfully', () => {
    const mockLogs = [
      { id: '1', created_at: '2024-01-01T12:00:00Z', user_id: 'user1' },
      { id: '2', created_at: '2024-01-02T12:00:00Z', user_id: 'user1' },
    ];
    (useLogs as jest.Mock).mockReturnValue({
      isLoading: false,
      logs: mockLogs,
      error: null,
      fetchLogs: mockFetchLogs,
    });

    render(<CalendarScreen />);

    expect(screen.getByText('Log History')).toBeTruthy();
    expect(screen.getByText(/log from: 1\/1\/2024/i)).toBeTruthy();
    expect(screen.getByText(/log from: 1\/2\/2024/i)).toBeTruthy();
  });

  it('should display a message when there are no logs', () => {
    render(<CalendarScreen />);

    expect(screen.getByText('No logs found yet. Keep tracking!')).toBeTruthy();
  });
});