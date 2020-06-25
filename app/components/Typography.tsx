import React from 'react';
import { Text, TextStyle } from 'react-native';

import { useLanguageDirection } from '../locales/languages';

import { Typography as TypographyStyles } from '../styles';

type TypographicUse = 'headline1' | 'headline2' | 'headline3' | 'body1' | 'body2' | 'body3' | 'body4';

interface TypographyProps {
  use?: TypographicUse;
  style?: TextStyle;
  testID?: string;
  children: JSX.Element | string;
  onPress?: () => void;
}

export const Typography = ({
  use = 'body1',
  style,
  testID,
  children,
  onPress,
}: TypographyProps): JSX.Element => {
  const writingDirection = useLanguageDirection();

  const useToStyle = () => {
    switch (use) {
      case 'headline1': {
        return TypographyStyles.header1;
      }
      case 'headline2': {
        return TypographyStyles.header2;
      }
      case 'headline3': {
        return TypographyStyles.header3;
      }
      case 'body1': {
        return TypographyStyles.mainContent;
      }
      case 'body2': {
        return TypographyStyles.secondaryContent;
      }
      case 'body3': {
        return TypographyStyles.tertirayContent;
      }
      case 'body4': {
        return TypographyStyles.quaternaryContent;
      }
    }
  };

  const textStyle = useToStyle();

  return (
    <Text
      onPress={onPress}
      style={[textStyle, { writingDirection }, style]}
      testID={testID}>
      {children}
    </Text>
  );
};
