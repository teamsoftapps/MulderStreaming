import React from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import TopNavigationBar from './TopNavigationBar';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const CustomWebViewComponent = () => {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        // source={{
        //   html: '<h1>Custom WebView Content</h1><p>This is a custom message inside the WebView.</p>',
        // }}
        // source={{uri: 'https://app.janmulder.us/'}}
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
