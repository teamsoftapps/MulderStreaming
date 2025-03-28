import React from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

const CustomWebViewComponent = () => {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{
          uri: 'https://music-app-final-theta.vercel.app/extend-subscription',
        }}
        style={styles.webView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webView: {
    flex: 1,
  },
});

export default CustomWebViewComponent;
