import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import WebView from 'react-native-webview';
import TopNavigationBar from './TopNavigationBar';

const WebViewContent = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: '#111111',
          paddingHorizontal: responsiveWidth(5),
          paddingTop:
            Platform.OS === 'ios' ? responsiveHeight(3) : responsiveHeight(0),
        }}>
        <TopNavigationBar title="" showBackButton={true} />
      </View>
      <WebView
        originWhitelist={['*']}
        // source={{
        //   html: '<h1>Custom WebView Content</h1><p>This is a custom message inside the WebView.</p>',
        // }}
        // source={{uri: 'https://app.janmulder.us/'}}
        source={{uri: 'https://mulder-exclusive-content.vercel.app/'}}
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

export default WebViewContent;
