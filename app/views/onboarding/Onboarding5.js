import React, { Component } from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  checkNotifications,
  request,
  requestNotifications,
} from 'react-native-permissions';
import { SvgXml } from 'react-native-svg';

import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import { isPlatformiOS } from './../../Util';
import IconDenied from '../../assets/svgs/permissionDenied';
import IconGranted from '../../assets/svgs/permissionGranted';
import IconUnknown from '../../assets/svgs/permissionUnknown';
import ButtonWrapper from '../../components/ButtonWrapper';
import { Type, Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { PARTICIPATE } from '../../constants/storage';
import { SetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';
import { HCAService } from '../../services/HCAService';

const width = Dimensions.get('window').width;

const PermissionStatusEnum = {
  UNKNOWN: 0,
  GRANTED: 1,
  DENIED: 2,
};

const StepEnum = {
  LOCATION: 0,
  NOTIFICATIONS: 1,
  HCA_SUBSCRIPTION: 2,
  DONE: 3,
};

const PermissionDescription = ({ title, status }) => {
  let icon;
  switch (status) {
    case PermissionStatusEnum.UNKNOWN:
      icon = IconUnknown;
      break;
    case PermissionStatusEnum.GRANTED:
      icon = IconGranted;
      break;
    case PermissionStatusEnum.DENIED:
      icon = IconDenied;
      break;
  }

  return (
    <View style={styles.permissionContainer}>
      <Typography style={styles.permissionTitle}>{title}</Typography>
      <SvgXml style={styles.permissionIcon} xml={icon} width={30} height={30} />
    </View>
  );
};

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: StepEnum.LOCATION,
      notificationPermission: PermissionStatusEnum.UNKNOWN,
      locationPermission: PermissionStatusEnum.UNKNOWN,
      authSubscriptionStatus: PermissionStatusEnum.UNKNOWN,
    };
  }

  componentDidMount() {
    this.checkLocationStatus();
    isPlatformiOS() && this.checkNotificationStatus();
    this.checkSubsriptionStatus();
  }

  isLocationChecked() {
    return this.state.locationPermission !== PermissionStatusEnum.UNKNOWN;
  }

  isNotificationChecked() {
    return this.state.notificationPermission !== PermissionStatusEnum.UNKNOWN;
  }

  /**
   * Helper method to determine the next step for permission requests.
   * In general there is a linear flow, but because Android does not
   * require permission for notifications, we skip the notifications
   * step on Android.
   *
   * @param {currentStep} StepEnum
   * @returns {StepEnum}
   */
  getNextStep(currentStep) {
    switch (currentStep) {
      case StepEnum.LOCATION:
        return isPlatformiOS()
          ? StepEnum.NOTIFICATIONS
          : StepEnum.HCA_SUBSCRIPTION;
      case StepEnum.NOTIFICATIONS:
        return StepEnum.HCA_SUBSCRIPTION;
      case StepEnum.HCA_SUBSCRIPTION:
        return StepEnum.DONE;
    }
  }

  async checkLocationStatus() {
    const nextStep = this.getNextStep(StepEnum.LOCATION);
    const setting = this.getLocationPermissionSetting();
    const status = await check(setting);

    switch (status) {
      case RESULTS.GRANTED:
        this.setState({
          currentStep: nextStep,
          locationPermission: PermissionStatusEnum.GRANTED,
        });
        break;
      case RESULTS.BLOCKED:
        this.setState({
          currentStep: nextStep,
          locationPermission: PermissionStatusEnum.DENIED,
        });
        break;
    }
  }

  async checkNotificationStatus() {
    const nextStep = this.getNextStep(StepEnum.NOTIFICATIONS);
    const { status } = await checkNotifications();

    console.log(status);

    switch (status) {
      case RESULTS.GRANTED:
        console.log('setting state!');
        console.log(nextStep);
        this.setState({
          currentStep: nextStep,
          notificationPermission: PermissionStatusEnum.GRANTED,
        });
        break;
      case RESULTS.BLOCKED:
        this.setState({
          currentStep: nextStep,
          notificationPermission: PermissionStatusEnum.DENIED,
        });
        break;
    }
  }

  async checkSubsriptionStatus() {
    const nextStep = this.getNextStep(StepEnum.HCA_SUBSCRIPTION);
    const hasUserSetSubscription = await HCAService.hasUserSetSubscription();

    // Only update state if the user has already set their subscription status
    if (hasUserSetSubscription) {
      const isEnabled = await HCAService.isAutosubscriptionEnabled();
      const authSubscriptionStatus = isEnabled
        ? PermissionStatusEnum.GRANTED
        : PermissionStatusEnum.DENIED;

      this.setState({
        currentStep: nextStep,
        authSubscriptionStatus,
      });
    }
  }

  /**
   * Gets the respective location permissions settings string
   * for the user's current device.
   *   */
  getLocationPermissionSetting() {
    return isPlatformiOS()
      ? PERMISSIONS.IOS.LOCATION_ALWAYS
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  }

  async requestLocation() {
    const nextStep = this.getNextStep(StepEnum.LOCATION);
    const locationPermission = this.getLocationPermissionSetting();
    const status = await request(locationPermission);

    switch (status) {
      case RESULTS.GRANTED:
        this.setState({
          currentStep: nextStep,
          locationPermission: PermissionStatusEnum.GRANTED,
        });
        break;
      case RESULTS.BLOCKED:
        this.setState({
          currentStep: nextStep,
          locationPermission: PermissionStatusEnum.DENIED,
        });
        break;
    }
  }

  async requestNotification() {
    const nextStep = this.getNextStep(StepEnum.NOTIFICATIONS);
    const { status } = await requestNotifications(['alert', 'badge', 'sound']);

    switch (status) {
      case RESULTS.GRANTED:
        this.setState({
          currentStep: nextStep,
          notificationPermission: PermissionStatusEnum.GRANTED,
        });
        break;
      case RESULTS.BLOCKED:
        this.setState({
          currentStep: nextStep,
          notificationPermission: PermissionStatusEnum.DENIED,
        });
        break;
    }
  }

  async requestHCASubscription() {
    const nextStep = this.getNextStep(StepEnum.HCA_SUBSCRIPTION);
    await HCAService.enableAutoSubscription();

    this.setState({
      currentStep: nextStep,
      authSubscriptionStatus: PermissionStatusEnum.GRANTED,
    });
  }

  /**
   * Allows the user to skip over a given step by setting the
   * permission for that step to `DENIED`
   * @returns {StepEnum}
   */
  skipCurrentStep() {
    const status = PermissionStatusEnum.DENIED;
    const nextStep = this.getNextStep(this.state.currentStep);

    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        this.setState({
          currentStep: nextStep,
          locationPermission: status,
        });
        break;
      case StepEnum.NOTIFICATIONS:
        this.setState({
          currentStep: nextStep,
          notificationPermission: status,
        });
        break;
      case StepEnum.HCA_SUBSCRIPTION:
        this.setState({
          currentStep: nextStep,
          authSubscriptionStatus: status,
        });
        break;
    }
  }

  async buttonPressed() {
    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        this.requestLocation();
        break;
      case StepEnum.NOTIFICATIONS:
        this.requestNotification();
        break;
      case StepEnum.HCA_SUBSCRIPTION:
        this.requestHCASubscription();
        break;
      case StepEnum.DONE:
        SetStoreData(PARTICIPATE, 'true');
        SetStoreData('ONBOARDING_DONE', true);
        this.props.navigation.replace('LocationTrackingScreen');
    }
  }

  getTitleText() {
    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        return languages.t('label.launch_location_header');
      case StepEnum.NOTIFICATIONS:
        return languages.t('label.launch_notif_header');
      case StepEnum.HCA_SUBSCRIPTION:
        return languages.t('label.launch_authority_header');
      case StepEnum.DONE:
        return languages.t('label.launch_done_header');
    }
  }

  getTitleTextView() {
    let style;

    if (this.state.currentStep === StepEnum.DONE) {
      style = styles.bigHeaderText;
    } else {
      style = styles.headerText;
    }

    return (
      <Typography style={style} use={Type.Headline2} testID='Header'>
        {this.getTitleText()}
      </Typography>
    );
  }

  getSubtitleText() {
    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        return languages.t('label.launch_location_subheader');
      case StepEnum.NOTIFICATIONS:
        return languages.t('label.launch_notif_subheader');
      case StepEnum.HCA_SUBSCRIPTION:
        return languages.t('label.launch_authority_subheader');
      case StepEnum.DONE:
        return languages.t('label.launch_done_subheader');
    }
  }

  getLocationPermission() {
    return (
      <>
        <View style={styles.divider} />
        <PermissionDescription
          title={languages.t('label.launch_location_access')}
          status={this.state.locationPermission}
        />
        <View style={styles.divider} />
      </>
    );
  }

  getNotificationsPermissionIfIOS() {
    return (
      isPlatformiOS() && (
        <>
          <PermissionDescription
            title={languages.t('label.launch_notification_access')}
            status={this.state.notificationPermission}
          />
          <View style={styles.divider} />
        </>
      )
    );
  }

  getAuthSubscriptionStatus() {
    return (
      <>
        <PermissionDescription
          title={languages.t('label.launch_authority_access')}
          status={this.state.authSubscriptionStatus}
        />
        <View style={styles.divider} />
      </>
    );
  }

  getButtonText() {
    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        return languages.t('label.launch_enable_location');
      case StepEnum.NOTIFICATIONS:
        return languages.t('label.launch_enable_notif');
      case StepEnum.HCA_SUBSCRIPTION:
        return languages.t('label.launch_enable_auto_subscription');
      case StepEnum.DONE:
        return languages.t('label.launch_finish_set_up');
    }
  }

  getSkipStepButton() {
    if (this.state.currentStep !== StepEnum.DONE) {
      return (
        <TouchableOpacity onPress={this.skipCurrentStep.bind(this)}>
          <Typography style={styles.skipThisStepBtn}>
            {languages.t('label.skip_this_step')}
          </Typography>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />

        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            {this.getTitleTextView()}
            <Typography style={styles.subheaderText}>
              {this.getSubtitleText()}
            </Typography>
            {this.getSkipStepButton()}
            <View style={styles.statusContainer}>
              {this.getLocationPermission()}
              {this.getNotificationsPermissionIfIOS()}
              {this.getAuthSubscriptionStatus()}
              <View style={styles.spacer} />
            </View>
          </View>
          <View style={styles.footerContainer}>
            <ButtonWrapper
              title={this.getButtonText()}
              onPress={this.buttonPressed.bind(this)}
              buttonColor={Colors.VIOLET}
              bgColor={Colors.WHITE}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    width: width * 0.9,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bigHeaderText: {
    color: Colors.WHITE,
    fontSize: 52,
    lineHeight: 47.5,
    paddingTop: 52 - 47.5, // lineHeight hack
    width: width * 0.7,
    fontFamily: fontFamily.primaryMedium,
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: 26,
    width: width * 0.8,
    fontFamily: fontFamily.primaryMedium,
  },
  subheaderText: {
    marginTop: '3%',
    color: Colors.WHITE,
    fontSize: 15,
    width: width * 0.55,
    fontFamily: fontFamily.primaryRegular,
  },
  statusContainer: {
    marginTop: '5%',
  },
  divider: {
    backgroundColor: Colors.DIVIDER,
    height: 1,
    marginVertical: '3%',
  },
  spacer: {
    marginVertical: '5%',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
  permissionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  permissionTitle: {
    color: Colors.WHITE,
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryRegular,
  },
  permissionIcon: {
    alignSelf: 'center',
  },
  skipThisStepBtn: {
    color: Colors.DIVIDER,
    paddingTop: 15,
  },
});

export default Onboarding;
