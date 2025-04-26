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
import {
  useGetFavoriteMutation,
  useHandleFavoriteMutation,
} from '../store/Api/Auth';
import TrackPlayer, {State} from 'react-native-track-player';
import {
  setCurrentSongg,
  setPlayingSongIndex,
  setPlaylist,
  togglePlaying,
} from '../store/slices/songState';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import BackgroundMusicPlayer from '../Components/BackgroudMusicPlayer';
import {useFocusEffect} from '@react-navigation/native';

interface PlaylistItem {
  _id: string;
  Song_Name: string;
  Album_id: string;
  Song_File: string;
  Album_Name: string;
  Song_Length: string;
  Song_Lyrics: string;
  Album_Image: string;
}

const WishListScreen: React.FC = () => {
  const {t} = useTranslation();
  const [favorites, setFavorites] = useState<PlaylistItem[]>([]);
  const [currentSong, setCurrentSong] = useState<PlaylistItem | null>(null);
  const [getFavourites] = useGetFavoriteMutation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const dispatch = useDispatch();
  const [handleFavorite] = useHandleFavoriteMutation();
  const [trackList, setTrackList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {persistCurrentSong, playlist, playingSongIndex} = useSelector(
    (state: RootState) => state.musicPlayer,
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await getFavourites({});
      setFavorites(res?.data?.favourites);
      // dispatch(setPlaylist(res?.data?.favourites));
      setIsLoading(false);
      const trackList = res?.data?.favourites.map(song => ({
        id: song._id,
        url: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Song_File}`,
        title: song.Song_Name,
        artist: 'Mulder',
        artwork: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Album_Image}`,
        duration: parseFloat(song.Song_Length),
      }));
      setTrackList(trackList);
    } catch (error) {
      console.log('error while fetvhing favourites songs:', error);
    } finally {
      setRefreshing(false);
    }
  };
  const fetchFavourites = async () => {
    try {
      const res = await getFavourites({});
      setFavorites(res?.data?.favourites);
      // dispatch(setPlaylist(res?.data?.favourites));
      setIsLoading(false);
      const trackList = res?.data?.favourites.map(song => ({
        id: song._id,
        url: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Song_File}`,
        title: song.Song_Name,
        artist: 'Mulder',
        artwork: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Album_Image}`,
        duration: parseFloat(song.Song_Length),
      }));
      setTrackList(trackList);
    } catch (error) {
      console.log('error while fetvhing favourites songs:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchFavourites();
    }, []),
  );

  const handleForward = async () => {
    // await TrackPlayer.reset();
    await TrackPlayer.add(trackList);
    try {
      await TrackPlayer.skipToNext();

      const currentTrackId = await TrackPlayer.getCurrentTrack();
      const currentTrack = await TrackPlayer.getTrack(currentTrackId);

      dispatch(setPlayingSongIndex(currentTrackId));
      dispatch(togglePlaying(true));
      const matchingPlaylist = playlist.find(
        item => item._id === currentTrack.id,
      );
      dispatch(setCurrentSongg(matchingPlaylist));
      await TrackPlayer.play();
    } catch (error) {
      console.log('No next track available:', error);
    }
    // if (currentSongIndex < albumSongs.length - 2) {
    //   const nextIndex = currentSongIndex + 1;
    //   const nextSong = albumSongs[nextIndex];

    //   try {
    //     await TrackPlayer.skip(nextIndex);
    //     await TrackPlayer.play();
    //     setCurrentSongIndex(nextIndex);
    //     dispatch(setCurrentSongg(nextSong));
    //     dispatch(setPlayingSongIndex(nextIndex));
    //     dispatch(togglePlaying(true));
    //     console.log('current playing from F funtion', nextSong);
    //   } catch (error) {
    //     console.error('Error skipping to next song:', error);
    //   }
    // } else {
    //   console.log('You are at the last song in the playlist.');
    //   await TrackPlayer.skip(0);
    //   await TrackPlayer.play();
    //   dispatch(togglePlaying(true));
    //   dispatch(setCurrentSongg(albumSongs[0]));
    //   setCurrentSongIndex(0);
    //   dispatch(setPlayingSongIndex(0));
    // }
  };

  const handleBackward = async () => {
    await TrackPlayer.add(trackList);
    try {
      await TrackPlayer.skipToPrevious();

      const currentTrackId = await TrackPlayer.getCurrentTrack();
      const currentTrack = await TrackPlayer.getTrack(currentTrackId);

      // dispatch(setCurrentSongg(currentTrack));
      dispatch(setPlayingSongIndex(currentTrackId));
      dispatch(togglePlaying(true));
      const matchingPlaylist = playlist.find(
        item => item._id === currentTrack.id,
      );
      dispatch(setCurrentSongg(matchingPlaylist));
      await TrackPlayer.play();
    } catch (error) {
      console.log('No previous track available:', error);
    }
    // if (currentSongIndex > 0) {
    //   await TrackPlayer.reset();
    //   await TrackPlayer.add(trackList);

    //   const prevIndex = currentSongIndex - 1;
    //   const prevSong = albumSongs[prevIndex];

    //   try {
    //     await TrackPlayer.skip(prevIndex);
    //     await TrackPlayer.play();
    //     setCurrentSongIndex(prevIndex);
    //     dispatch(setCurrentSongg(prevSong));
    //     dispatch(setPlayingSongIndex(prevIndex));
    //     dispatch(togglePlaying(true));
    //     console.log('current playing from B funtion', prevSong);
    //   } catch (error) {
    //     console.error('Error skipping to previous song:', error);
    //   }
    // } else {
    //   console.log('You are at the first song in the playlist.');
    // }
  };

  const togglePlayMusic = async (song: PlaylistItem, index: number) => {
    if (persistCurrentSong?._id !== favorites[index]?._id) {
      await TrackPlayer.reset();
      await TrackPlayer.add(trackList);
      dispatch(setPlaylist(favorites));
    }
    if (currentSongIndex === index && persistCurrentSong == favorites[index]) {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        await TrackPlayer.pause();
        dispatch(togglePlaying(false));
      } else {
        await TrackPlayer.add(trackList);
        await TrackPlayer.play();
        dispatch(setPlayingSongIndex(index));
        dispatch(togglePlaying(true));
      }
    } else {
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      setCurrentSongIndex(index);
      dispatch(setPlayingSongIndex(index));
      dispatch(setCurrentSongg(song));
      dispatch(togglePlaying(true));
    }
  };

  const handleToggleFavourite = async (id: string) => {
    try {
      const result = await handleFavorite(id);
      fetchFavourites();
    } catch (error) {}
  };

  const listemptyComp = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size={responsiveHeight(5)} color={'#9D824F'} />
        ) : (
          <Text style={{color: '#fff', fontFamily: 'Roboto-Medium'}}>
            No Liked Songs!!
          </Text>
        )}
      </View>
    );
  };

  const renderPlaylistItem = ({
    item,
    index,
  }: {
    item: PlaylistItem;
    index: number;
  }) => {
    const isPlaying = currentSong?._id === item._id;

    return (
      <View style={styles.playlistMusicContainer}>
        <TouchableOpacity
          onPress={() => togglePlayMusic(item, index)}
          style={styles.playlistMusic}>
          <Image
            source={{
              uri: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${item.Album_Image}`,
            }}
            style={styles.playlistImage}
          />
          <View style={styles.musicInfo}>
            <Text numberOfLines={1} style={styles.songTitle}>
              {item.Song_Name}
            </Text>
            <Text style={styles.artistName}>Mulder</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => handleToggleFavourite(item._id)}>
            <Image
              source={require('../../Assets/images/filledHeart.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <TouchableOpacity onPress={() => togglePlayMusic(item, index)}>
              <Image
                source={
                  isPlaying
                    ? require('../../Assets/images/playMusicIcon.png')
                    : require('../../Assets/images/playIcon.png')
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer style={styles.container}>
      <TopNavigationBar title={t('Liked')} showBackButton={true} />

      <ScrollView
        bounces={false}
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
          style={{
            marginBottom: persistCurrentSong ? responsiveHeight(12) : 0,
          }}
          data={favorites}
          renderItem={renderPlaylistItem}
          keyExtractor={item => item?._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listemptyComp}
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
    backgroundColor: '#1c1508',
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: responsiveHeight(1),
    width: responsiveWidth(85),
  },
  headerTitle: {
    fontSize: responsiveFontSize(1.7),
    color: '#f0f0f0',
  },
  playButton: {
    backgroundColor: '#9D824F',
    paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(4.2),
    borderRadius: responsiveHeight(1),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  songInfo: {
    fontSize: responsiveFontSize(1.6),
    color: '#9D824F',
  },
  playlistMusic: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveHeight(1.5),
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
  },
  songTitle: {
    color: '#f0f0f0',
    fontSize: responsiveFontSize(2.1),
    letterSpacing: 1,
    width: responsiveWidth(40),
  },
  artistName: {
    color: 'gray',
    fontSize: responsiveFontSize(1.8),
  },
  icons: {
    flexDirection: 'row',
    gap: 1,
    justifyContent: 'space-around',
  },
  icon: {
    width: responsiveWidth(7),
    height: responsiveHeight(3),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(5),
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: responsiveHeight(1),
    width: '100%',
  },
  playlistMusicContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default WishListScreen;
