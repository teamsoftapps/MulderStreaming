// import TrackPlayer, {Event, State} from 'react-native-track-player';
// import {store} from './src/store/store';
// import {togglePlaying, setCurrentSongg} from './src/store/slices/songState';
// module.exports = async function () {
//   TrackPlayer.addEventListener(Event.PlaybackState, state => {
//     if (state.state === State.Playing) {
//       store.dispatch(togglePlaying(true));
//     } else if (state.state === State.Paused) {
//       store.dispatch(togglePlaying(false));
//     }
//   });
//   TrackPlayer.addEventListener(Event.RemotePlay, () => {
//     TrackPlayer.play();
//   });

//   TrackPlayer.addEventListener(Event.RemotePause, () => {
//     TrackPlayer.pause();
//   });

//   TrackPlayer.addEventListener(Event.RemoteSeek, data => {
//     TrackPlayer.seekTo(data.position);
//   });
//   TrackPlayer.addEventListener(Event.RemoteNext, async () => {
//     await skipToNextTrack();
//   });

//   TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
//     await skipToPreviousTrack();
//   });

//   const skipToNextTrack = async () => {
//     try {
//       const trackId = await TrackPlayer.getCurrentTrack();
//       const track = await TrackPlayer.getTrack(trackId);
//       const {playlist} = store.getState().musicPlayer;
//       const id = track.id;
//       const currentIndex = playlist.findIndex(song => song._id === id);

//       if (currentIndex < playlist.length - 1) {
//         const nextIndex = currentIndex + 1;
//         const nextSong = playlist[nextIndex];
//         await TrackPlayer.skip(nextIndex);
//         store.dispatch(setCurrentSongg(nextSong));
//       }
//     } catch (error) {
//       console.error('Error skipping to the next track:', error);
//     }
//   };

//   const skipToPreviousTrack = async () => {
//     try {
//       const trackId = await TrackPlayer.getCurrentTrack();
//       const track = await TrackPlayer.getTrack(trackId);
//       const {playlist} = store.getState().musicPlayer;
//       const id = track.id;
//       const currentIndex = playlist.findIndex(song => song._id === id);

//       if (currentIndex > 0) {
//         const prevIndex = currentIndex - 1;
//         const prevSong = playlist[prevIndex];
//         await TrackPlayer.skip(prevIndex);
//         store.dispatch(setCurrentSongg(prevSong));
//       }
//     } catch (error) {
//       console.error('Error skipping to the previous track:', error);
//     }
//   };
// };

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
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await skipToPreviousTrack();
  });

  const skipToNextTrack = async () => {
    try {
      const trackId = await TrackPlayer.getCurrentTrack();
      if (trackId === null) {
        console.error('No current track found');
        return;
      }

      const track = await TrackPlayer.getTrack(trackId);
      if (!track || !track.id) {
        console.error('Track or track ID is undefined');
        return;
      }

      const {playlist} = store.getState().musicPlayer;
      const currentIndex = playlist.findIndex(song => song._id === track.id);

      if (currentIndex === -1) {
        console.error('Current track not found in playlist');
        return;
      }

      if (currentIndex < playlist.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextSong = playlist[nextIndex];
        await TrackPlayer.skip(nextIndex);
        store.dispatch(setCurrentSongg(nextSong));
      }
    } catch (error) {
      console.error('Error skipping to the next track:', error);
    }
  };

  const skipToPreviousTrack = async () => {
    try {
      const trackId = await TrackPlayer.getCurrentTrack();
      if (trackId === null) {
        console.error('No current track found');
        return;
      }

      const track = await TrackPlayer.getTrack(trackId);
      if (!track || !track.id) {
        console.error('Track or track ID is undefined');
        return;
      }

      const {playlist} = store.getState().musicPlayer;
      const currentIndex = playlist.findIndex(song => song._id === track.id);

      if (currentIndex === -1) {
        console.error('Current track not found in playlist');
        return;
      }

      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        const prevSong = playlist[prevIndex];
        await TrackPlayer.skip(prevIndex);
        store.dispatch(setCurrentSongg(prevSong));
      }
    } catch (error) {
      console.error('Error skipping to the previous track:', error);
    }
  };
};
