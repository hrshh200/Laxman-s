// utils/fonts.ts
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;

export function getFontSize(size: number) {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}
