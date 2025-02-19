import {
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';

interface Props {
  style?: ViewStyle;
  children?: ReactNode;
  bgColor?: string;
  barstatus?: boolean | undefined;
  barStyle?: StatusBarStyle | null | undefined;
}

const WrapperContainer: React.FC<Props> = ({
  style = {},
  children,
  bgColor,
  barstatus = false,
  barStyle = 'light-content',
}) => {
  return (
    <View
      style={{
        ...styles.container,
        ...style,
      }}>
      <StatusBar
        backgroundColor={'#9D824F'}
        hidden={barstatus}
        barStyle={barStyle}
      />
      <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
        {children}
      </SafeAreaView>
    </View>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
