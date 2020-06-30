import React from 'react';
import { useTranslation } from 'react-i18next';

import { useStatusBarEffect } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';
import OnboardingTemplate from './OnboardingTemplate';

const PersonalPrivacy = (props) => {
  useStatusBarEffect('dark-content');
  const { t } = useTranslation();
  const { StrategyAssets, StrategyCopy } = useStrategyContent();

  return (
    <OnboardingTemplate
      background={StrategyAssets.personalPrivacyBackground}
      iconXml={StrategyAssets.personalPrivacyIcon}
      title={StrategyCopy.personalPrivacyHeader}
      body={StrategyCopy.personalPrivacySubheader}
      buttonLabel={t('label.launch_next')}
      buttonOnPress={() => props.navigation.replace('NotificatioNDetails')}
    />
  );
};

export default PersonalPrivacy;
