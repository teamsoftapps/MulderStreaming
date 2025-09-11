import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  useAddPlaylistMutation,
  useGetAllSongsMutation,
} from '../store/Api/Auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import ToastMessage from '../hooks/ToastMessage.js';
import {RootStackParamList} from '../Components/Type';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src';

type AllSongsRouteProp = RouteProp<RootStackParamList, 'AllSongs'>;
type AllSongsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AllSongs'
>;
const AllSongs: React.FC = () => {
  const navigation = useNavigation<AllSongsNavigationProp>();
  const route = useRoute<AllSongsRouteProp>();
  const {playlistName} = route.params || {};
  const [getAllSongs, {isLoading}] = useGetAllSongsMutation();
  const [postPlaylist, {isLoading: postplaylistloading}] =
    useAddPlaylistMutation();
  const {Toasts} = ToastMessage();
  const [songs, setSongs] = useState([]);
  const [checkedSongs, setCheckedSongs] = useState({});
  const [songName, setsongName] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);

  const toggleCheckbox = index => {
    setCheckedSongs(prevState => {
      const updatedState = {...prevState};
      if (updatedState[index]) {
        delete updatedState[index];
      } else {
        updatedState[index] = true;
      }
      return updatedState;
    });
  };
  const handleSelect = () => {
    if (songs.length === Object.keys(checkedSongs).length) {
      setCheckedSongs({});
    } else {
      const allSelected = songs.reduce((acc, song) => {
        acc[song._id] = true;
        return acc;
      }, {});

      setCheckedSongs(allSelected);
    }
  };

  const handleAdd = async () => {
    const selectedSongs = songs.filter((val, index) => checkedSongs[val?._id]);
    const newItem = {
      Playlist_Name: playlistName,
      SongId: selectedSongs.map(val => val._id),
    };

    const result = await postPlaylist(newItem);
    if (result) {
      Toasts('Info', 'Playlist created successfully', 'success');
    }
    navigation.navigate('MusicScreen');
  };
  const handleCancel = () => {
    setCheckedSongs({});
    navigation.navigate('MusicScreen');
  };
  const gettingAllSongs = async () => {
    try {
      const res = await getAllSongs({}).unwrap();
      setSongs(res.data.data);
      setFilteredSongs(res?.data?.data);
    } catch (error) {
      console.log('error in getting all songs:', error);
    }
  };
  useEffect(() => {
    gettingAllSongs();
  }, []);
  useEffect(() => {
    const filtered = songs.filter(song =>
      song.Song_Name?.toLowerCase().includes(songName?.toLowerCase()),
    );
    setFilteredSongs(filtered);
  }, [songName]);
  const renderSongs = ({item, index}) => (
    <TouchableOpacity onPress={() => toggleCheckbox(item._id)}>
      <View key={index} style={styles.songRow}>
        <Text style={styles.songText} numberOfLines={1}>
          {index + 1}. {item.Song_Name}
        </Text>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: checkedSongs[item._id]
                ? '#CCAA6B'
                : 'transparent',
            },
          ]}>
          {checkedSongs[item._id] && (
            <Image
              source={require('../../Assets/images/tick.png')}
              style={styles.tickIcon}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          padding: responsiveWidth(2),
          marginTop: responsiveHeight(4),
        }}>
        <TouchableOpacity onPress={handleSelect}>
          <Text style={{color: '#fff'}}>
            {songs.length == Object.keys(checkedSongs).length
              ? 'Deselect All'
              : 'Select All'}
          </Text>
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.title}>
          {playlistName}
        </Text>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={{color: '#fff'}}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: responsiveHeight(6),
          backgroundColor: '#9D824F',
          borderRadius: responsiveWidth(2),
          marginVertical: responsiveHeight(0.5),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <TextInput
          placeholder="Search Song"
          value={songName}
          onChangeText={setsongName}
          placeholderTextColor={'#000'}
          style={{
            width: '80%',
            fontSize: responsiveHeight(2),
            paddingLeft: responsiveWidth(3.8),
            color: '#fff',
            ...Platform.select({
              ios: {
                color: '#000',
              },
            }),
          }}></TextInput>
        <Image
          source={require('../../Assets/images/search.png')}
          style={{
            tintColor: '#fff',
            width: responsiveWidth(5),
            height: responsiveHeight(5),
            resizeMode: 'contain',
            marginLeft: responsiveWidth(2),
          }}
        />
      </View>
      {songs.length > 0 ? (
        <FlatList
          data={filteredSongs}
          renderItem={renderSongs}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ActivityIndicator size={responsiveHeight(5)} color={'#9D824F'} />
      )}

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: responsiveHeight(9),
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor:
              Object.keys(checkedSongs).length > 0 ? '#9D824F' : null,
            padding: responsiveWidth(2),
            width: '50%',
            borderRadius: responsiveWidth(8),
            borderWidth: responsiveWidth(0.2),
            borderColor:
              Object.keys(checkedSongs).length > 0 ? '#9D824F' : null,
            display: Object.keys(checkedSongs).length > 0 ? 'flex' : 'none',
          }}
          onPress={handleAdd}>
          {postplaylistloading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : Object.keys(checkedSongs).length > 0 ? (
            <Text style={{textAlign: 'center', color: '#1c1508'}}>
              Add ({Object.keys(checkedSongs).length})
            </Text>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1c1508',
  },
  title: {
    fontWeight: '500',
    fontSize: responsiveFontSize(2.4),
    color: '#9D824F',
    textAlign: 'center',
    width: '40%',
  },
  songRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: responsiveWidth(5),
    padding: responsiveWidth(3),
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#9D824F',
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
});

export default AllSongs;
