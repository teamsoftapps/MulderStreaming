import React, {useState, useEffect} from 'react';
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
import BackgroundMusicPlayer from '../Components/BackgroudMusicPlayer';
import WrapperContainer from '../Components/WrapperContainer';
import {
  useGetAlbumSongsMutation,
  useGetFavoriteMutation,
  useHandleFavoriteMutation,
} from '../store/Api/Auth';
import TrackPlayer, {State} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {
  setCurrentSongg,
  setPlayingSongIndex,
  setPlaylist,
  togglePlaying,
} from '../store/slices/songState';
import {toggleFavorite} from '../store/slices/favoutiteSongs';

interface PlaylistItem {
  _id: string;
  Song_index: number;
  Song_Name: string;
  Song_File: string;
  Song_Length: string;
  Album_Name: string;
  Album_Image: string;
  Song_Lyrics: string;
}

interface AlbumScreenProps {
  route: {
    params: {
      data: {
        Album_Name: string;
      };
    };
  };
}

const AlbumScreen: React.FC<AlbumScreenProps> = ({route}) => {
  const [albumSongs, setAlbumSongs] = useState<PlaylistItem[]>([]);
  const [albumImage, setAlbumImage] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState<PlaylistItem | null>(null);
  const [getAlbumsSongs, {isLoading}] = useGetAlbumSongsMutation();
  const [handleFavorite] = useHandleFavoriteMutation();
  const [islikedSong, setIsLikedSong] = useState([]);
  const [favoriteSongs] = useGetFavoriteMutation();
  const dispatch = useDispatch();
  const [trackList, setTrackList] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [sortedSongs, setsortedSongs] = useState([]);
  const {persistCurrentSong, playlist} = useSelector(
    (state: RootState) => state.musicPlayer,
  );

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites,
  );

  const albumName = route?.params?.data?.Album_Name || '';

  const onRefresh = async () => {
    setRefreshing(true);
    if (!albumName) return;

    try {
      const res = await getAlbumsSongs(albumName);
      const liked = await favoriteSongs({});
      setIsLikedSong(liked?.data?.favourites);
      if (res?.data) {
        const songs = res?.data[0] || [];
        setAlbumImage(songs[0]?.Album_Image || '');

        setAlbumSongs(songs);
        setIsDataLoading(false);
        // dispatch(setPlaylist(songs));
        const trackList = songs.map(song => ({
          id: song._id,
          url: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Song_File}`,
          title: song.Song_Name,
          artist: 'Mulder',
          artwork: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Album_Image}`,
          duration: parseFloat(song.Song_Length),
        }));

        setTrackList(trackList);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getSongs = async () => {
    if (!albumName) return;

    try {
      const res = await getAlbumsSongs(albumName);

      const liked = await favoriteSongs({});
      setIsLikedSong(liked?.data?.favourites || []);

      const allSongs: PlaylistItem[] = [...(res?.data[0] || [])];

      const sortedSongs = allSongs
        .slice()
        .sort((a, b) => a.Song_index - b.Song_index);

      setAlbumSongs(sortedSongs);

      if (res?.data.length > 0) {
        const songs = res?.data[0] || [];
        setAlbumImage(songs[0]?.Album_Image || '');
        setAlbumSongs(sortedSongs);
        setIsDataLoading(false);
        // dispatch(setPlaylist(songs));

        const trackList = songs.map(song => ({
          id: song._id,
          url: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Song_File}`,
          title: song.Song_Name,
          artist: 'Mulder',
          artwork: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${song.Album_Image}`,
          duration: parseFloat(song.Song_Length) || 0,
        }));

        setTrackList(trackList);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
    }
  };

  const togglePlayMusic = async (song: PlaylistItem, index: number) => {
    if (song.Song_index < 0) {
      console.error('Error: Missing Song_index in PlaylistItem', song);
      return;
    }

    if (persistCurrentSong?._id !== albumSongs[index]._id) {
      await TrackPlayer.reset();
      await TrackPlayer.add(trackList);
      dispatch(setPlaylist(albumSongs));
    }

    if (currentSongIndex === index && persistCurrentSong == albumSongs[index]) {
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
  const toggleFavoriteHandler = async (id: string) => {
    try {
      const result = await handleFavorite(id);
      getSongs();
      if (result) {
        dispatch(toggleFavorite(id));
      }
    } catch (error) {}
  };

  const renderPlaylistItem = ({
    item,
    index,
  }: {
    item: PlaylistItem;
    index: number;
  }) => {
    const isFavorite = islikedSong.some(obj => obj?._id === item?._id);
    const isPlaying = currentSong?._id === item?._id;

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
            <Text style={styles.songTitle}>{item.Song_Name}</Text>
            <Text style={styles.artistName}>Mulder</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => toggleFavoriteHandler(item._id)}>
            <Image
              source={
                isFavorite
                  ? require('../../Assets/images/filledHeart.png')
                  : require('../../Assets/images/favMusic.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>

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
        </View>
      </View>
    );
  };

  useEffect(() => {
    setIsDataLoading(true);
    getSongs();
  }, [albumName]);

  const listEmptyComp = () => (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <ActivityIndicator size={responsiveHeight(5)} color={'#9D824F'} />
      ) : (
        <Text style={styles.emptyText}>No Songs Found</Text>
      )}
    </View>
  );

  return (
    <WrapperContainer style={styles.container}>
      <View style={{flex: 1}}>
        <TopNavigationBar title="Albums" showBackButton={true} />
        {isDataLoading ? (
          <ActivityIndicator size={responsiveHeight(5)} color={'#9D824F'} />
        ) : (
          <>
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
              <View>
                <View style={{position: 'relative'}}>
                  <Image
                    source={require('../../Assets/images/bannarHome.png')}
                    style={styles.cardImage}
                  />
                  <View style={styles.overlayContainer}>
                    <Image
                      source={{
                        uri: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${albumImage}`,
                      }}
                      style={styles.overlayImage}
                    />
                    <Text
                      style={[
                        styles.overlayText,
                        {width: responsiveWidth(40)},
                      ]}>
                      {albumName || 'Album Name not found'}
                      {'\n\n'}
                      <Text style={{fontSize: responsiveFontSize(1.8)}}>
                        By Mulder {'\n\n'}
                        <Text style={{marginTop: responsiveHeight(1.8)}}>
                          {albumSongs.length} songs
                        </Text>
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              <FlatList
                style={{
                  marginBottom: persistCurrentSong ? responsiveHeight(12) : 0,
                }}
                data={albumSongs}
                renderItem={renderPlaylistItem}
                ListEmptyComponent={listEmptyComp}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
              />
            </ScrollView>
            {persistCurrentSong && (
              <View style={{marginBottom: responsiveHeight(1)}}>
                <BackgroundMusicPlayer
                  imageSource={`https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${persistCurrentSong.Album_Image}`}
                  song_file={persistCurrentSong.Song_File}
                  title={persistCurrentSong.Song_Name}
                  Song_Length={persistCurrentSong.Song_Length}
                  subtitle="Mulder"
                  lyrics={persistCurrentSong.Song_Lyrics}
                  functionForBackward={handleBackward}
                  functionForForward={handleForward}
                  togglePlayMusic={() =>
                    togglePlayMusic(
                      {
                        ...persistCurrentSong,
                        Song_index: persistCurrentSong.Song_index ?? 0,
                      },
                      currentSongIndex,
                    )
                  }
                  paddingtop={0}
                />
              </View>
            )}
          </>
        )}
      </View>
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
  cardImage: {
    height: responsiveHeight(23),
    width: responsiveWidth(85),
    resizeMode: 'contain',
    opacity: 0.4,
  },
  overlayImage: {
    top: responsiveHeight(1.2),
    width: responsiveWidth(30),
    height: responsiveHeight(15),
  },
  overlayContainer: {
    position: 'absolute',
    top: responsiveHeight(3),
    left: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    marginLeft: responsiveWidth(8),
    marginTop: responsiveHeight(0.8),
  },
  playlistMusicContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: responsiveHeight(2),
  },
  playlistMusic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistImage: {
    width: responsiveWidth(15),
    height: responsiveHeight(8),
    resizeMode: 'cover',
    marginRight: responsiveWidth(2.5),
  },
  musicInfo: {
    flexDirection: 'column',
    maxWidth: responsiveWidth(45),
  },
  songTitle: {
    color: '#f0f0f0',
    fontSize: responsiveFontSize(1.8),
  },
  artistName: {
    color: 'gray',
    fontSize: responsiveFontSize(1.8),
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  icon: {
    width: responsiveWidth(7),
    height: responsiveHeight(3),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(4),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9D824F',
    fontSize: responsiveFontSize(2),
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default AlbumScreen;
