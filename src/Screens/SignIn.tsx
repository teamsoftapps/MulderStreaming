import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {RootStackParamList} from '../Components/Type';
import {useNavigation} from '@react-navigation/native';
import TextImport from '../Components/TextImport';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import WrapperContainer from '../Components/WrapperContainer';
import {useSignINMutation} from '../store/Api/Auth';
import {useDispatch} from 'react-redux';
import {setToken, setUser} from '../store/slices/authSlice';
import ToastMessage from '../hooks/ToastMessage.js';
import * as RNLocalize from 'react-native-localize';
import MulderLogo from '../../Assets/images/name.png';
import MulderLogoDutch from '../../Assets/images/name_dutch.png';
import i18n from '../Components/i18next';
type props = StackNavigationProp<RootStackParamList, 'SignIn'>;
type SignInProps = {
  setbool: (value: boolean) => void;
  changeLanguage: (langCode: string | null) => void;
};
const SignIn = ({setbool, changeLanguage}: SignInProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation<props>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signIN] = useSignINMutation();
  const dispatch = useDispatch();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {Toasts} = ToastMessage();
  const [showModal, setShowModal] = useState(false);

  // const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
  const deviceLanguage = i18n.language.split('-')[0];

  console.log('dsdsdsdsdsds', t);

  const firstName = deviceLanguage === 'nl' ? 'JAN' : 'IAN';

  const Signin = async () => {
    let payload = {
      email: email.toLowerCase(),
      password: password,
    };
    setLoading(true);
    try {
      const res = await signIN(payload).unwrap();
      if (res?.data) {
        console.log('responce from signIn:', res?.data);
        dispatch(setToken(res?.data?.user?.token));
        dispatch(setUser(res));
        Toasts('Info', 'Logged in successfully!', 'success');
      } else {
        Toasts('Info', 'Please Buy Premium Subsription', 'info');
        setShowModal(true);
      }
    } catch (error) {
      Toasts('Error', 'Your subscription has expired!', 'error');
      if (error.data.message === 'Your subscription has been expired!') {
        setModalVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContainer barstatus={true} style={{flex: 1}} bgColor="#1c1508">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: responsiveWidth(8),
                marginTop:
                  Platform.OS === 'android'
                    ? responsiveHeight(10)
                    : responsiveHeight(5),
              }}>
              <View style={styles.maimHeading}>
                {deviceLanguage === 'nl' ? (
                  <Image
                    source={MulderLogoDutch}
                    resizeMode="contain"
                    style={{
                      height: responsiveHeight(10),
                      width: '100%',
                    }}
                  />
                ) : (
                  <Image
                    source={MulderLogo}
                    resizeMode="contain"
                    style={{height: responsiveHeight(10), width: '100%'}}
                  />
                )}
              </View>
              <Text style={styles.welcomeBack}>{t('Welcome Back')}</Text>
              <Text style={styles.loginText}>
                {t('Login with your account')}
              </Text>

              <View style={styles.inputContainer}>
                <TextImport
                  keyboard_Type="email-address"
                  ref={emailRef}
                  imageSource={require('../../Assets/images/emalIMG.png')}
                  placeholder={t('Email')}
                  initialValue={email}
                  onChangeText={setEmail}
                  editable={!loading}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextImport
                  ref={passwordRef}
                  imageSource={require('../../Assets/images/password.png')}
                  placeholder={t('Password')}
                  initialValue={password}
                  onChangeText={setPassword}
                  editable={!loading}
                  secureTextEntry={passwordVisible}
                  returnKeyType="done"
                  onSubmitEditing={Signin}
                />
              </View>

              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{
                  width: '100%',
                  paddingHorizontal: responsiveWidth(3),
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={{
                    height: responsiveWidth(6),
                    width: responsiveWidth(6),
                    borderColor: '#fff',
                    borderWidth: responsiveWidth(0.2),
                    borderRadius: responsiveWidth(1),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {!passwordVisible ? (
                    <Image
                      source={require('../../Assets/images/tick.png')}
                      style={{
                        height: responsiveWidth(4),
                        width: responsiveWidth(4),
                        tintColor: '#fff',
                      }}
                    />
                  ) : null}
                </TouchableOpacity>

                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(1.6),
                    paddingLeft: responsiveWidth(1.5),
                  }}>
                  {t('Show Password')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={Signin}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" size={responsiveHeight(4)} />
                ) : (
                  <Text style={styles.buttonText}>{t('Sign In')}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
                disabled={loading}>
                <Text style={styles.forgotPasswordText}>
                  {t('Forgot Password?')}
                </Text>
              </TouchableOpacity>
              <Text style={styles.signupText}>
                {t("Don't have an account?")}{' '}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('SignUp')}
                  disabled={loading}>
                  {t('Sign Up Here')}
                </Text>
              </Text>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.heading}>
                      Do you want to renew Subscription?
                    </Text>

                    <View
                      style={[
                        styles.buttonContainer,
                        {marginTop: responsiveHeight(2)},
                      ]}>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={{
                          flex: 1,
                          backgroundColor: '#1c1508',
                          height: responsiveHeight(4),
                          justifyContent: 'center',
                          borderRadius: responsiveWidth(1.1),
                        }}>
                        <Text style={{textAlign: 'center', color: '#fff'}}>
                          No
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          try {
                            navigation.navigate('CustomWebViewContent');
                            setModalVisible(false);
                          } catch (error) {
                            console.error('Error deleting playlist:', error);
                          }
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: '#1c1508',
                          height: responsiveHeight(4),
                          justifyContent: 'center',
                          borderRadius: responsiveWidth(1.1),
                        }}>
                        <Text style={{textAlign: 'center', color: '#fff'}}>
                          Yes
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#9D824F',
    borderRadius: 10,
    alignItems: 'center',
  },
  heading: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',

    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    width: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
      Platform.OS === 'ios' ? -responsiveWidth(6.5) : -responsiveWidth(6),
    fontFamily: 'TrajanPro-Bold',
  },
  welcomeBack: {
    fontSize: responsiveFontSize(3.5),
    color: '#f0f0f0',
    marginBottom: responsiveHeight(1),
    fontWeight: 'thin',
  },
  loginText: {
    fontSize: responsiveFontSize(2),
    color: '#f0f0f0',
    marginBottom: responsiveHeight(4),
    fontWeight: 'thin',
  },
  inputContainer: {
    width: responsiveWidth(80),
    height: responsiveHeight(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: responsiveHeight(4),
    flexDirection: 'column',
    zIndex: 10,
  },
  button: {
    height: responsiveHeight(6),
    backgroundColor: '#CCAA6B',
    borderRadius: responsiveWidth(6),
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(50),
    marginVertical: responsiveHeight(4),
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: responsiveHeight(2),
  },
  forgotPasswordText: {
    color: '#CCAA6B',
    fontSize: responsiveFontSize(1.5),
  },
  signupLink: {
    color: '#CCAA6B',
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: responsiveFontSize(1.7),
    color: '#f0f0f0',
    textAlign: 'center',
    marginVertical: responsiveHeight(4),
  },
  disabledButton: {
    backgroundColor: '#CCAA6B',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },

  continueButton: {
    flex: 1,
    backgroundColor: '#1c1508',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SignIn;
