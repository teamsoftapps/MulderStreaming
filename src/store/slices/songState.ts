import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface PlaylistItem {
  Song_index: number;
  _id: string;
  Song_Name: string;
  Song_File: string;
  Album_Name: string;
  Song_Length: string;
  Song_Lyrics: string;
  Album_Image: string;
  audio?: any; // Replace `any` with the appropriate type for `audio`, if available.
}

interface SongState {
  playlist: PlaylistItem[];
  persistCurrentSong: PlaylistItem | null;
  isPlaying: boolean;
  playingSongIndex: Number;
}

const initialState: SongState = {
  playlist: [],
  persistCurrentSong: null,
  isPlaying: false,
  playingSongIndex: null,
};

const songStateSlice = createSlice({
  name: 'songState',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<PlaylistItem[]>) => {
      state.playlist = action.payload;
    },
    setCurrentSongg: (state, action: PayloadAction<PlaylistItem | null>) => {
      state.persistCurrentSong = action.payload;
    },
    togglePlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPlayingSongIndex: (state, action: PayloadAction<Number>) => {
      state.playingSongIndex = action.payload;
    },
  },
});

export const {
  setPlaylist,
  setCurrentSongg,
  togglePlaying,
  setPlayingSongIndex,
} = songStateSlice.actions;
export default songStateSlice.reducer;
