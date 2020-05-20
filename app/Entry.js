import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, { Component } from 'react';

import { GetStoreData } from './helpers/General';
import AboutScreen from './views/About';
import ChooseProviderScreen from './views/ChooseProvider';
import HomeScreen from './views/DR/HomeScreen';
import MapScreen from './views/DR/Map';
import NewsScreen from './views/DR/News';
import ReportScreen from './views/DR/ReportScreen/index.js';
import Report from './views/DR/ReportScreen/ReportScreenQuestions';
import ResultsScreen from './views/DR/ReportScreen/Results';
import UserInfo from './views/DR/UserInfoScreen/index';
import { ExportScreen } from './views/Export';
import { ExposureHistoryScreen } from './views/ExposureHistory/ExposureHistory';
import ImportScreen from './views/Import';
import { LicensesScreen } from './views/Licenses';
import Onboarding1 from './views/onboarding/Onboarding1';
import Onboarding2 from './views/onboarding/Onboarding2';
import Onboarding3 from './views/onboarding/Onboarding3';
import Onboarding4 from './views/onboarding/Onboarding4';
import Onboarding5 from './views/onboarding/Onboarding5';
import { SettingsScreen } from './views/Settings';

const Stack = createStackNavigator();

class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRouteName: '',
    };
  }

  componentDidMount() {
    GetStoreData('ONBOARDING_DONE')
      .then(onboardingDone => {
        this.setState({
          initialRouteName: onboardingDone,
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <Stack.Navigator
        initialRouteName='InitialScreen'
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: {
            backgroundColor: 'transparent', // prevent white flash on Android
          },
        }}>
        {this.state.initialRouteName === 'true' ? (
          <Stack.Screen
            name='InitialScreen'
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name='InitialScreen'
            component={Onboarding1}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen
          name='Onboarding1'
          component={Onboarding1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Onboarding2'
          component={Onboarding2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Onboarding3'
          component={Onboarding3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Onboarding4'
          component={Onboarding4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Onboarding5'
          component={Onboarding5}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='HomeScreen'
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='NewsScreen'
          component={NewsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='MapScreen'
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ExportScreen'
          component={ExportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ImportScreen'
          component={ImportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='SettingsScreen'
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ChooseProviderScreen'
          component={ChooseProviderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='LicensesScreen'
          component={LicensesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ExposureHistoryScreen'
          component={ExposureHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='AboutScreen'
          component={AboutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ReportScreen'
          Report
          component={ReportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Report'
          component={Report}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Results'
          component={ResultsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='AuroraScreen'
          component={AboutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='UserInfo'
          component={UserInfo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
}

export default Entry;
