export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: {email: string};
  MakeSelectionForgotPassword: {data: any};
  HomeScreen: undefined;
  AboutApplication: undefined;
  HelpScreen: undefined;
  AlbumScreen: {data: any};
  MusicPlayer: undefined;
  BottomTabNavigator: undefined;
  PlaylistScreen: undefined;
  PlaylistDetails: {data: any};
  AllSongs: {playlistName: string | any} | undefined;
  CustomWebViewContent: undefined;
  MusicScreen: undefined;
  CheckSubscriptionCode: {email: string};
  WebViewContent: undefined;
};
