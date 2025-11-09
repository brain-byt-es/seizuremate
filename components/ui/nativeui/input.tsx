import { cn } from "@/lib/utils";
import * as React from "react";
import { Platform, TextInput } from "react-native";

const Input = React.forwardRef<
	TextInput,
	React.ComponentProps<typeof TextInput>
>(({ className, ...props }, ref) => {
	const [isFocused, setIsFocused] = React.useState(false);

	return (
		<TextInput
			className={cn(
				"h-12 w-full rounded-lg border bg-background px-3 text-base text-foreground shadow-sm",
				"disabled:cursor-not-allowed disabled:opacity-50",
				isFocused ? "border-ring" : "border-input",
				Platform.OS === "ios"
					? "ios:shadow-sm ios:shadow-foreground/10"
					: "android:elevation-1",
				className,
			)}
			ref={ref}
			textAlignVertical="center"
			placeholderTextColor="hsl(var(--muted-foreground))"
			underlineColorAndroid="transparent"
			onFocus={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			{...props}
		/>
	);
});

Input.displayName = "Input";

export { Input };

