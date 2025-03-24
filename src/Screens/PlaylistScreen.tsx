import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import TopNavigationBar from '../Components/TopNavigationBar';
import {useTranslation} from 'react-i18next';
import WrapperContainer from '../Components/WrapperContainer';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useGetAlbumsMutation} from '../store/Api/Auth';
import BackgroundMusicPlayer from '../Components/BackgroudMusicPlayer';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import TrackPlayer from 'react-native-track-player';
import {
  setCurrentSongg,
  setPlayingSongIndex,
  togglePlaying,
} from '../store/slices/songState';
import {Colors} from 'react-native/Libraries/NewAppScreen';

interface AlbumScreenProps {
  navigate: any;
  route: {
    params: {
      data: {
        Album_Name: string;
      };
    };
  };
}

interface Album {
  Album_Name: string;
  Album_Image: string;
  [key: string]: any;
}
interface ApiResponse {
  data: Album[];
}
const PlaylistScreen: React.FC = () => {
  const {t} = useTranslation();
  const AuthData = useSelector(state => state?.auth?.token?.data?.user);
  const navigation = useNavigation<AlbumScreenProps>();
  const [isAlbums, setAllAlbums] = useState([]);
  const [data, {isLoading}] = useGetAlbumsMutation();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const subscriptionId = AuthData.subscriptionID;
  const {persistCurrentSong, playlist, playingSongIndex} = useSelector(
    (state: RootState) => state.musicPlayer,
  );

  useFocusEffect(
    useCallback(() => {
      getAlbums();
    }, [data]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await data();
      const allalbums = res.data;
      const sortedAlbums = Array.from(allalbums).sort(
        (a, b) => a.index - b.index,
      );
      console.log('sortedAlbums===', sortedAlbums);
      setAllAlbums(sortedAlbums);
    } catch (error) {
      console.log('Errorr', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getAlbums = async () => {
    try {
      const res = await data();
      const allalbums = res.data;
      const sortedAlbums = Array.from(allalbums).sort(
        (a, b) => a.index - b.index,
      );
      console.log('sortedAlbums===', sortedAlbums);
      setAllAlbums(sortedAlbums);
    } catch (error) {
      console.log('Errorr', error);
    }
  };

  const handleForward = async () => {
    const trackList = playlist.map(song => ({
      id: song._id,
      url: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Song_File}`,
      title: song.Song_Name,
      artist: 'Mulder',
      artwork: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Album_Image}`,
      duration: parseFloat(song.Song_Length),
    }));
    await TrackPlayer.reset();
    await TrackPlayer.add(trackList);
    if (playingSongIndex < playlist.length - 1) {
      const nextIndex = playingSongIndex + 1;
      const nextSong = playlist[nextIndex];
      try {
        await TrackPlayer.skip(nextIndex);
        await TrackPlayer.play();
        dispatch(setCurrentSongg(nextSong));
        dispatch(setPlayingSongIndex(nextIndex));
        dispatch(togglePlaying(true));
      } catch (error) {
        console.error('Error skipping to next song:', error);
      }
    } else {
      console.log('You are at the last song in the playlist.');
    }
  };

  const handleBackward = async () => {
    if (playingSongIndex > 0) {
      const trackList = playlist.map(song => ({
        id: song._id,
        url: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Song_File}`,
        title: song.Song_Name,
        artist: 'Mulder',
        artwork: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Album_Image}`,
        duration: parseFloat(song.Song_Length),
      }));
      await TrackPlayer.reset();
      await TrackPlayer.add(trackList);
      const prevIndex = playingSongIndex - 1;
      const prevSong = playlist[prevIndex];
      try {
        await TrackPlayer.skip(prevIndex);
        await TrackPlayer.play();
        dispatch(setCurrentSongg(prevSong));
        dispatch(setPlayingSongIndex(prevIndex));
        dispatch(togglePlaying(true));
      } catch (error) {
        console.error('Error skipping to previous song:', error);
      }
    } else {
      console.log('You are at the first song in the playlist.');
    }
  };

  const togglePlayMusic = async (song: PlaylistItem, index: number) => {};

  const listemptyComp = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size={responsiveHeight(5)} color={'#9D824F'} />
        ) : (
          <Text
            style={{
              color: '#fff',
              fontSize: responsiveFontSize(2),
            }}>
            No Albums found
          </Text>
        )}
      </View>
    );
  };

  const renderedAlbums = ({item, index}) => {
    const isLocked = subscriptionId === '635bcf0612d32838b423b227';
    return (
      <TouchableOpacity
        onPress={() => {
          if (subscriptionId === '635bcf0612d32838b423b227' && index === 0) {
            navigation.navigate('AlbumScreen', {data: item});
          } else if (subscriptionId !== '635bcf0612d32838b423b227') {
            navigation.navigate('AlbumScreen', {data: item});
          }
        }}
        disabled={subscriptionId === '635bcf0612d32838b423b227' && index !== 0}
        style={styles.playlistMusic}>
        <View style={{position: 'relative'}}>
          {/* Album Image */}
          <Image
            source={{
              uri: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${item.Album_Image}`,
            }}
            style={{
              width: responsiveWidth(15),
              height: responsiveHeight(8),
              resizeMode: 'cover',
              marginRight: responsiveWidth(2.5),
            }}
          />

          {isLocked && index !== 0 && (
            <View
              style={{
                position: 'absolute',
                width: responsiveWidth(15),
                height: responsiveHeight(8),
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              }}
            />
          )}

          {isLocked && index !== 0 && (
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [
                  {translateX: -responsiveWidth(5)},
                  {translateY: -responsiveWidth(3)},
                ],
                zIndex: 10,
              }}>
              <Image
                tintColor={'#fff'}
                source={require('../../Assets/images/lock.png')} // Lock icon
                style={{
                  width: responsiveWidth(6),
                  height: responsiveWidth(6),
                  resizeMode: 'contain',
                }}
              />
            </View>
          )}
        </View>

        {/* Album Name and Singer Name */}
        <View
          style={{
            flexDirection: 'column',
            gap: 2,
            marginRight: responsiveWidth(20),
            width: '40%',
          }}>
          <Text
            style={{
              color: '#F0F0F0',
              fontSize: responsiveFontSize(2.1),
              letterSpacing: 1,
            }}>
            {item.Album_Name}
          </Text>
          <Text style={{color: 'gray', fontSize: responsiveFontSize(1.8)}}>
            {item.Singer_Name}
          </Text>
        </View>

        {/* Play Button */}
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
            justifyContent: 'space-between',
          }}>
          <Image
            source={require('../../Assets/images/playIcon.png')}
            style={{
              width: responsiveWidth(10),
              height: responsiveHeight(4),
              resizeMode: 'contain',
              marginLeft: responsiveWidth(0.5),
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer style={styles.container} bgColor="#1c1508">
      <TopNavigationBar title={t('Albums')} showBackButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1C1508']}
            progressBackgroundColor={'#9D824F'}
          />
        }
        contentContainerStyle={styles.scrollViewContent}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={isAlbums}
          renderItem={renderedAlbums}
          ListEmptyComponent={listemptyComp}
          style={{
            marginBottom: persistCurrentSong ? responsiveHeight(12) : 0,
          }}
        />
      </ScrollView>

      {persistCurrentSong && (
        <View>
          <BackgroundMusicPlayer
            paddingtop={responsiveHeight(9)}
            imageSource={`https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${persistCurrentSong.Album_Image}`}
            song_file={persistCurrentSong.Song_File}
            title={persistCurrentSong.Song_Name}
            Song_Length={persistCurrentSong.Song_Length}
            subtitle="Mulder"
            lyrics={persistCurrentSong.Song_Lyrics}
            functionForBackward={handleBackward}
            functionForForward={handleForward}
            togglePlayMusic={() =>
              togglePlayMusic(persistCurrentSong, currentSongIndex)
            }
          />
        </View>
      )}
    </WrapperContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1508',
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(2),
  },
  cardImage: {
    height: responsiveHeight(23),
    width: '100%',
    resizeMode: 'contain',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveHeight(2),
    width: responsiveWidth(85),
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    color: '#9D824F',
  },
  songInfo: {
    fontSize: responsiveFontSize(1.6),
    color: '#9D824F',
  },
  playlistMusic: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(2.5),
  },
  playlistImage: {
    width: responsiveWidth(15),
    height: responsiveHeight(8),
    resizeMode: 'cover',
    marginRight: responsiveWidth(2.5),
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  musicInfo: {
    flexDirection: 'column',
    marginRight: responsiveWidth(10),
  },
  songTitle: {
    color: '#F0F0F0',
    fontSize: responsiveFontSize(2.1),
    letterSpacing: 1,
  },
  artistName: {
    color: 'gray',
    fontSize: responsiveFontSize(1.8),
  },
  icons: {
    flexDirection: 'row',
    gap: 1,
    justifyContent: 'space-evenly',
  },
  icon: {
    width: responsiveWidth(7),
    height: responsiveHeight(3),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(4),
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: responsiveHeight(1),
    width: '100%',
  },
  createBTNview: {
    backgroundColor: '#9D824F',
    paddingHorizontal: responsiveHeight(1),
    borderRadius: responsiveWidth(1),
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: responsiveHeight(2.5),
    flexDirection: 'row',
    gap: responsiveWidth(2),
    width: '100%',
  },
  Plusicon: {
    width: responsiveWidth(5),
    height: responsiveHeight(5),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(2),
  },
  createBTNTxt: {
    fontSize: responsiveFontSize(2),
    color: '#1C1508',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(2),
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: responsiveHeight(1.5),
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#9D824F',
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    color: '#fff',
  },
  userPlaylist: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(1.5),
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
export default PlaylistScreen;
