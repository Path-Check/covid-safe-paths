import React, { Component } from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import BackgroundOverlayImage from './../../assets/images/launchScreenBackgroundOverlay.png';
import languages, {
  LOCALE_LIST,
  findUserLang
} from './../../locales/languages';
import ButtonWrapper from '../../components/ButtonWrapper';
import NativePicker from '../../components/NativePicker';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { LANG_OVERRIDE } from '../../constants/storage';
import { SetStoreData } from '../../helpers/General';
import DynamicText from '../../components/DynamicText';

const width = Dimensions.get('window').width;

class Onboarding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: undefined,
    };
  }

  componentDidMount() {
    findUserLang(res => {
      this.setState({ language: res });
    });
  }

  render() {
    return (
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <ImageBackground
          source={BackgroundOverlayImage}
          style={styles.backgroundImage}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='transparent'
            translucent={true}
          />
          <View style={styles.mainContainer}>
            <View
              style={{
                paddingTop: 60,
                position: 'absolute',
                alignSelf: 'center',
                zIndex: 10,
              }}>
              <NativePicker
                languagePicker // pass picker type to handle RTL checking because we can reuse this picker for any type not language picker only
                items={LOCALE_LIST}
                value={this.state.language}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ language: itemValue });

                  // If user picks manual lang, update and store setting
                  languages.changeLanguage(itemValue, (err, t) => {
                    if (err)
                      return console.log(
                        'something went wrong in lang change',
                        err,
                      );
                  });

                  SetStoreData(LANG_OVERRIDE, itemValue);

                }}
              />
            </View>
            <View style={styles.contentContainer}>
              <DynamicText style={styles.mainText}>
                {languages.t('label.launch_screen1_header')}
              </DynamicText>
            </View>
            <View style={styles.footerContainer}>
              <ButtonWrapper
                title={languages.t('label.launch_get_started')}
                onPress={() => this.props.navigation.replace('Onboarding2')}
                buttonColor={Colors.VIOLET}
                bgColor={Colors.WHITE}
              />
            </View>
          </View>
        </ImageBackground>
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
    width: width * 0.75,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  mainText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    lineHeight: 35,
    color: Colors.WHITE,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
});

export default Onboarding;
