import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { Images } from '../../assets';
import { Button } from '../../components/Button';
import { Type, Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { config } from '../../COVIDSafePathsConfig';
import languages from '../../locales/languages';
import onboardingCompleteAction from '../../store/actions/onboardingAction';
import { sharedStyles } from './styles';

const width = Dimensions.get('window').width;

const Onboarding4 = ({ navigation, dispatchOnboardingComplete }) => {
  const isGPS = config.tracingStrategy === 'gps';
  const backgroundImage = isGPS ? Images.LaunchScreen1 : Images.LaunchScreen1BT;
  const headerText = isGPS
    ? languages.t('label.launch_screen4_header_location')
    : languages.t('label.launch_screen4_header_bluetooth');
  const subheaderText = isGPS
    ? languages.t('label.launch_screen4_subheader_location')
    : languages.t('label.launch_screen4_subheader_bluetooth');
  const buttonText = isGPS
    ? languages.t('label.launch_set_up_phone_location')
    : languages.t('label.launch_set_up_phone_bluetooth');

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent
      />
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <Typography style={styles.headerText} use={Type.Headline2}>
          {headerText}
        </Typography>
        <Typography style={styles.subheaderText}>{subheaderText}</Typography>
      </View>
      <View style={styles.verticalSpacer} />
      <View style={sharedStyles.footerContainer}>
        <Button
          label={buttonText}
          onPress={
            isGPS
              ? () => navigation.replace('Onboarding5')
              : dispatchOnboardingComplete
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    top: '-10%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.INTRO_WHITE_BG,
  },
  contentContainer: {
    width: width * 0.9,
    flex: 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: Colors.VIOLET,
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.VIOLET,
    fontSize: 16,
    fontFamily: fontFamily.primaryRegular,
  },
  verticalSpacer: {
    flex: 1,
  },
});

const mapDispatchToProps = dispatch => ({
  dispatchOnboardingComplete: () => dispatch(onboardingCompleteAction()),
});
export default connect(null, mapDispatchToProps)(Onboarding4);
