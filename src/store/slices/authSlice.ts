import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  token: string | null | any;
  loginToken: string | null;
}

const initialState: AuthState = {
  token: null,
  loginToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.loginToken = action.payload;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearUser: state => {
      state.token = null;
    },
  },
});

export const {setToken, setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;
