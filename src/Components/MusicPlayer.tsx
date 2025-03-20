import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

const MusicPlayer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {song} = route.params;
  const {persistCurrentSong, isPlaying: currentPlaying} = useSelector(
    (state: RootState) => state.musicPlayer,
  );

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(song);

  const {Song_Name, artist, Song_Lyrics, image, Song_Length, togglePlayMusic} =
    currentSong;

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  useEffect(() => {
    setCurrentSong(song);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [song]);

  const handlePlayPause = () => {
    setIsPlaying(prevState => !prevState);
    if (togglePlayMusic) {
      togglePlayMusic();
    }
  };

  useEffect(() => {
    let interval = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime < Song_Length) {
            return prevTime + 1;
          }
          clearInterval(interval);
          return prevTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, Song_Length]);

  const handleNextSong = () => {
    if (!currentSong) {
      console.error('No current song found.');
      return;
    }

    const nextSong = getNextSong(currentSong);
    if (!nextSong) {
      console.error('Next song not found.');
      return;
    }

    setCurrentSong(nextSong);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handlePreviousSong = () => {
    if (!currentSong) {
      console.error('No current song found.');
      return;
    }

    const previousSong = getPreviousSong(currentSong);
    if (!previousSong) {
      console.error('Previous song not found.');
      return;
    }

    setCurrentSong(previousSong);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const getNextSong = currentSong => {
    const songs = [
      {Song_Name: 'Song 1', artist: 'Artist 1', Song_Length: 200},
      {Song_Name: 'Song 2', artist: 'Artist 2', Song_Length: 210},
      {Song_Name: 'Song 3', artist: 'Artist 3', Song_Length: 220},
    ];

    const currentIndex = songs.findIndex(
      song => song.Song_Name === currentSong.Song_Name,
    );

    if (currentIndex === -1) {
      console.error('Current song not found in the song list.');
      return songs[0];
    }

    const nextIndex = (currentIndex + 1) % songs.length;
    return songs[nextIndex];
  };

  const getPreviousSong = currentSong => {
    const songs = [
      {Song_Name: 'Song 1', artist: 'Artist 1', Song_Length: 200},
      {Song_Name: 'Song 2', artist: 'Artist 2', Song_Length: 210},
      {Song_Name: 'Song 3', artist: 'Artist 3', Song_Length: 220},
    ];

    const currentIndex = songs.findIndex(
      song => song.Song_Name === currentSong.Song_Name,
    );

    if (currentIndex === -1) {
      console.error('Current song not found in the song list.');
      return songs[songs.length - 1];
    }

    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    return songs[previousIndex];
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../Assets/images/Downbutton.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity>
            <Image source={require('../../Assets/images/search.png')} />
          </TouchableOpacity>
        </View>

        <Image source={{uri: image}} style={styles.albumImg} />
        <View style={styles.musicDetails}>
          <View style={{flexDirection: 'column', gap: responsiveHeight(1)}}>
            <Text style={{fontSize: responsiveWidth(4.5), color: 'white'}}>
              {Song_Name}
            </Text>
            <Text style={{fontSize: responsiveWidth(3.5), color: 'gray'}}>
              {artist}
            </Text>
          </View>
          <Image source={require('../../Assets/images/favMusic.png')} />
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                {width: `${(currentTime / Song_Length) * 100}%`},
              ]}
            />
          </View>
          <View
            style={{
              width: responsiveWidth(90),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(Song_Length)}</Text>
          </View>
        </View>

        <View style={styles.controller}>
          <TouchableOpacity onPress={handlePreviousSong}>
            <Image source={require('../../Assets/images/whiteBackward.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause}>
            <Image
              source={
                isPlaying
                  ? require('../../Assets/images/whitePause.png')
                  : require('../../Assets/images/whitePlay.png')
              }
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextSong}>
            <Image source={require('../../Assets/images/whiteFarward.png')} />
          </TouchableOpacity>
        </View>

        <View style={styles.lyricsStyle}>
          <Text style={styles.lyricsText}>{Song_Lyrics}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1508',
    paddingTop: responsiveHeight(10),
  },
  header: {
    flexDirection: 'row',
    height: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(6),
    width: responsiveWidth(100),
    position: 'absolute',
    top: 0,
  },
  headerTitle: {
    fontSize: responsiveWidth(5),
    color: '#CCAA6B',
  },
  albumImg: {
    width: responsiveWidth(95),
    height: responsiveHeight(45),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  musicDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(6),
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  progressBarBackground: {
    width: responsiveWidth(90),
    height: responsiveHeight(0.5),
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#CCAA6B',
  },
  timeText: {
    color: 'white',
    fontSize: responsiveWidth(3),
    marginVertical: responsiveHeight(1),
  },
  controller: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(6),
  },
  lyricsStyle: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: responsiveWidth(6),
    marginVertical: responsiveHeight(4),
  },
  lyricsText: {
    fontSize: responsiveWidth(4.5),
    color: 'white',
    letterSpacing: 2,
    lineHeight: responsiveHeight(3),
  },
});

export default MusicPlayer;
