import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigation/AuthStack';
import i18n from 'i18next';
import getDefaultLanguage from './src/Utils/getDefaultLanguage ';
import MainStack from './src/Navigation/MainStack';
import {useSelector} from 'react-redux';
import TrackPlayer, {Capability} from 'react-native-track-player';
import BootSplash from 'react-native-bootsplash';
import NetInfo from '@react-native-community/netinfo';
import ToastMessage from './src/hooks/ToastMessage.js';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState<string>('');
  const {Toasts} = ToastMessage();
  const token = useSelector(state => state?.auth?.token?.data?.user?.token);

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
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    init()
      .then(() => {})
      .finally(async () => {
        await BootSplash.hide({fade: true});
      });
  }, []);

  useEffect(() => {
    const initLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('appLanguage');
        const defaultLanguage = savedLang ?? getDefaultLanguage();
        setLanguage(defaultLanguage);
        i18n.changeLanguage(defaultLanguage);
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    initLanguage();
    // const defaultLanguage = getDefaultLanguage();
    // setLanguage(defaultLanguage);
    // i18n.changeLanguage(defaultLanguage);

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

  // const changeLanguage = (langCode: string | null) => {
  //   const newLang = langCode ?? getDefaultLanguage();
  //   setLanguage(newLang);
  //   i18n.changeLanguage(newLang);
  // };

  const changeLanguage = async (langCode: string | null) => {
    try {
      const newLang = langCode ?? getDefaultLanguage();
      setLanguage(newLang);
      i18n.changeLanguage(newLang);
      await AsyncStorage.setItem('appLanguage', newLang); // 💾 persist selection
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
