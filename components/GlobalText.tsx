// components/GlobalText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { getFontSize } from '@/utils/fonts';

interface GlobalTextProps extends TextProps {
  size?: number;
  bold?: boolean;
}

export default function GlobalText({
  size = 16,
  bold = false,
  style,
  ...props
}: GlobalTextProps) {
  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: getFontSize(size),
          fontFamily: bold ? 'Poppins-Bold' : 'Poppins-Regular',
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#222',
  },
});
