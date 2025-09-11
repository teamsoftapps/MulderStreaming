import {responsiveFontSize} from 'react-native-responsive-dimensions';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#CCAA6B', backgroundColor: '#1c1508'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        color: '#CCAA6B',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: '#CCAA6B', backgroundColor: '#1c1508'}}
      text1Style={{
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        color: '#CCAA6B',
      }}
      text2Style={{
        fontSize: responsiveFontSize(1.5),
        color: '#CCAA6B',
      }}
    />
  ),
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{borderLeftColor: '#CCAA6B', backgroundColor: '#1c1508'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: responsiveFontSize(1.7),
        fontWeight: 'bold',
        color: '#CCAA6B',
      }}
      text2Style={{
        fontSize: responsiveFontSize(1.5),
        color: '#CCAA6B',
      }}
    />
  ),
};
export default toastConfig;
