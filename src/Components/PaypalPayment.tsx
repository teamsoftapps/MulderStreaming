import React, {useState} from 'react';
import {View, Button, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
const PayPalPayment = () => {
  const [redirectUrl, setRedirectUrl] = useState(null);
  const initiatePayment = async () => {
    try {
      const response = await fetch(
        'https://mulder-backend-team-soft-apps.vercel.app/payPayment?price=17.99',
      ); // Adjust the price
      const data = await response.json();
      setRedirectUrl(data.link);
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate payment');
      console.error(error);
    }
  };
  const onPaymentSuccess = (data: any) => {
    // Handle the successful payment response
    Alert.alert('Payment Success', JSON.stringify(data));
  };
  const onPaymentError = (error: any) => {
    // Handle the payment error response
    Alert.alert('Payment Error', JSON.stringify(error));
  };
  return (
    <View style={{flex: 1}}>
      {!redirectUrl ? (
        <Button title="Pay with PayPal" onPress={initiatePayment} />
      ) : (
        <WebView
          source={{uri: redirectUrl}}
          onNavigationStateChange={navState => {
            if (navState.url.includes('YOUR_SUCCESS_URL')) {
              // Extract paymentId and PayerID from the URL
              const urlParams = new URLSearchParams(navState.url.split('?')[1]);
              const paymentId = urlParams.get('paymentId');
              const payerID = urlParams.get('PayerID');
              // Call your successPayment API
              fetch(
                `https://mulder-backend-team-soft-apps.vercel.app/successPayment?paymentId=${paymentId}&PayerID=${payerID}`,
              )
                .then(response => response.json())
                .then(onPaymentSuccess)
                .catch(onPaymentError);
            } else if (navState.url.includes('YOUR_CANCEL_URL')) {
              // Handle cancel case
              Alert.alert('Payment Cancelled');
              setRedirectUrl(null); // Reset the redirectUrl
            }
          }}
        />
      )}
    </View>
  );
};
export default PayPalPayment;
