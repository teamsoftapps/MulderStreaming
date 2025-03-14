import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {RootStackParamList} from '../Components/Type';
import {useNavigation} from '@react-navigation/native';
import TextImport from '../Components/TextImport';
import {useTranslation} from 'react-i18next';
import {useForgetPasswordMutation} from '../store/Api/Auth';
import ToastMessage from '../hooks/ToastMessage.js';
import WrapperContainer from '../Components/WrapperContainer';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

const ForgotPassword = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [forgetPassword, {isLoading}] = useForgetPasswordMutation();
  const {Toasts} = ToastMessage();
  const handleForgotPassword = async () => {
    const payload = {email: email};

    try {
      const response = await forgetPassword(payload);

      if (response.data?.data?.id) {
        navigation.navigate('MakeSelectionForgotPassword', {
          data: response?.data?.data?.id,
        });
        Toasts('Info', response?.data?.message, 'success');
      } else {
        Toasts('Info', response?.data?.message, 'success');
      }
    } catch (error) {
      console.error('Error during forgot password:', error?.message || error);
      Toasts('Error', error?.message || error, 'error');
      alert(
        'An error occurred while trying to reset your password. Please try again later.',
      );
    }
  };

  return (
    <WrapperContainer barstatus={true} style={{flex: 1}} bgColor="#1c1508">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: responsiveWidth(8),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            tintColor={'#ccaa6b'}
            source={require('../../Assets/images/lock.png')}
            style={{
              width: responsiveWidth(30),
              height: responsiveHeight(40),
              resizeMode: 'contain',
            }}
          />

          <Text style={styles.welcomeBack}>{t('Forgot Password?')}</Text>
          <Text style={styles.loginText}>
            {t('Enter the email address associated with your account')}
          </Text>

          <View style={styles.inputContainer}>
            <TextImport
              imageSource={require('../../Assets/images/emalIMG.png')}
              placeholder={t('Email')}
              initialValue={email}
              onChangeText={value => {
                setEmail(value);
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleForgotPassword}>
            {isLoading ? (
              <ActivityIndicator size={responsiveHeight(4)} color={'#000'} />
            ) : (
              <Text style={styles.buttonText}>{t('next')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1508',
  },
  logo: {
    fontSize: responsiveFontSize(5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(4),
    fontFamily: 'serif',
    color: '#FFF7D6',
  },
  welcomeBack: {
    fontSize: responsiveFontSize(4),
    color: '#ccaa6b',
    marginBottom: responsiveHeight(1),
    fontWeight: 'thin',
  },
  loginText: {
    fontSize: responsiveFontSize(1.7),
    color: '#f0f0f0',
    marginBottom: responsiveHeight(1),
    fontWeight: 'thin',
    textAlign: 'center',
  },
  inputContainer: {
    width: responsiveWidth(80),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: responsiveHeight(7),
  },
  button: {
    height: responsiveHeight(6),
    backgroundColor: '#CCAA6B',
    borderRadius: responsiveWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(50),
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
