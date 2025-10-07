import {StackNavigationProp} from '@react-navigation/stack';
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  Image,
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
import WrapperContainer from '../Components/WrapperContainer';
import {useSignUPMutation} from '../store/Api/Auth';
import ToastMessage from '../hooks/ToastMessage.js';
import PasswordInput from '../Components/passwordToggle';
import MulderLogo from '../../Assets/images/name.png';
import MulderLogoDutch from '../../Assets/images/name_dutch.png';
import i18n from '../Components/i18next';
type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

interface SignUpResponse {
  status?: string;
  message?: string;
}

interface SignUpError {
  data?: {
    message?: string;
  };
  status?: number;
}

const SignUp = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const {Toasts} = ToastMessage();
  const {t} = useTranslation();
  const [signUp, {isLoading}] = useSignUPMutation();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const accessCodeRef = useRef<TextInput>(null);

  const deviceLanguage = i18n.language.split('-')[0];

  console.log('deviceLanguage', deviceLanguage);

  // const handleSignUp = async () => {
  //   if (!email || !password || !accessCode) {
  //     Toasts('Error', 'Please fill all fields', 'error');
  //     return;
  //   }
  //   const payload = {
  //     email: email,
  //     password: password,
  //     code: accessCode.toUpperCase(),
  //   };
  //   try {
  //     const result = await signUp(payload);
  //     Toasts(
  //       result.data?.status === 'success'
  //         ? 'Account Created!'
  //         : 'Invalid Code!',
  //       result?.error?.data?.message || result?.data?.message,
  //       'success',
  //     );
  //     if (!result?.error) {
  //       navigation.navigate('SignIn');
  //     }
  //   } catch (error) {
  //     console.error('Error in sign-up:', error);
  //     Toasts('Error', error, 'error');
  //   }
  // };
  const handleSignUp = async () => {
    if (!email || !password || !accessCode) {
      Toasts('Error', 'Please fill all fields', 'error');
      return;
    }
    const payload = {
      email: email.toLowerCase(), // Normalize email
      password,
      code: accessCode.toUpperCase(),
    };
    try {
      const result = await signUp(payload).unwrap(); // Use .unwrap() for RTK Query
      const successResponse = result as SignUpResponse;
      Toasts(
        successResponse.status === 'success'
          ? 'Account Created!'
          : 'Invalid Code!',
        successResponse.message || 'Success',
        'success',
      );
      navigation.navigate('SignIn');
    } catch (error: any) {
      const errorResponse = error as SignUpError;
      Toasts(
        'Error',
        errorResponse.data?.message || 'An error occurred during sign-up',
        'error',
      );
    }
  };

  return (
    <WrapperContainer barstatus={true} style={{flex: 1}} bgColor="#1c1508">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 0}}
            keyboardShouldPersistTaps="handled">
            <View
              style={{
                flex: 1,
                padding: responsiveWidth(15),
                alignItems: 'center',
                justifyContent: 'center',
                width: responsiveWidth(100),
                height: responsiveHeight(85),
                marginTop: Platform.OS === 'android' ? responsiveHeight(4) : 0,
              }}>
              <View style={styles.maimHeading}>
                {deviceLanguage === 'nl' ? (
                  <Image
                    source={MulderLogoDutch}
                    resizeMode="contain"
                    style={{height: responsiveHeight(10), width: '100%'}}
                  />
                ) : (
                  <Image
                    source={MulderLogo}
                    resizeMode="contain"
                    style={{height: responsiveHeight(10), width: '100%'}}
                  />
                )}
              </View>

              {deviceLanguage === 'nl' ? (
                <Text allowFontScaling={false} style={styles.welcomeBack}>
                  Aanmelden
                </Text>
              ) : (
                <Text allowFontScaling={false} style={styles.welcomeBack}>
                  {t('Create your account')}
                </Text>
              )}

              {deviceLanguage === 'nl' ? (
                <Text allowFontScaling={false} style={styles.loginText}>
                  {t('Heeft u nog niet geabonneerd?') + ' '}
                  <Text
                    style={[styles.loginText, {color: '#CCAA6B'}]}
                    onPress={() =>
                      Linking.openURL('https://www.ianmulder.us/streaming')
                    }>
                    {t('Klik hier')}
                  </Text>
                </Text>
              ) : (
                <Text allowFontScaling={false} style={styles.loginText}>
                  {t("Don't have a subscription yet?") + ' '}
                  <Text
                    style={[styles.loginText, {color: '#CCAA6B'}]}
                    onPress={() =>
                      Linking.openURL('https://www.ianmulder.us/streaming')
                    }>
                    {t('Subscribe here')}
                  </Text>
                </Text>
              )}

              <View style={styles.inputContainer}>
                <TextImport
                  keyboard_Type="email-address"
                  ref={emailRef}
                  imageSource={require('../../Assets/images/emalIMG.png')}
                  placeholder={t('Email')}
                  initialValue={email}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onChangeText={setEmail}
                  textContentType="emailAddress"
                  autoComplete="email"
                  importantForAutofill="yes"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <PasswordInput
                  ref={passwordRef}
                  imageSource={require('../../Assets/images/password.png')}
                  placeholder={t('Password')}
                  initialValue={password}
                  returnKeyType="next"
                  onSubmitEditing={() => accessCodeRef.current?.focus()}
                  onChangeText={setPassword}
                  textContentType="newPassword"
                  autoComplete="password-new"
                  importantForAutofill="yes"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextImport
                  ref={accessCodeRef}
                  imageSource={require('../../Assets/images/key.png')}
                  placeholder={t('Access key code')}
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                  initialValue={accessCode}
                  onChangeText={setAccessCode}
                  keyboard_Type="default"
                  textContentType="none"
                  autoComplete="off"
                  importantForAutofill="no"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size={responsiveHeight(4)} />
                ) : (
                  <Text style={styles.buttonText}>{t('Sign Up')}</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.signupText}>
                {t('Already have an account?')}{' '}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('SignIn')}>
                  {t('Sign In')}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  maimHeading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(60),
  },
  logo: {
    fontSize: responsiveFontSize(6),
    marginBottom: responsiveHeight(1),
    color: '#FFF7D6',
    fontFamily: 'TrajanPro-Bold',
  },
  ianText: {
    color: '#FFF7D6',
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
    transform: [{rotate: '-90deg'}],
    marginBottom:
      Platform.OS === 'ios' ? responsiveHeight(3) : responsiveHeight(1.7),
    marginRight:
      Platform.OS === 'ios' ? -responsiveWidth(3) : -responsiveWidth(2.5),
    fontFamily: 'TrajanPro-Bold',
  },
  welcomeBack: {
    fontSize: responsiveFontSize(3.5),
    color: '#f0f0f0',
    marginBottom: responsiveHeight(1),
    fontWeight: 'thin',
    width: responsiveWidth(90),
    textAlign: 'center',
  },
  loginText: {
    fontSize: responsiveFontSize(2),
    color: '#f0f0f0',
    marginBottom: responsiveHeight(4),
    fontWeight: 'thin',
    width: responsiveWidth(90),
    textAlign: 'center',
    // backgroundColor: 'red',
  },
  inputContainer: {
    width: responsiveWidth(80),
    height: responsiveHeight(3),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    height: responsiveHeight(6),
    backgroundColor: '#CCAA6B',
    borderRadius: responsiveWidth(6),
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(50),
    marginTop: responsiveHeight(6),
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  signupLink: {
    color: '#CCAA6B',
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: responsiveFontSize(1.7),
    color: '#f0f0f0',
    textAlign: 'center',
    marginVertical: responsiveHeight(2),
  },
});

export default SignUp;
