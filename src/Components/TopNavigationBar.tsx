import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface TextImportProps {
  title: string;
  // menuImage?: any;
  showBackButton: boolean;
}
const TopNavigationBar: React.FC<TextImportProps> = ({
  title,
  showBackButton,
}) => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          onPress={handleGoBack}
          style={{position: 'absolute', left: 0}}>
          <Image source={require('../../Assets/images/GoBack.png')} />
        </TouchableOpacity>
      )}
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: responsiveHeight(6), // Adjust height as needed
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: responsiveWidth(2),
    width: '100%',
  },
  title: {
    fontSize: responsiveFontSize(2.8),
    color: '#9D824F',
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
    width: '50%',
    // fontWeight: 'bold',
  },
});

export default TopNavigationBar;
