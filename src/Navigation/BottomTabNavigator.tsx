import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, View, Platform} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import HomeScreen from '../Screens/HomeScreen';
import SettingScreen from '../Screens/SettingScreen';
import PlaylistScreen from '../Screens/PlaylistScreen';
import WishListScreen from '../Screens/WishListScreen';
import WrapperContainer from '../Components/WrapperContainer';

const Tab = createBottomTabNavigator();

interface TabItem {
  name: string;
  component: React.ComponentType<any>;
  activeIcon: any;
  inactiveIcon: any;
}

const tabItems: TabItem[] = [
  {
    name: 'MusicScreen',
    component: HomeScreen,
    activeIcon: require('../../Assets/images/homeImg.png'),
    inactiveIcon: require('../../Assets/images/outlineHome.png'),
  },
  {
    name: 'PlaylistScreen',
    component: PlaylistScreen,
    activeIcon: require('../../Assets/images/musicImg.png'),
    inactiveIcon: require('../../Assets/images/outlineMusic.png'),
  },
  {
    name: 'WishListScreen',
    component: WishListScreen,
    activeIcon: require('../../Assets/images/heartImg.png'),
    inactiveIcon: require('../../Assets/images/outlineHeart.png'),
  },
  {
    name: 'SettingScreen',
    component: SettingScreen,
    activeIcon: require('../../Assets/images/settingImg.png'),
    inactiveIcon: require('../../Assets/images/outlineSetting.png'),
  },
];

const BottomTabNavigator: React.FC = () => {
  return (
    <WrapperContainer style={{flex: 1, backgroundColor: '#1c1508'}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#9D824F',
            height: responsiveHeight(7),
            borderRadius: responsiveWidth(5),
            marginTop: responsiveHeight(2),
          },
          tabBarItemStyle: {
            height: responsiveHeight(7),
            justifyContent: 'center',
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#000',
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}>
        {tabItems.map(({name, component, activeIcon, inactiveIcon}) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Image
                    source={focused ? activeIcon : inactiveIcon}
                    style={{
                      width:
                        name === 'MusicScreen'
                          ? responsiveWidth(6)
                          : name === 'WishListScreen' ||
                            name === 'SettingScreen'
                          ? responsiveWidth(7)
                          : name === 'PlaylistScreen'
                          ? responsiveWidth(5)
                          : responsiveWidth(7),
                      height: responsiveHeight(6),
                      marginBottom:
                        Platform.OS === 'ios' ? responsiveHeight(1) : 0,
                    }}
                    resizeMode="contain"
                  />
                </View>
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </WrapperContainer>
  );
};

export default BottomTabNavigator;
