import React from 'react';
import { SafeAreaView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { useStatusBarEffect } from '../navigation';
import { Typography } from './Typography';

import { Icons } from '../assets';
import { Spacing, Colors, Typography as TypographyStyles } from '../styles';

interface NavigationBarWrapperProps {
  children: React.ReactNode;
  title: string;
  onBackPress?: () => void;
  includeBackButton?: boolean;
}

export interface ThemeProps {
  navBar: string;
  background: string;
  navBarBorder: string;
  onNavBar: string;
}

export interface Theme {
  theme: ThemeProps;
}

export const NavigationBarWrapper = ({
  children,
  title,
  onBackPress,
  includeBackButton = true,
}: NavigationBarWrapperProps): JSX.Element => {
  useStatusBarEffect('light-content');

  const handleOnPressBack = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {includeBackButton ? (
        <View style={styles.headerContainer}>
          <View style={styles.leftContent}>
            <TouchableOpacity onPress={handleOnPressBack}>
              <SvgXml xml={Icons.BackArrow} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.middleContent}>
            <Typography style={styles.headerText}>{title}</Typography>
          </View>
          <View style={styles.rightContent} />
        </View>
      ) : null}
      <View style={styles.contentContainer}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navBar,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.navBar,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.small,
  },
  leftContent: {
    flex: 1,
  },
  middleContent: {
    flex: 3,
    alignItems: 'center',
  },
  rightContent: {
    flex: 1,
  },
  headerText: {
    ...TypographyStyles.navHeader,
  },
  contentContainer: {
    backgroundColor: Colors.primaryBackground,
    flex: 1,
  },
});
