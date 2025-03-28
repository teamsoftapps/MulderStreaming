import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  MakeSelectionForgotPassword: undefined;
  HomeScreen: undefined;
  AboutApplication: undefined;
  HelpScreen: undefined;
  AlbumScreen: {data: any};
  MusicPlayer: undefined;
  BottomTabNavigator: undefined;
  PlaylistScreen: undefined;
  PlaylistDetails: {data: any};
  AllSongs: {playlistName: string} | undefined;
  CustomWebViewContent: undefined;
  MusicScreen: undefined;
};
