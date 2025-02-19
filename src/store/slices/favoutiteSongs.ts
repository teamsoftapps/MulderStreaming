import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FavoriteState {
  favorites: string[];
}

const initialState: FavoriteState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const songId = action.payload;
      if (state.favorites.includes(songId)) {
        state.favorites = state.favorites.filter(id => id !== songId);
      } else {
        state.favorites.push(songId);
      }
    },
  },
});

export const {toggleFavorite} = favoritesSlice.actions;
export default favoritesSlice.reducer;
