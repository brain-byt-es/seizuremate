import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { cn } from '@/lib/cn';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
);

const Input = React.forwardRef<
  RNTextInput,
  React.ComponentPropsWithoutRef<typeof RNTextInput> & VariantProps<typeof inputVariants>
>(({ className, ...props }, ref) => {
  return <RNTextInput ref={ref} className={cn(inputVariants({ className }))} {...props} />;
});
Input.displayName = 'Input';

export { Input };

