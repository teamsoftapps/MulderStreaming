import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import AboutApplication from '../Screens/AboutApplication';
import HelpScreen from '../Screens/HelpScreen';
import AlbumScreen from '../Screens/AlbumScreen';
import MusicPlayer from '../Components/MusicPlayer';
import {StatusBar} from 'react-native';
import PlaylistDetails from '../Screens/PlaylistDetails';
import AllSongs from '../Screens/AllSongs';

import WebViewContent from '../Components/WebViewContent';

type MainStackProps = {
  language: string;
  changeLanguage: (langCode: string | null) => void;
};

const Stack = createNativeStackNavigator();

const MainStack = ({language, changeLanguage}: MainStackProps) => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="BottomTabNavigator">
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />

      <Stack.Screen name="AboutApplication" component={AboutApplication} />
      <Stack.Screen name="HelpScreen" component={HelpScreen} />
      <Stack.Screen name="AlbumScreen" component={AlbumScreen} />
      <Stack.Screen name="PlaylistDetails" component={PlaylistDetails} />
      <Stack.Screen name="AllSongs" component={AllSongs} />
      <Stack.Screen name="MusicPlayer" component={MusicPlayer} />
      <Stack.Screen name="WebViewContent" component={WebViewContent} />
    </Stack.Navigator>
  </>
);

export default MainStack;
