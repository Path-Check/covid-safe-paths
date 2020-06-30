import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { MetaContext } from '../Context';
import { Info } from '../Info';
import { InfoText } from '../components/InfoText';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Caregiver = ({ navigation }) => {
  let { t } = useTranslation();
  let { completeRoute } = useContext(MetaContext);
  return (
    <Info
      ctaAction={() => {
        navigation.push(completeRoute);
      }}
      backgroundColor={Colors.primaryBackgroundFaintShade}
      backgroundImage={Images.IsolatePathBackground}
      icon={Icons.Isolate}
      ctaTitle={t('assessment.caregiver_cta')}>
        <InfoText useTitleStyle='headline2'
          title={t('assessment.caregiver_title')}
          description={t('assessment.caregiver_description')} />
    </Info>
  );
};
