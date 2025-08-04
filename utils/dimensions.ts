// utils/dimensions.ts
import { Dimensions } from 'react-native';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

// Lock at app launch
export const LockedWindowDimensions = {
  width: window.width,
  height: window.height,
};

export const LockedScreenDimensions = {
  width: screen.width,
  height: screen.height,
};
