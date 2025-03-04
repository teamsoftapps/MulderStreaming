import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ImageBackground, TouchableOpacity} from 'react-native';
import {Text, View, StyleSheet, Image, ScrollView} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useTranslation} from 'react-i18next';
import WrapperContainer from '../Components/WrapperContainer';

const AboutApplication = () => {
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
            <Text style={styles.appName}>{t('About Application')} </Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.content}>
              {t(
                "Welcome to the official IAN MULDER Music App - your gateway to an immersive musical journey with one of the industry's most captivating voices. This app has been meticulously crafted to provide you with an unparalleled music experience, tailored exclusively for the fans of [Singer's Name].",
              )}
            </Text>

            <Text style={styles.SubTitle}>{t('Discover the Artist')}</Text>
            <Text style={styles.content}>
              {t(
                "Get to know the artist behind the music. Dive into [Singer's Name]'s world and explore their musical evolution, personal anecdotes, and artistic vision. We've curated a collection of exclusive content, including interviews, behind-the-scenes moments, and personal insights straight from the artist.",
              )}
            </Text>
            <Text
              style={{
                ...styles.SubTitle,
              }}>
              {t('Stream Music Like Never Before')}
            </Text>
            <Text style={styles.content}>
              {t(
                "With this app, you can stream [Singer's Name]'s entire discography, from timeless classics to the latest chart-toppers. Whether you're in the mood for heartwarming ballads or energetic anthems, we've got you covered. Enjoy high-quality audio and create custom playlists to set the perfect mood for any occasion.",
              )}
            </Text>
            <Text style={styles.SubTitle}>{t('Be the First to Know')}</Text>
            <Text style={styles.content}>
              {t(
                "Stay ahead of the curve by receiving real-time updates on [Singer's Name]'s latest releases, upcoming tour dates, and exclusive fan events. This app is your direct line to all things [Singer's Name], so you'll never miss a beat",
              )}
            </Text>
            <Text style={styles.SubTitle}>
              {t('Connect with a Community of Fans')}
            </Text>
            <Text style={styles.content}>
              {t(
                "Share your passion for [Singer's Name]'s music with fellow fans. Our community feature allows you to interact, discuss, and share your thoughts with like-minded enthusiasts. You can even participate in fan contests and win exciting prizes.",
              )}
            </Text>
            <Text style={styles.SubTitle}>
              {t('Personalized Listening Experience')}
            </Text>
            <Text style={styles.content}>
              {t(
                'Tailor your listening experience with our personalized recommendations. Discover new tracks, artists, and albums based on your musical preferences and listening history. Your playlists will always be in tune with your taste.',
              )}
            </Text>
            <Text style={styles.SubTitle}>
              {t('Enjoy Music Anywhere, Anytime')}
            </Text>
            <Text style={styles.content}>
              {t(
                "Download your favorite tracks and albums for offline listening, perfect for those times when you're on the go or in areas withl imited connectivity.",
              )}
            </Text>
            <Text style={styles.SubTitle}>{t('Your Feedback Matters')}</Text>
            <Text style={styles.content}>
              {t(
                "We are committed to providing the best possible experience. Yourfeedback is essential to us. If you have any suggestions,questions, or concerns, please don't hesitate to contact our support team. Your voice will help shape the future of the [Singer's Name] Music App.",
              )}
            </Text>
            <Text style={styles.content}>
              {t(
                "Thank you for choosing to be a part of [Singer's Name]'s musical journey. Download the app now, and let the music speak to your heart.",
              )}
            </Text>
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
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
    marginRight: responsiveWidth(20),
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

export default AboutApplication;
