import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export function IconWithBar({
  iconName,
  color,
  focused,
}: {
  iconName: any;
  color: string;
  focused: boolean;
}) {
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: focused ? 0 : -10, // Slide down when focused
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: color,
            transform: [{ translateY }],
            opacity: focused ? 1 : 0,
          },
        ]}
      />
      <View style={styles.iconInner}>
        <IconSymbol name={iconName} color={color} size={26} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    paddingTop: 0,
    paddingBottom: 6,
  },
  iconInner: {
    zIndex: 1,
  },
  bar: {
    position: 'absolute',
    top: 0,
    height: 3,
    width: '250%',
    borderRadius: 999,
    zIndex: 0,
  },
});
