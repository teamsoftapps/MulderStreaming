import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../Screens/SignIn';
import SignUp from '../Screens/SignUp';
import ForgotPassword from '../Screens/ForgotPassword';
import MakeSelectonForgotPassword from '../Screens/MakeSelectonForgotPassword';
import CheckSubscriptionCode from '../Screens/CheckSubscriptionCode';
import CustomWebViewComponent from '../Components/CustomWebView';

type AuthStackProps = {
  setbool: (value: boolean) => void;
  changeLanguage: (langCode: string | null) => void;
};

const Stack = createNativeStackNavigator();

const AuthStack = ({setbool, changeLanguage}: AuthStackProps) => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="SignIn">
      {props => (
        <SignIn {...props} setbool={setbool} changeLanguage={changeLanguage} />
      )}
    </Stack.Screen>
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen
      name="CheckSubscriptionCode"
      component={CheckSubscriptionCode}
    />

    <Stack.Screen
      name="MakeSelectionForgotPassword"
      component={MakeSelectonForgotPassword}
    />
    <Stack.Screen
      name="CustomWebViewContent"
      component={CustomWebViewComponent}
    />
  </Stack.Navigator>
);

export default AuthStack;
