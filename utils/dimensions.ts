import { Dimensions, ScaledSize } from 'react-native';

let windowDimensions: ScaledSize = Dimensions.get('window');
let screenDimensions: ScaledSize = Dimensions.get('screen');

// Lock initial dimensions
export function getWindowDimensions() {
  return windowDimensions;
}

export function getScreenDimensions() {
  return screenDimensions;
}

// Optional: Update if you need to handle orientation changes
export function updateDimensions() {
  windowDimensions = Dimensions.get('window');
  screenDimensions = Dimensions.get('screen');
}