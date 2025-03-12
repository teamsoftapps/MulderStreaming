import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StyleProp,
  ViewStyle,
  Button,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {RootState} from '../store';
import TrackPlayer, {State, useProgress} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {togglePlaying} from '../store/slices/songState';
import Slider from '@react-native-community/slider';
import {Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import AirPlay from 'react-native-airplay';
interface Track {
  _id: string;
  Song_Name: string;
  Song_File: string;
  Album_Name: string;
  Song_Length: string;
  Song_Lyrics: string;
  Album_Image: string;
}
interface BackgroundMusicPlayerProps {
  imageSource?: string;
  title?: string;
  subtitle?: string;
  song_file?: string;
  lyrics?: string;
  Song_Length: Number;
  functionForForward?: () => void;
  functionForBackward?: () => void;
  togglePlayMusic?: () => void;
  style?: StyleProp<ViewStyle>;
  paddingtop?: Number;
}

const BackgroundMusicPlayer: React.FC<BackgroundMusicPlayerProps> = ({
  imageSource = '',
  title,
  subtitle,
  lyrics,
  Song_Length,
  functionForBackward,
  functionForForward,
  togglePlayMusic,
  paddingtop,
}) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const animation = useRef(
    new Animated.Value(Dimensions.get('window').height * 0.1),
  ).current;
  const backgroundColor = animation.interpolate({
    inputRange: [
      Dimensions.get('window').height * 0.1,
      Dimensions.get('window').height,
    ],
    outputRange: ['#9D824F', '#1c1508'],
  });

  const {isPlaying} = useSelector((state: RootState) => state.musicPlayer);

  const toggleModalSize = () => {
    Animated.timing(animation, {
      toValue: isExpanded
        ? Dimensions.get('window').height * 0.1
        : Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(!isExpanded);
    });
  };

  const {position} = useProgress(500);
  const SongDuration = convertTimeToSeconds(Song_Length);
  function convertTimeToSeconds(time) {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const onSliderValueChange = async value => {
    await TrackPlayer.seekTo(value);
  };
  const handlePlayPause = async () => {
    setIsMusicPlaying(!isMusicPlaying);
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
      dispatch(togglePlaying(false));
    } else {
      await TrackPlayer.play();
      dispatch(togglePlaying(true));
    }
  };

  const onAirPlayPress = () => {
    AirPlay.showAirPlayPicker()
      .then(() => {
        console.log('AirPlay Picker is shown');
      })
      .catch(error => {
        console.error('AirPlay Error:', error);
      });
  };

  return (
    <Animated.View
      style={[
        styles.modalContainer,
        {
          height: animation,
          backgroundColor,
          paddingTop: isExpanded ? paddingtop : 0,
          zIndex: !isExpanded ? 10000 : 0,
          borderRadius: !isExpanded ? responsiveWidth(3) : 0,
        },
      ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          disabled={isExpanded ? true : false}
          style={[
            styles.modalContent,
            {
              flexDirection: !isExpanded ? 'row' : 'column',
              justifyContent: isExpanded ? null : 'center',
            },
          ]}
          onPress={!isExpanded ? toggleModalSize : null}>
          {isExpanded ? (
            <View style={{width: '100%'}}>
              <View style={styles.header}>
                <TouchableOpacity onPress={toggleModalSize}>
                  <Image
                    style={{marginRight: responsiveWidth(17)}}
                    source={require('../../Assets/images/down.png')}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.headerTitle,
                    {marginLeft: responsiveWidth(4)},
                  ]}>
                  {t('Now Playing')}
                </Text>
              </View>
              {imageSource ? (
                <Image
                  source={{uri: imageSource}}
                  style={[
                    styles.extendedimage,
                    {
                      width: '100%',
                      height: responsiveHeight(40),
                    },
                  ]}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <View
                style={{width: '100%', marginVertical: responsiveHeight(2)}}>
                <Text numberOfLines={1} style={styles.titleExpanded}>
                  {title}
                </Text>
                <Text style={styles.subtitleExpanded}>{subtitle}</Text>
              </View>
              <Slider
                style={{width: '100%'}}
                minimumValue={0}
                maximumValue={SongDuration}
                value={position}
                onValueChange={onSliderValueChange}
                minimumTrackTintColor="white"
                maximumTrackTintColor="gray"
                thumbTintColor="white"
              />
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}></View>

                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(position)}</Text>
                  <Text style={styles.timeText}>{Song_Length}</Text>
                </View>
                <Button title="Show AirPlay Picker" onPress={onAirPlayPress} />
              </View>
            </View>
          ) : (
            <View style={[styles.Container]}>
              {imageSource ? (
                <Image source={{uri: imageSource}} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <View style={{width: '65%'}}>
                <Text numberOfLines={1} style={styles.title}>
                  {title}
                </Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>
          )}

          <View
            style={[styles.controls, isExpanded && styles.controlsExpanded]}>
            <TouchableOpacity onPress={functionForBackward}>
              <Image
                source={require('../../Assets/images/backward-solid.png')}
                style={[
                  styles.controlIcon,
                  isExpanded ? styles.controlIconExpanded : null,
                  {tintColor: isExpanded ? '#fff' : '#000'},
                ]}
              />
            </TouchableOpacity>

            {isExpanded ? (
              <TouchableOpacity
                style={{
                  height: responsiveWidth(13),
                  width: responsiveWidth(13),
                  borderRadius: responsiveWidth(7),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handlePlayPause}>
                <Image
                  source={
                    isPlaying
                      ? require('../../Assets/images/whitePause.png')
                      : require('../../Assets/images/whitePlay.png')
                  }
                  style={[styles.playPauseIconExpanded]}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  height: responsiveWidth(16),
                  width: responsiveWidth(14),
                  borderRadius: responsiveWidth(7),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handlePlayPause}>
                <Image
                  source={
                    isPlaying
                      ? require('../../Assets/images/play.png')
                      : require('../../Assets/images/blackpause.png')
                  }
                  style={[
                    styles.playPauseIcon,
                    isExpanded ? styles.playPauseIconExpanded : null,
                    {tintColor: isExpanded ? '#fff' : '#000'},
                  ]}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={functionForForward}>
              <Image
                source={require('../../Assets/images/farward-solid.png')}
                style={[
                  styles.controlIcon,
                  isExpanded ? styles.controlIconExpanded : null,
                  {tintColor: isExpanded ? '#fff' : '#000'},
                ]}
              />
            </TouchableOpacity>
          </View>

          {isExpanded ? (
            <View style={styles.lyricsContainer}>
              <Text style={styles.lyrics}>{lyrics}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#9D824F',
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  Container: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: responsiveHeight(6),
    height: responsiveHeight(6),
    borderRadius: responsiveHeight(3.5),
    resizeMode: 'cover',
    marginRight: 10,
  },
  imagePlaceholder: {
    width: responsiveHeight(7),
    height: responsiveHeight(7),
    borderRadius: responsiveHeight(3.5),
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeholderText: {
    color: '#888',
    fontSize: responsiveWidth(2.5),
  },
  title: {
    fontSize: responsiveWidth(3.5),
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: responsiveWidth(3),
    color: '#ddd',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlIcon: {
    width: responsiveHeight(3),
    height: responsiveHeight(3),
    marginHorizontal: 10,
  },
  playPauseIcon: {
    width: responsiveHeight(6),
    height: responsiveHeight(6),
  },
  header: {
    flexDirection: 'row',
    height: responsiveHeight(10),
    alignItems: 'center',
    width: '100%',
    marginTop:
      Platform.OS === 'android' ? responsiveHeight(3) : responsiveHeight(7),
  },
  headerTitle: {
    fontSize: responsiveWidth(5),
    color: '#CCAA6B',
  },

  controlsExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: responsiveHeight(5),
  },
  controlIconExpanded: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
  },
  playPauseIconExpanded: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    backgroundColor: '#9D824F',
    borderRadius: responsiveHeight(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  extendedimage: {
    width: responsiveHeight(6),
    height: responsiveHeight(6),
    borderRadius: responsiveHeight(1.5),
    resizeMode: 'cover',
  },

  titleExpanded: {
    fontSize: responsiveWidth(4.5),
    color: 'white',
    fontWeight: 'normal',
    marginVertical: responsiveHeight(0.5),
    fontFamily: 'poppins',
  },
  subtitleExpanded: {
    fontSize: responsiveWidth(3.5),
    color: 'gray',
    fontWeight: 'normal',
  },
  progressContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: responsiveHeight(1),
  },

  progressBar: {
    height: responsiveHeight(0.5),
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#fff',
  },

  lyrics: {
    fontSize: responsiveWidth(5),
    color: 'white',
    fontWeight: 'normal',
    marginVertical: responsiveHeight(0.5),
    fontFamily: 'poppins',
    letterSpacing: 0.5,
    lineHeight: responsiveHeight(3.5),
    textAlign: 'center',
  },
  lyricsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default BackgroundMusicPlayer;
