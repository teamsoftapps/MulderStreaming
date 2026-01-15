import React, {useEffect, useState} from 'react';
import * as RNLocalize from 'react-native-localize';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import TopNavigationBar from '../Components/TopNavigationBar';
import SettingMenu from '../Components/SettingMenu';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../Components/Type';
import AwesomeAlert from 'react-native-awesome-alerts';
import {useTranslation} from 'react-i18next';
import i18n from '../Components/i18next';
import WrapperContainer from '../Components/WrapperContainer';
import {useDispatch, useSelector} from 'react-redux';
import {clearUser} from '../store/slices/authSlice';
import TrackPlayer from 'react-native-track-player';
import {setCurrentSongg, togglePlaying} from '../store/slices/songState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from '../store/store';
import {useDeleteAccountMutation} from '../store/Api/Auth';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AboutApplication',
  'HelpScreen'
>;
type LanguageOption = {
  code: string;
  label: string;
};

const SettingScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const AuthData = useSelector(
    state => (state as RootState).auth?.token?.data?.user,
  );
  const token = useSelector(
    state => (state as RootState).auth?.token?.data?.user?.token,
  );
  const [deleteAccount] = useDeleteAccountMutation();
  console.log('Auth data in setting screen.', token);
  const dispatch = useDispatch();
  const availableLanguages: LanguageOption[] = [
    {code: 'en', label: 'English'},
    {code: 'nl', label: 'Dutch'},
  ];
  const handleEmailPress = () => {
    const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
    const email =
      deviceLanguage === 'nl' ? 'app@ianmulder.us' : 'app@janmulder.us';
    const subject = 'Help Request';
    const body = '';

    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoURL).catch(err =>
      console.error('Error opening email app:', err),
    );
  };
  // const changeLanguage = (langCode: string): void => {
  //   i18n.changeLanguage(langCode);
  //   const selectedLang = availableLanguages.find(
  //     lang => lang.code === langCode,
  //   );
  //   if (selectedLang) setSelectedLanguage(selectedLang.label);
  //   setAlertVisible(false);
  // };

  const changeLanguage = async (langCode: string): Promise<void> => {
    i18n.changeLanguage(langCode);
    const selectedLang = availableLanguages.find(
      lang => lang.code === langCode,
    );
    if (selectedLang) setSelectedLanguage(selectedLang.label);

    try {
      await AsyncStorage.setItem('appLanguage', langCode); // 💾 save selection
    } catch (error) {
      console.error('Error saving language:', error);
    }

    setAlertVisible(false);
  };

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('appLanguage');
        if (savedLang) {
          i18n.changeLanguage(savedLang);
          const selectedLang = availableLanguages.find(
            lang => lang.code === savedLang,
          );
          if (selectedLang) setSelectedLanguage(selectedLang.label);
        }
      } catch (error) {
        console.error('Error loading saved language:', error);
      }
    };
    loadSavedLanguage();
  }, []);

  const handleBiography = () => {
    const url = 'https://www.ianmulder.us/biography';
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteAccount().unwrap();

      dispatch(clearUser()); // clear token + user state

      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted.',
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to delete account. Please try again.');
    }
  };

  return (
    <WrapperContainer style={styles.container}>
      <TopNavigationBar title={t('Settings')} showBackButton={true} />

      <View style={styles.profile}>
        <Text
          style={{
            color: '#f0f0f0',
            fontSize: responsiveFontSize(2),
          }}>
          {AuthData.email}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setAlertVisible(true)}>
        <SettingMenu
          imageSource={require('../../Assets/images/langIcon.png')}
          mainText={t('Language')}
          optionText={selectedLanguage}
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} onPress={handleBiography}>
        <SettingMenu
          imageSource={require('../../Assets/images/about.png')}
          mainText={t('About Application')}
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} onPress={handleEmailPress}>
        <SettingMenu
          imageSource={require('../../Assets/images/help.png')}
          mainText={t('Help')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Alert.alert(
            'Delete Account',
            'This will permanently delete your account and all associated data. This action cannot be undone.',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Delete',
                style: 'destructive',
                onPress: confirmDelete,
              },
            ],
          );
        }}>
        <SettingMenu
          imageSource={require('../../Assets/images/delete.png')}
          mainText={t('Delete Account')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Alert.alert(
            t('Confirm Logout'),
            t('Are you sure you want to log out?'),
            [
              {
                text: t('No'),
                style: 'cancel',
              },
              {
                text: t('Yes'),
                onPress: async () => {
                  try {
                    await TrackPlayer.stop();
                    dispatch(togglePlaying(false));
                    dispatch(setCurrentSongg(null));
                    dispatch(clearUser());
                  } catch (error) {
                    console.error('Error during logout:', error);
                  }
                },
              },
            ],
          );
        }}>
        <SettingMenu
          imageSource={require('../../Assets/images/logoutimg.png')}
          mainText={t('Log Out')}
        />
      </TouchableOpacity>
      <AwesomeAlert
        show={alertVisible}
        showProgress={false}
        title={t('select language')}
        titleStyle={styles.titleStyle}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText={t('Cancel')}
        cancelButtonStyle={styles.cancelButtonStyle}
        cancelButtonColor="red"
        onCancelPressed={() => setAlertVisible(false)}
        contentContainerStyle={styles.alertContainer}
        customView={
          <View style={styles.languageContainer}>
            {availableLanguages.map(language => (
              <TouchableOpacity
                key={language.code}
                style={styles.languageOption}
                onPress={() => changeLanguage(language.code)}>
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === language.label &&
                      styles.selectedLanguage,
                  ]}>
                  {language.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        }
      />
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1508',
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(2),
  },

  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveHeight(0.5),
    marginTop: responsiveHeight(5),
  },

  alertContainer: {
    backgroundColor: '#CCAA6B',
    padding: 20,
    borderRadius: 10,
  },

  alertTitle: {
    color: '#FFF',
    backgroundColor: '#CCAA6B',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },

  languageContainer: {
    backgroundColor: '#CCAA6B',
  },

  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  languageText: {
    fontSize: responsiveFontSize(2),
    color: '#fff',
  },

  selectedLanguage: {
    fontWeight: 'bold',
    color: '#1c1508',
  },

  cancelButtonStyle: {
    backgroundColor: 'red',
    width: responsiveWidth(30),
    height: responsiveHeight(4),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: responsiveFontSize(2.2),
    color: '#333',
    fontWeight: 'bold',
  },
});

export default SettingScreen;
