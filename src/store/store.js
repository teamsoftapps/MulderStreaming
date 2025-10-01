import {configureStore} from '@reduxjs/toolkit';
import {MMKV} from 'react-native-mmkv';
import {persistReducer, persistStore} from 'redux-persist';
import {Auth} from './Api/Auth';
import allReducer from './slices';

const storage = new MMKV();
const reduxPersistStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },

  getItem: (key: string) => {
    const Value = storage.getString(key);
    return Promise.resolve(Value);
  },

  deleteItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};
const persistConfig: any = {
  key: 'root',
  storage: reduxPersistStorage,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, allReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getdefaultMiddleware =>
    getdefaultMiddleware({
      serializableCheck: false,
    }).concat(Auth.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistore = persistStore(store);
