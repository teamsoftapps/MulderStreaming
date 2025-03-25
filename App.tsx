import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Platform, StatusBar} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import AuthStack from './src/Navigation/AuthStack';
import i18n from 'i18next';
import getDefaultLanguage from './src/Utils/getDefaultLanguage ';
import MainStack from './src/Navigation/MainStack';
import {useSelector} from 'react-redux';
import TrackPlayer, {Capability} from 'react-native-track-player';
import BootSplash from 'react-native-bootsplash';
import NetInfo from '@react-native-community/netinfo';
import ToastMessage from './src/hooks/ToastMessage.js';
function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState<string>('');
  const {Toasts} = ToastMessage();
  const userAuth = useSelector(state => state);
  const token = useSelector(state => state?.auth?.token?.data?.user?.token);
  const subscriptionId = useSelector(
    state => state?.auth?.token?.data?.user?.subscriptionID,
  );

  useEffect(() => {
    let wasConnected = true;
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected && wasConnected) {
        Toasts(
          'No Internet Connection!',
          'Please check your network settings.',
          'success',
        );
      } else if (state.isConnected && !wasConnected) {
        Toasts('Internet Restored!', 'You are back online', 'success');
      }
      wasConnected = state.isConnected;
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // Perform any async initialization tasks here
        console.log('Initializing app...');
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    init()
      .then(() => {
        console.log('Initialization completed');
      })
      .finally(async () => {
        await BootSplash.hide({fade: true});
        console.log('BootSplash has been hidden successfully');
      });
  }, []);

  console.log('Token:', userAuth?.auth?.token?.data?.user?.token);
  console.log('user Auth:asas', userAuth?.auth?.token?.data?.user);
  useEffect(() => {
    const defaultLanguage = getDefaultLanguage();
    setLanguage(defaultLanguage);
    i18n.changeLanguage(defaultLanguage);
    const setupTrackPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp: true,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
      } catch (error) {
        console.error('Error setting up TrackPlayer:', error);
      }
    };

    setupTrackPlayer();
  }, []);

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     SplashScreen.hide();
  //   }
  // }, []);

  const changeLanguage = (langCode: string | null) => {
    const newLang = langCode ?? getDefaultLanguage();
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <NavigationContainer>
      {token ? (
        <MainStack language={language} changeLanguage={changeLanguage} />
      ) : (
        <AuthStack
          setbool={setIsAuthenticated}
          changeLanguage={changeLanguage}
        />
      )}
    </NavigationContainer>
  );
}

export default App;
