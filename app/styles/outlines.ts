import { ViewStyle } from 'react-native';

import * as Colors from './colors';

export const baseBorderRadius = 4;
export const borderRadiusLarge = 8;
export const borderRadiusMax = 500;

export const baseShadow: ViewStyle = {
  shadowColor: Colors.black,
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 7,
};

export const buttonShadow: ViewStyle = {
  ...baseShadow,
  shadowOffset: {
    width: 0,
    height: 3,
  },
};

export const upShadow: ViewStyle = {
  ...baseShadow,
  shadowOffset: {
    width: 0,
    height: -3,
  },
};

export const leftShadow: ViewStyle = {
  ...baseShadow,
  shadowOffset: {
    width: -3,
    height: -3,
  },
};

export const downShadow: ViewStyle = {
  ...baseShadow,
  shadowOffset: {
    width: 0,
    height: 3,
  },
};

const baseHRule: ViewStyle = {
  borderColor: Colors.tertiaryBackground,
};

export const bottomHRule: ViewStyle = {
  ...baseHRule,
  borderBottomWidth: 1,
};

export const topHRule: ViewStyle = {
  ...baseHRule,
  borderTopWidth: 1,
};
