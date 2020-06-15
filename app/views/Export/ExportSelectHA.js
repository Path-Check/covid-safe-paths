import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  View,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';
import fontFamily from '../../constants/fonts';
import { Theme } from '../../constants/themes';
import getHealthcareAuthorities from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import healthcareAuthorityOptionsSelector from '../../store/selectors/healthcareAuthorityOptionsSelector';
import { Screens } from '../../navigation';

import { Icons } from '../../assets';
import { Colors } from '../../styles';

export const ExportSelectHA = ({ navigation }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHealthcareAuthorities());
  }, [dispatch]);

  const authorities = useSelector(healthcareAuthorityOptionsSelector);
  const [selectedAuthority, setSelectedAuthority] = useState(null);

  const toggleSelected = (HA) => {
    if (HA === selectedAuthority) {
      setSelectedAuthority(null);
    } else {
      setSelectedAuthority(HA);
    }
  };

  return (
    <Theme use='default'>
      <StatusBar
        barStyle='dark-content'
        backgroundColor={Colors.primaryBackgroundFaintShade}
        translucent={false}
      />
      <View style={styles.wrapper}>
        <SafeAreaView style={{ flex: 1, paddingBottom: 0 }}>
          <View style={{ paddingHorizontal: 24, paddingBottom: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: 12,
              }}>
              <IconButton
                icon={Icons.Close}
                size={22}
                onPress={() => navigation.navigate(Screens.ExportStart)}
              />
            </View>
            <Typography use='headline2' style={styles.exportSectionTitles}>
              {t('export.select_ha_title')}
            </Typography>
          </View>
          <Separator />
          <FlatList
            keyExtractor={({ name }, i) => `${name}:${i}`}
            renderItem={({ item: HA }) => (
              <TouchableHighlight
                underlayColor={Colors.UNDERLAY}
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 24,
                }}
                onPress={() => toggleSelected(HA)}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Typography
                    style={{ fontWeight: '500', paddingRight: 30 }}
                    use='body1'>
                    {HA.name}
                  </Typography>
                  {/* Preserve icon positioning to prevent adding wrapping  */}
                  <View style={{ opacity: selectedAuthority === HA ? 1 : 0 }}>
                    <SvgXml xml={Icons.Checkmark} width={24} height={24} />
                  </View>
                </View>
              </TouchableHighlight>
            )}
            alwaysBounceVertical={!!authorities}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={authorities}
            ListEmptyComponent={
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size={'large'} />
              </View>
            }
            ItemSeparatorComponent={() => <Separator />}
          />
        </SafeAreaView>
        <View style={styles.card}>
          <SafeAreaView style={{ paddingBottom: 44, paddingTop: 44 }}>
            <View style={{ paddingHorizontal: 24 }}>
              <Button
                style={styles.exportButton}
                label={t('common.next')}
                onPress={() =>
                  navigation.navigate(Screens.ExportCodeInput, {
                    selectedAuthority,
                  })
                }
                disabled={!selectedAuthority}
              />
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Theme>
  );
};

const Separator = () => (
  <View
    style={{
      backgroundColor: Colors.tertiaryViolet,
      height: StyleSheet.hairlineWidth,
      width: '100%',
    }}
  />
);

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.primaryBackgroundFaintShade },
  exportSectionTitles: {
    fontWeight: '500',
    color: Colors.violetTextDark,
    fontFamily: fontFamily.primaryMedium,
  },
  card: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default ExportSelectHA;
