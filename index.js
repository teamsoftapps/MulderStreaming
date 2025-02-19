import 'intl-pluralrules'; // Polyfill for Intl API
import React from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from './App'; // Your main app file
import {store} from './src/store/store';
import {persistore} from './src/store/store';
import {name as appName} from './app.json';
import toastConfig from './src/config/toastConfig';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';

const newApp = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistore}>
        <StatusBar backgroundColor="#1c1508" barStyle="light-content" />
        <App />
        <Toast position="top" config={toastConfig} />
      </PersistGate>
    </Provider>
  );
};

TrackPlayer.registerPlaybackService(() => require('./service'));
AppRegistry.registerComponent(appName, () => newApp);
