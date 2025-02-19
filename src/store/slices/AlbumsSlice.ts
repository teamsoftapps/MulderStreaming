import {createSlice} from '@reduxjs/toolkit';

interface TrackPlayerSetup {
  isTrackPlayerSetup: boolean;
}

const initialState: TrackPlayerSetup = {
  isTrackPlayerSetup: false,
};

const trackPlayerSlice = createSlice({
  name: 'trackplayer',
  initialState,
  reducers: {
    toggleisTrackPlayerSetup(state) {
      state.isTrackPlayerSetup = !state.isTrackPlayerSetup;
    },
  },
});

export const {toggleisTrackPlayerSetup} = trackPlayerSlice.actions;

export default trackPlayerSlice.reducer;
