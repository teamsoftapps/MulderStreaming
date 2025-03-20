import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
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
import TextImport from '../Components/TextImport';
import {useTranslation} from 'react-i18next';
import {useConfirmUserMutation} from '../store/Api/Auth';
import ToastMessage from '../hooks/ToastMessage.js';
import TopNavigationBar from '../Components/TopNavigationBar';
type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

const CheckSubscriptionCode = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [code, setCode] = useState('');

  const [confirmUser, {isLoading}] = useConfirmUserMutation();
  const {Toasts} = ToastMessage();
  const route = useRoute();
  const [email, setEmail] = useState(route.params?.email || '');

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);
  const handleForgotPassword = async () => {
    if (!code) {
      Toasts('Error', 'Input the code!', 'error');
      return;
    }

    try {
      const response = await confirmUser(email);

      const subscriptionEndDate = new Date(
        response?.data?.data?.user?.subscriptionEndDate,
      );

      const currentDate = new Date();

      if (subscriptionEndDate < currentDate) {
        Toasts('Error', 'Invalid Code!', 'error');
      } else {
        Toasts('Info', 'Subscription is valid!', 'success');
        navigation.navigate('SignIn');
      }
    } catch (error) {
      Toasts('Error', error?.message || error, 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              top: responsiveWidth(-18),
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

          <Text style={styles.welcomeBack}>{t('Check Subscription Code')}</Text>
          <Text style={styles.loginText}>
            {t('Enter the code sent to your email address.')}
          </Text>

          <View style={styles.inputContainer}>
            <TextImport
              imageSource={require('../../Assets/images/key.png')}
              placeholder={t('Code')}
              initialValue={code}
              onChangeText={value => {
                setCode(value);
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
    fontSize: responsiveFontSize(3),
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
    color: '#000',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
});

export default CheckSubscriptionCode;
