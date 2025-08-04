// utils/responsive.ts
import { RFValue } from "react-native-responsive-fontsize";

export const font = (size: number) => {
  return RFValue(size, 812); // 812 is based on iPhone X height, you can adjust
};

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const vw = (percentage: number) => (width * percentage) / 100;
export const vh = (percentage: number) => (height * percentage) / 100;
