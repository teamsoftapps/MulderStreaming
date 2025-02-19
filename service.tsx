import TrackPlayer, {Event, State} from 'react-native-track-player';
import {store} from './src/store/store';
import {togglePlaying, setCurrentSongg} from './src/store/slices/songState';
module.exports = async function () {
  TrackPlayer.addEventListener(Event.PlaybackState, state => {
    if (state.state === State.Playing) {
      store.dispatch(togglePlaying(true));
    } else if (state.state === State.Paused) {
      store.dispatch(togglePlaying(false));
    }
  });
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, data => {
    TrackPlayer.seekTo(data.position);
  });
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await skipToNextTrack();
    // TrackPlayer.skipToNext();
    // logCurrentTrack();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await skipToPreviousTrack();
    // TrackPlayer.skipToPrevious();
    // logCurrentTrack();
  });

  const logCurrentTrack = async () => {
    try {
      const trackId = await TrackPlayer.getCurrentTrack();

      if (trackId !== null) {
        const track = await TrackPlayer.getTrack(trackId);

        console.log('Current track data:', track);
        const {playlist} = store.getState().musicPlayer;
        console.log('Current Playlist==>', playlist);
      } else {
        console.log('No track is currently playing.');
      }
    } catch (error) {
      console.error('Error getting current track:', error);
    }
  };

  const skipToNextTrack = async () => {
    try {
      const trackId = await TrackPlayer.getCurrentTrack();
      const track = await TrackPlayer.getTrack(trackId);
      const {playlist} = store.getState().musicPlayer;
      const id = track.id;
      const currentIndex = playlist.findIndex(song => song._id === id);
      console.log('Current Playlist==>', playlist);
      console.log('Current track data:', track);
      console.log('CurrentIndex===>', currentIndex);

      if (currentIndex < playlist.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextSong = playlist[nextIndex];
        await TrackPlayer.skip(nextIndex);
        store.dispatch(setCurrentSongg(nextSong));
        console.log('Next song data:', nextSong);
      } else {
        console.log('You are at the last song in the playlist.');
      }
    } catch (error) {
      console.error('Error skipping to the next track:', error);
    }
  };

  const skipToPreviousTrack = async () => {
    try {
      const trackId = await TrackPlayer.getCurrentTrack();
      const track = await TrackPlayer.getTrack(trackId);
      const {playlist} = store.getState().musicPlayer;
      const id = track.id;
      const currentIndex = playlist.findIndex(song => song._id === id);
      console.log('Current Playlist==>', playlist);
      console.log('Current track data:', track);
      console.log('CurrentIndex===>', currentIndex);

      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        const prevSong = playlist[prevIndex];
        await TrackPlayer.skip(prevIndex);
        store.dispatch(setCurrentSongg(prevSong));
        console.log('Previous song data:', prevSong);
      } else {
        console.log('You are at the first song in the playlist.');
      }
    } catch (error) {
      console.error('Error skipping to the previous track:', error);
    }
  };
};
