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
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {RootStackParamList} from '../Components/Type';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextImport from '../Components/TextImport';
import {useTranslation} from 'react-i18next';
import {useResetPasswordMutation} from '../store/Api/Auth';
import ToastMessage from '../hooks/ToastMessage.js';
import TopNavigationBar from '../Components/TopNavigationBar';
type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

const MakeSelectonForgotPassword = () => {
  const route = useRoute();
  const {data} = route.params;
  const {t} = useTranslation();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordReset, {isLoading}] = useResetPasswordMutation();
  const {Toasts} = ToastMessage();

  const handleForgotPassword = async () => {
    if (!newPassword || !verificationCode) {
      Toasts('Info', 'New password or verification code is missing', 'info');
      return;
    }

    try {
      const payload = {
        id: data,
        password: newPassword,
        resetPasswordVerificationCode: verificationCode,
      };

      const response = await passwordReset(payload);

      if (response?.data) {
        await Toasts('Success', 'Password reset successful', 'success');
        navigation.navigate('SignIn');
      } else {
        Toasts('Error', 'Failed to reset password. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Failed to reset password:', err);
      Toasts(
        'Error',
        err?.response?.data?.message ||
          'An error occurred. Please try again later.',
        'error',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: responsiveWidth(8),
            paddingTop: responsiveHeight(12),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              top: responsiveWidth(4),
              left: responsiveWidth(-12),
            }}>
            <TopNavigationBar title="" showBackButton={true} />
          </View>
          <Image
            source={require('../../Assets/images/resetpassword.png')}
            style={{
              width: responsiveWidth(30),
              height: responsiveHeight(30),
              resizeMode: 'contain',
            }}
          />

          <Text style={styles.welcomeBack}>{t('Reset Password')}</Text>
          <Text style={styles.loginText}>
            {t(
              'You just received a code via email. Please enter it below and set your desired password.',
            )}
          </Text>

          <View style={styles.inputContainer}>
            <TextImport
              imageSource={require('../../Assets/images/key.png')}
              placeholder={t('Verification Code')}
              initialValue={verificationCode}
              onChangeText={value => {
                setVerificationCode(value);
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextImport
              imageSource={require('../../Assets/images/password.png')}
              placeholder={t('Password')}
              initialValue={newPassword}
              onChangeText={value => {
                setNewPassword(value);
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleForgotPassword}>
            {isLoading ? (
              <ActivityIndicator size={responsiveHeight(4)} color={'#000'} />
            ) : (
              <Text style={styles.buttonText}>{t('Submit')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: responsiveHeight(2),
    fontWeight: 'thin',
    textAlign: 'center',
  },
  inputContainer: {
    width: responsiveWidth(80),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: responsiveHeight(6),
  },
  button: {
    height: responsiveHeight(6),
    backgroundColor: '#CCAA6B',
    borderRadius: responsiveWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(50),
    alignSelf: 'center',
    marginVertical: responsiveHeight(4),
  },
  buttonText: {
    color: '#000',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
});

export default MakeSelectonForgotPassword;
