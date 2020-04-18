import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import packageJson from '../../package.json';
import team from './../assets/svgs/team';
import fontFamily from './../constants/fonts';
import languages from './../locales/languages';
import { isPlatformiOS } from './../Util';
import lock from '../assets/svgs/lock';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
import { CROSSED_PATHS, DEBUG_MODE } from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import { checkIntersect } from '../helpers/Intersect';

const dayBinSize = 28; // Number of day in the standard day-bin array (4 weeks)

class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tapCount: 0, // tracks number of taps, for debugging
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.setState({ tapCount: 0 });
    this.backToMain();
    return true;
  };

  componentDidMount() {
    GetStoreData(DEBUG_MODE).then(dbgMode => {
      if (dbgMode == 'true') {
        this.setState({ tapCount: 4 });
      }
    });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleTapTeam = () => {
    this.setState({ tapCount: this.state.tapCount + 1 });
    if (this.state.tapCount >= 3) {
      if (this.state.tapCount == 3) {
        // Debug mode on
        SetStoreData(DEBUG_MODE, 'true');

        // Create faux intersection data
        let pseudoBin = [];
        for (let i = 0; i < dayBinSize; i++) {
          const intersections = Math.max(
            0,
            Math.floor(Math.random() * 50 - 20),
          );
          pseudoBin.push(intersections);
        }
        let dayBin = JSON.stringify(pseudoBin);
        SetStoreData(CROSSED_PATHS, dayBin);
      } else if (this.state.tapCount == 7) {
        // Debug mode off

        // Wipe faux intersection data
        let pseudoBin = [];
        for (let i = 0; i < dayBinSize; i++) {
          pseudoBin.push(0);
        }
        let dayBin = JSON.stringify(pseudoBin);
        SetStoreData(CROSSED_PATHS, dayBin);

        this.setState({ tapCount: 0 });
        SetStoreData(DEBUG_MODE, 'false');

        // Kick off intersection calculations to restore data
        checkIntersect();
      }
    }
  };

  render() {
    return (
      <NavigationBarWrapper
        title={languages.t('label.about_title')}
        onBackPress={this.backToMain.bind(this)}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.spacer} />
          <View style={styles.spacer} />

          <SvgXml style={styles.aboutSectionIconLock} xml={lock} />
          <Text style={styles.aboutSectionTitles}>
            {languages.t('label.commitment')}
          </Text>
          <Text style={styles.aboutSectionPara}>
            {languages.t('label.commitment_para')}
          </Text>

          <View>
            <Text style={{ marginTop: 20, color: Colors.RED_TEXT }}>
              {this.state.tapCount > 3 ? 'In exposure demo mode' : null}
            </Text>
            <SvgXml
              onPress={this.handleTapTeam}
              style={
                (styles.aboutSectionIconTeam,
                {
                  width: 40.38,
                  height: 19,
                  backgroundColor: this.state.tapCount > 3 ? 'red' : null,
                })
              }
              xml={team}
            />
          </View>
          <Text style={styles.aboutSectionTitles}>
            {languages.t('label.team')}
          </Text>
          <Text style={styles.aboutSectionPara}>
            {languages.t('label.team_para')}
          </Text>

          <View style={styles.spacer} />
          <View style={styles.spacer} />

          <View style={styles.main}>
            <View style={styles.row}>
              <Text style={styles.aboutSectionParaBold}>Version: </Text>
              <Text style={styles.aboutSectionPara}>{packageJson.version}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.aboutSectionParaBold}>OS:</Text>
              <Text style={styles.aboutSectionPara}>
                {' '}
                {Platform.OS + ' v' + Platform.Version}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.aboutSectionParaBold}>Dimensions:</Text>
              <Text style={styles.aboutSectionPara}>
                {' '}
                {Math.trunc(Dimensions.get('screen').width) +
                  ' x ' +
                  Math.trunc(Dimensions.get('screen').height)}
              </Text>
            </View>
          </View>

          <View style={styles.spacer} />
          <View style={styles.spacer} />
        </ScrollView>
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: Colors.INTRO_WHITE_BG,
    paddingHorizontal: 26,
    // flex: 1,
    paddingBottom: 42,
  },
  section: {
    flexDirection: 'column',
    width: '87.5%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
  },
  aboutSectionIconLock: {
    width: 20,
    height: 26.67,
    marginTop: 36,
  },
  aboutSectionTitles: {
    color: Colors.VIOLET_TEXT,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
    marginTop: 9,
  },
  aboutSectionPara: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryRegular,
  },
  aboutSectionParaBold: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryBold,
  },
  spacer: {
    marginVertical: '2%',
  },
  row: {
    flexDirection: 'row',
    color: Colors.PRIMARY_TEXT,
    alignItems: 'flex-start',
  },
});

export default AboutScreen;
