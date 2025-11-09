import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";

interface SkeletonProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <View
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };

