import { cn } from "@/lib/utils";
import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import {
    FlatList,
    Platform,
    Pressable,
    useWindowDimensions,
    View,
} from "react-native";

interface CarouselProps<T> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  containerClassName?: string;
  contentContainerClassName?: string;
  itemWidth?: number;
  itemGap?: number;
  showControls?: boolean;
  onIndexChanged?: (index: number) => void;
  autoplay?: boolean;
  autoplayInterval?: number;
}

function Carousel<T>({
  data,
  renderItem,
  keyExtractor,
  containerClassName,
  contentContainerClassName,
  itemWidth,
  itemGap = 16,
  showControls = true,
  onIndexChanged,
  autoplay = false,
  autoplayInterval = 3000,
}: CarouselProps<T>) {
  const flatListRef = React.useRef<FlatList<T>>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { width: windowWidth } = useWindowDimensions();

  const dimensions = React.useMemo(
    () => ({
      itemWidth: itemWidth || windowWidth * 0.8,
      gap: itemGap,
    }),
    [itemWidth, windowWidth, itemGap]
  );

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < data.length - 1;

  const handleScrollTo = React.useCallback(
    (index: number) => {
      flatListRef.current?.scrollToIndex({ animated: true, index });
    },
    [flatListRef]
  );

  const handlePrev = () => {
    if (canScrollPrev) {
      handleScrollTo(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canScrollNext) {
      handleScrollTo(currentIndex + 1);
    }
  };

  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex(newIndex);
        onIndexChanged?.(newIndex);
      }
    },
    [onIndexChanged]
  );

  React.useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      if (canScrollNext) {
        handleScrollTo(currentIndex + 1);
      } else {
        handleScrollTo(0); // Loop back to start
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, currentIndex, handleScrollTo, canScrollNext]);

  return (
    <View className={cn("relative", containerClassName)}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={dimensions.itemWidth + dimensions.gap}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        contentContainerClassName={cn(
          `px-[${(windowWidth - dimensions.itemWidth) / 2}px]`,
          contentContainerClassName
        )}
        className="w-full"
        getItemLayout={(_data, index) => ({
          length: dimensions.itemWidth,
          offset: (dimensions.itemWidth + dimensions.gap) * index,
          index,
        })}
      />
      {showControls && (
        <>
          <CarouselControl
            onPress={handlePrev}
            disabled={!canScrollPrev}
            icon="chevron-left"
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />
          <CarouselControl
            onPress={handleNext}
            disabled={!canScrollNext}
            icon="chevron-right"
            className="absolute right-4 top-1/2 -translate-y-1/2"
          />
        </>
      )}
    </View>
  );
}

const CarouselControl = ({
  onPress,
  disabled,
  icon,
  className,
}: {
  onPress: () => void;
  disabled: boolean;
  icon: "chevron-left" | "chevron-right";
  className?: string;
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={cn(
      "h-10 w-10 items-center justify-center rounded-full bg-background/80",
      Platform.OS === "ios" ? "ios:shadow-md" : "android:elevation-4",
      disabled && "opacity-50",
      className
    )}
  >
    <MaterialIcons name={icon} size={28} className="text-foreground" />
  </Pressable>
);

export { Carousel };
