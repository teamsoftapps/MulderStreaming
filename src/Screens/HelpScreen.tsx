import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useTranslation} from 'react-i18next';
import WrapperContainer from '../Components/WrapperContainer';

const HelpScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  return (
    <WrapperContainer style={styles.container}>
      <ImageBackground source={require('../../Assets/images/background.png')}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.TopContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../Assets/images/GoBack.png')}
                style={styles.appIcon}
              />
            </TouchableOpacity>
            <Text style={styles.appName}>{t('Help')}</Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.SubTitle}>
              {t("Need Help? We've Got You Covered!")}
            </Text>
            <Text style={styles.content}>
              {t(
                "Welcome to the Help Center of the IAN MULDER Music App. We're here to ensure you have the best possible experience while using our app. If you have any questions, concerns, or need assistance with anything related to the app, you're in the right place. Below, you'll find answers to some common questions and ways to get in touch with our support team.",
              )}
            </Text>
            <Text style={styles.SubTitle}>
              {t('FAQs (Frequently Asked Questions)')}
            </Text>
            <Text style={styles.SubTitle}>
              {' '}
              {t('How do I create a user account?')}
            </Text>

            <Text style={styles.content}>
              {t(
                "To create an account, click on the 'Sign Up' button on the login page and follow the on-screen instructions. You can also use your social media accounts for a quick and easy signup.",
              )}
            </Text>
            <Text
              style={{
                ...styles.SubTitle,
              }}>
              {t('How do I reset my password?')}
            </Text>
            <Text style={styles.content}>
              {t(
                "If you forget your password, you can reset it by clicking the 'Forgot Password' link on the login page. Follow the steps to  reset your password.",
              )}
            </Text>
            <Text style={styles.SubTitle}>
              {t('How do I navigate the app?')}
            </Text>
            <Text style={styles.content}>
              {t(
                "Our app is designed to be user-friendly, but if you need assistance, visit our 'Getting Started' section in the app for a quick tutorial.",
              )}
            </Text>
            <Text style={styles.SubTitle}>
              {t('How can I subscribe or cancel my subscription?')}
            </Text>
            <Text style={styles.content}>
              {t(
                "Subscriptions can be managed in the 'Settings' section of the app. To cancel a subscription, follow the provided instructions.",
              )}
            </Text>
            <Text style={styles.SubTitle}>
              {t('How can I report a problem or bug?')}
            </Text>
            <Text style={styles.content}>
              {t(
                "If you encounter any issues or bugs, please use the 'Report a Problem' feature in the app. We appreciate your feedback and will work to resolve any issues promptly.",
              )}
            </Text>
            <Text style={styles.SubTitle}>{t('Contact Us')}</Text>
            <Text style={styles.content}>
              {t(
                "If your question isn't addressed in the FAQs or if you have any other concerns, you can reach out to our dedicated support team. Here are the ways to contact us:",
              )}
            </Text>
            <Text style={styles.SubTitle}>Email: help@ianmulder.com</Text>
            <Text style={styles.SubTitle}>Phone: +1(514)550-3281</Text>
            <Text style={styles.content}>
              <Text style={styles.SubTitle}>{t('Sociale media')}:</Text> You can
              {t(
                "also reach out to us on our official social media channels for assistance. In-App Support: You can submit a support requestdirectly from the app. Go to the 'Help & Support' section, andclick on 'Submit a Support Request.' We'll get back to you as soon as possible.",
              )}
            </Text>
            <Text style={styles.content}>
              <Text style={styles.SubTitle}>{t('In-App Support')}:</Text>
              {t(
                "U kunt rechtstreeks vanuit de app een ondersteuningsverzoek indienen. Ga naar het gedeelte 'Hulp en ondersteuning' en klik op 'Een ondersteuningsverzoek indienen'. We nemen zo snel mogelijk contact met u op.",
              )}
            </Text>
            <Text style={styles.SubTitle}>{t('App Updates and Feedback')}</Text>
            <Text style={styles.content}>
              {t(
                "We are committed to improving the app and providing you with the best possible experience. Stay updated with the latest app features and improvements by visiting the 'Release Notes' section in the app. Your feedback is invaluable to us; please don't hesitate to share your thoughts and suggestions. We're listening!",
              )}
            </Text>
            <Text style={styles.content}>
              {t(
                "Thank you for choosing the IAN Mulder Music App. We hope this Help Center makes your app experience even more enjoyable. If you encounter any issues, have questions, or just want to say hello, we're here for you.",
              )}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                height: responsiveHeight(7),
                width: responsiveWidth(90),
                borderRadius: responsiveWidth(10),
                backgroundColor: '#ccaa6b',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: responsiveHeight(2),
              }}
              onPress={() => {
                const email = 'mail@janmulder.us'; // Email Address
                const subject = 'Help Request'; // Default Subject
                const body = ''; // Default Body

                const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(
                  subject,
                )}&body=${encodeURIComponent(body)}`;
                Linking.openURL(mailtoURL).catch(err =>
                  console.error('Error opening email app:', err),
                );
              }}>
              <Text
                style={{
                  color: '#1c1508',
                  fontSize: responsiveFontSize(2.5),
                  fontWeight: '600',
                }}>
                Compose a mail
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1508',
  },

  TopContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: responsiveWidth(2),
    paddingVertical: responsiveHeight(2),
  },
  content: {
    padding: responsiveWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
    color: '#989795',
    fontSize: responsiveFontSize(2.2),
    lineHeight: responsiveHeight(3.5),
  },
  appIcon: {
    width: responsiveWidth(2.5),
    height: responsiveHeight(5),
    resizeMode: 'contain',
    marginRight: responsiveWidth(15),
  },
  appName: {
    color: '#ccaa6b',
    fontSize: responsiveFontSize(3),
    marginRight: responsiveWidth(35),
    fontFamily: 'roboto-medium',
  },
  contentContainer: {
    padding: responsiveWidth(3),
  },
  SubTitle: {
    color: '#F0f0f0',
    fontSize: responsiveFontSize(2.2),
    marginVertical: responsiveHeight(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    paddingHorizontal: responsiveWidth(3),
  },
});

export default HelpScreen;
