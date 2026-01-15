import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, Image} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

interface SettingMenuProps {
  imageSource: any;
  mainText: string;
  optionText?: string;
}
const SettingMenu: React.FC<SettingMenuProps> = ({
  imageSource,
  mainText,
  optionText = '',
}) => {
  return (
    <View style={styles.optionContainer}>
      <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: responsiveWidth(0.1),
          borderBottomColor: '#9D824F',
          marginVertical: responsiveHeight(1.5),
          paddingBottom: responsiveHeight(1.8),
        }}>
        <Image
          tintColor={'#fff'}
          source={imageSource}
          style={{
            width: responsiveWidth(6.5),
            height: responsiveHeight(6.5),
            resizeMode: 'contain',
          }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginLeft: responsiveWidth(6.5),
          }}>
          <Text
            style={{
              color: '#f0f0f0',
              fontSize: responsiveFontSize(2.3),
              marginTop: responsiveHeight(0.5),
            }}>
            {mainText}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {optionText && (
            <Text
              style={{
                color: 'gray',
                fontSize: responsiveFontSize(1.8),
                marginTop: responsiveHeight(0.5),
              }}>
              {optionText}
            </Text>
          )}
          <Image
            source={require('../../Assets/images/arrowright.png')}
            style={{
              width: responsiveWidth(6),
              height: responsiveHeight(4),
              resizeMode: 'contain',
              marginStart: responsiveWidth(6),
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    // flex: 1,
    // marginHorizontal: responsiveWidth(3),
  },
  horizontalLine: {
    height: responsiveWidth(0.3),
    backgroundColor: '#9D824F',
    width: '100%',
  },
});

export default SettingMenu;
