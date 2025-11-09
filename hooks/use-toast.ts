// This import path is an assumption. Please adjust it to wherever your UI library's toast hook is exported from.
import { useToast as useUiToast } from '@/components/ui/nativeui/toast';

type ToastType = 'success' | 'error' | 'info';

/**
 * A hook for showing toast notifications with pre-defined app tones.
 * This wraps the app's internal UI component toast.
 */
export function useToast() {
  const toast = useUiToast();

  const show = ({
    type,
    title,
    message,
  }: {
    type: ToastType;
    title: string;
    message: string;
  }) => {
    // The underlying toast component's `show` method expects a single string.
    // We will format our title and message into one.
    toast.show(`${title}: ${message}`);
  };

  return { show };
}