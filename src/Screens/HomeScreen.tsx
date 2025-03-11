import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import TopNavigationBar from '../Components/TopNavigationBar';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../Components/Type';
import {useTranslation} from 'react-i18next';
import ExclusiveContent from '../Components/ExclusiveContent';
import WrapperContainer from '../Components/WrapperContainer';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
  useGetAlbumsMutation,
  useGetAllUserPlaylistMutation,
  useRemovePlaylistMutation,
} from '../store/Api/Auth';
import BackgroundMusicPlayer from '../Components/BackgroudMusicPlayer';
import {RootState} from '../store';
import TrackPlayer from 'react-native-track-player';
import {
  setCurrentSongg,
  setPlayingSongIndex,
  togglePlaying,
} from '../store/slices/songState';
import Lock from '../../Assets/images/lock.png';
type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AlbumScreen',
  'PlaylistDetails'
>;
interface Album {
  Album_Name: string;
  Album_Image: string;
  [key: string]: any;
}

interface ApiResponse {
  data: Album[];
}

const HomeScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const AuthData = useSelector(state => state?.auth?.token?.data?.user);
  const [isAlbums, setAllAlbums] = useState([]);
  const [data, {isLoading}] = useGetAlbumsMutation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  console.log('suth data:', AuthData);
  const subcscriptionId = AuthData?.subscriptionID;
  const [dataSlice, setDataSlice] = useState([]);
  const [fetchAllPlaylists, {isLoading: playlistLoading}] =
    useGetAllUserPlaylistMutation();
  const [deletePlaylist] = useRemovePlaylistMutation();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaderloading, setLoaderLoading] = useState(false);
  const [LoadingmodalVisible, setLoadingmodalVisible] = useState(false);
  const [isDeleteItemId, setDeletedItemID] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const {persistCurrentSong, playlist, playingSongIndex} = useSelector(
    (state: RootState) => state.musicPlayer,
  );
  useFocusEffect(
    React.useCallback(() => {
      getAllPlaylists();
      setNewPlaylistName('');
      getAlbums();
    }, []),
  );

  const getAllPlaylists = async () => {
    try {
      const userId = 'user-id';
      const res = await fetchAllPlaylists(userId);
      console.log('playlists: ', res.data.result);
      setDataSlice(res.data.result);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  const getAlbums = async () => {
    try {
      const res = await data();
      console.log(
        'getting albums --------------------------------------------:',
        res.data,
      );
      setAllAlbums(res?.data);
    } catch (error) {
      console.log('Errorr', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await data();
      console.log('getting albums in home screen:', res.data);
      setAllAlbums(res?.data);
    } catch (error) {
      console.log('Errorr', error);
    } finally {
      setRefreshing(false);
    }
  };

  // const getAlbums = async (): Promise<void> => {
  //   try {
  //     const res: ApiResponse = await data();

  //     if (!res?.data) {
  //       throw new Error('No data returned from API');
  //     }

  // if (subcscriptionId === '635bcf0612d32838b423b227') {
  //       if (res?.data.length > 10) {
  //         const trailAlbum = res?.data[10];
  //         if (trailAlbum) {
  //           setAllAlbums([trailAlbum]);
  //           console.log('Trail album:', trailAlbum);
  //         }
  //       } else {
  //         console.log('Trail album does not exist at index 10');
  //         setAllAlbums([]);
  //       }
  //     } else {
  //       setAllAlbums(res?.data);
  //       console.log('All Albums:', res?.data);
  //     }
  //   } catch (error) {
  //     console.error('Error in fetching albums:', error);
  //     setAllAlbums([]);
  //   }
  // };

  const handleCreateNewPlaylistPress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(true);
    }, 500);
  };

  const handleExclusiveContentWebView = () => {
    navigation.navigate('WebViewContent');
  };

  const handleForward = async () => {
    console.log('songs from redux', playlist);
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
        console.log('current playing from F funtion', nextSong);
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
        console.log('current playing from B funtion', prevSong);
      } catch (error) {
        console.error('Error skipping to previous song:', error);
      }
    } else {
      console.log('You are at the first song in the playlist.');
    }
  };

  const togglePlayMusic = async (song: PlaylistItem, index: number) => {};

  const handleCreateUserPlaylist = () => {
    setModalVisible(false);
    navigation.navigate('AllSongs', {playlistName: newPlaylistName});
  };

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

  const whenPlaylistEmpty = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {playlistLoading ? (
          <ActivityIndicator size={responsiveHeight(5)} color={'#9D824F'} />
        ) : (
          <Text
            style={{
              color: 'White',
              fontSize: responsiveFontSize(2),
            }}>
            No playlists found
          </Text>
        )}
      </View>
    );
  };

  const renderedPlaylists = ({item}) => {
    const isLocked = subcscriptionId === '635bcf0612d32838b423b227';
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: responsiveWidth(2),
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (!isLocked) {
              navigation.navigate('PlaylistDetails', {data: item});
            }
          }}
          style={styles.playlistMusic}
          disabled={isLocked}>
          <View style={{position: 'relative'}}>
            <Image
              source={{
                uri: item.Playlist_Image,
              }}
              style={{
                width: responsiveWidth(15),
                height: responsiveHeight(8),
                resizeMode: 'cover',
                marginRight: responsiveWidth(2.5),
              }}
            />

            {isLocked && (
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

            {isLocked && (
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
                  source={require('../../Assets/images/lock.png')}
                  style={{
                    width: responsiveWidth(6),
                    height: responsiveWidth(6),
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: 'column',
              gap: 4,
              marginRight: responsiveWidth(10),
              width: '40%',
            }}>
            <Text
              style={{
                color: '#f0f0f0',
                fontSize: responsiveFontSize(2.1),
                width: responsiveWidth(45),
              }}
              numberOfLines={1}>
              {item.Playlist_Name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible2(true);
                setDeletedItemID(item._id);
              }}>
              {!item.Is_Created_By_Admin && (
                <Image
                  source={require('../../Assets/images/delete.png')}
                  style={{
                    width: responsiveWidth(7),
                    height: responsiveHeight(2.8),
                    resizeMode: 'contain',
                    marginLeft: responsiveWidth(0.5),
                    tintColor: '#9D824F',
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <WrapperContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopNavigationBar title={t('Music')} showBackButton={false} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: responsiveHeight(1),
          }}>
          {/* <ExclusiveContent /> */}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: responsiveHeight(2),
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.5),
              fontWeight: 'thin',
              color: '#9D824F',
            }}>
            {t('Albums')}
          </Text>
          {subcscriptionId !== '635bcf0612d32838b423b227' ? (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('PlaylistScreen');
              }}>
              <Text
                style={{
                  fontSize: responsiveFontSize(2),
                  color: '#f0f0f0',
                }}>
                {t('See All')}
              </Text>
              <Image
                source={require('../../Assets/images/BackButton.png')}
                style={{
                  marginLeft: responsiveWidth(2.5),
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
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
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={listemptyComp}
            data={isAlbums}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{
                    width: responsiveWidth(28),
                    paddingRight: responsiveWidth(2),
                  }}
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (
                      subcscriptionId === '635bcf0612d32838b423b227' &&
                      index === 10
                    ) {
                      navigation.navigate('AlbumScreen', {data: item});
                    } else if (subcscriptionId !== '635bcf0612d32838b423b227') {
                      navigation.navigate('AlbumScreen', {data: item});
                    }
                  }}
                  disabled={
                    subcscriptionId === '635bcf0612d32838b423b227' &&
                    index !== 10
                  }>
                  <View
                    style={{
                      shadowRadius: responsiveHeight(3),
                      width: responsiveWidth(28),
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                    }}>
                    <Image
                      source={{
                        uri: `https://musicfilesforheroku.s3.us-west-1.amazonaws.com/uploads/${item.Album_Image}`,
                      }}
                      style={{
                        width: responsiveWidth(26),
                        height: responsiveHeight(13),
                        borderRadius: responsiveHeight(3),
                        resizeMode: 'cover',
                      }}
                    />

                    {index !== 10 &&
                      subcscriptionId === '635bcf0612d32838b423b227' && (
                        <View
                          style={{
                            position: 'absolute',
                            width: responsiveWidth(26),
                            height: responsiveHeight(13),
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: responsiveHeight(3),
                          }}
                        />
                      )}

                    {index !== 10 &&
                      subcscriptionId === '635bcf0612d32838b423b227' && (
                        <View
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: [
                              {translateX: -responsiveWidth(3)},
                              {translateY: -responsiveHeight(3)},
                            ],
                            zIndex: 10,
                          }}>
                          <Image
                            tintColor={'#fff'}
                            source={Lock}
                            style={{
                              width: responsiveWidth(6),
                              height: responsiveWidth(6),
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                      )}
                  </View>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: responsiveFontSize(1.8),
                      textAlign: 'center',
                    }}>
                    {item.Album_Name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: responsiveHeight(2),
            marginHorizontal: responsiveWidth(3),
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.5),
              fontWeight: 'thin',
              color: '#9D824F',
            }}>
            {t('Playlists')}
          </Text>
        </View>
        <FlatList
          ListEmptyComponent={whenPlaylistEmpty}
          data={dataSlice}
          renderItem={renderedPlaylists}
        />
        {subcscriptionId !== '635bcf0612d32838b423b227' ? (
          <TouchableOpacity onPress={handleCreateNewPlaylistPress}>
            <View
              style={[
                styles.createBTNview,
                {
                  marginBottom: persistCurrentSong
                    ? responsiveHeight(14)
                    : responsiveHeight(2),
                },
              ]}>
              {loading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <>
                  <Text style={styles.createBTNTxt}>
                    {t('Create New Playlist')}
                  </Text>
                  <Image
                    source={require('../../Assets/images/plusIcon.png')}
                    style={styles.Plusicon}
                  />
                </>
              )}
            </View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={handleExclusiveContentWebView}>
          <View
            style={[
              styles.createBTNview,
              {
                marginBottom: persistCurrentSong
                  ? responsiveHeight(14)
                  : responsiveHeight(2),
                paddingVertical: responsiveHeight(2.4),
              },
            ]}>
            <Text style={styles.createBTNTxt}>{t('Exclusive Content')}</Text>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => setModalVisible2(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={[styles.heading]}>Are you sure?</Text>

              <View
                style={[
                  styles.buttonContainer,
                  {marginTop: responsiveHeight(2)},
                ]}>
                <TouchableOpacity
                  onPress={() => setModalVisible2(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#1c1508',
                    height: responsiveHeight(4),
                    justifyContent: 'center',
                    borderRadius: responsiveWidth(1.1),
                  }}>
                  <Text style={{textAlign: 'center', color: '#fff'}}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setModalVisible2(false);
                    setLoadingmodalVisible(true);
                    setLoaderLoading(true);
                    try {
                      await deletePlaylist(isDeleteItemId);
                      await getAllPlaylists();
                      setLoadingmodalVisible(false);
                      setModalVisible2(false);
                    } catch (error) {
                      setLoadingmodalVisible(false);
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
                  <Text style={{textAlign: 'center', color: '#fff'}}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.heading}>Create New Playlist</Text>
              <TextInput
                placeholder="Enter playlist name"
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                style={{
                  borderWidth: 1,
                  borderColor: '#1c1508',
                  width: '100%',
                  fontSize: responsiveHeight(1.8),
                  marginVertical: responsiveHeight(2.5),
                  borderRadius: responsiveWidth(4),
                  paddingLeft: responsiveWidth(2),
                  color: '#fff',
                  ...Platform.select({
                    ios: {
                      height: responsiveHeight(6),
                      shadowColor: '#000',
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    },
                  }),
                }}
              />

              <View style={styles.buttonContainer}>
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
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreateUserPlaylist}
                  style={{
                    flex: 1,
                    backgroundColor: '#1c1508',
                    height: responsiveHeight(4),
                    justifyContent: 'center',
                    borderRadius: responsiveWidth(1.1),
                    opacity: newPlaylistName ? 1 : 0.5,
                  }}
                  disabled={!newPlaylistName}>
                  <Text style={{textAlign: 'center', color: '#fff'}}>
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={LoadingmodalVisible}
          animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                padding: 20,
                backgroundColor: '#1c1508',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="#9D824F" />
              <Text style={{marginTop: 20, fontSize: 16, color: '#9D824F'}}>
                Deleting...
              </Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {persistCurrentSong && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
  songRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: responsiveWidth(5),
    padding: responsiveWidth(2),
    width: '100%',
  },
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  tickIcon: {height: 16, width: 16, tintColor: '#fff'},
  songText: {
    color: '#fff',
    flexWrap: 'wrap',
    width: '80%',
  },
  container: {
    flex: 1,
    backgroundColor: '#1c1508',
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(2),
  },
  cardImage: {
    height: responsiveHeight(25),
    width: responsiveWidth(85),
    resizeMode: 'contain',
  },
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
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',

    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    width: '100%',
  },
  modalContent: {
    width: '90%',
    height: responsiveHeight(82.5),
    backgroundColor: '#0F0B04',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    color: '#fff',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    height: responsiveHeight(5),
    borderRadius: responsiveWidth(7),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(2),
    borderColor: '#fff',
    color: '#000',
    backgroundColor: '#fff',
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
  ExslusiveCardImage: {
    height: responsiveHeight(25),
    width: responsiveWidth(85),
    resizeMode: 'contain',
    marginHorizontal: responsiveWidth(3.2),
  },

  playlistMusic: {
    flexDirection: 'row',
    gap: responsiveWidth(8),
    alignItems: 'center',
    marginVertical: responsiveHeight(0.5),
    marginHorizontal: responsiveWidth(2.5),
  },
  createBTNview: {
    backgroundColor: '#9D824F',
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(2.5),
    flexDirection: 'row',
    gap: responsiveWidth(2),
    width: '100%',
    paddingVertical: responsiveHeight(1.5),
    marginVertical: responsiveHeight(2),
  },
  createBTNTxt: {
    fontSize: responsiveFontSize(2),
    color: '#1c1508',
    fontWeight: 'bold',
  },
  Plusicon: {
    width: responsiveWidth(5),
    height: responsiveHeight(5),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(2),
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default HomeScreen;
