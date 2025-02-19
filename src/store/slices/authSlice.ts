import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload.token;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearUser: state => {
      state.token = null;
    },
  },
});

export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;
