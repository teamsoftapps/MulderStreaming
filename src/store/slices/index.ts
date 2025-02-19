import {combineReducers} from '@reduxjs/toolkit';
import {Auth} from '../Api/Auth';
import authSlice from './authSlice';
import favouriteSongs from './favoutiteSongs';
import musicPlayerReducer from './songState';
import albumSlice from './AlbumsSlice';
const allReducer = combineReducers({
  auth: authSlice,
  favorites: favouriteSongs,
  musicPlayer: musicPlayerReducer,
  albumSongs: albumSlice,
  [Auth.reducerPath]: Auth.reducer,
});
export default allReducer;
