import React, {forwardRef, useState} from 'react';
import {
  Image,
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface PasswordInputProps extends TextInputProps {
  imageSource: any;
  placeholder: string;
  initialValue?: string;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
}

const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  (
    {
      imageSource,
      placeholder,
      initialValue = '',
      editable = true,
      onChangeText,
      style,
      ...rest
    },
    ref,
  ) => {
    const [text, setText] = useState<string>(initialValue);
    const [secureText, setSecureText] = useState<boolean>(true);

    const handleTextChange = (value: string) => {
      setText(value);
      onChangeText?.(value);
    };

    return (
      <View style={[styles.container, style]}>
        <Image source={imageSource} style={styles.image} />
        <TextInput
          ref={ref}
          style={styles.input}
          placeholder={placeholder}
          value={text}
          editable={editable}
          onChangeText={handleTextChange}
          secureTextEntry={secureText}
          placeholderTextColor="gray"
          {...rest}
        />
        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={styles.iconContainer}>
          {secureText ? (
            <Image
              tintColor={'black'}
              style={{
                resizeMode: 'contain',
                height: responsiveHeight(3),
                width: responsiveWidth(5),
              }}
              source={require('../../Assets/images/eye.png')}
            />
          ) : (
            <Image
              tintColor={'black'}
              style={{
                resizeMode: 'contain',
                height: responsiveHeight(3),
                width: responsiveWidth(5),
              }}
              source={require('../../Assets/images/eye-off.png')}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveHeight(1),
    position: 'relative',
  },
  image: {
    width: responsiveWidth(18),
    height: responsiveHeight(10),
    position: 'absolute',
    zIndex: 1000,
  },
  input: {
    width: responsiveWidth(77),
    padding: responsiveHeight(1.2),
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: responsiveWidth(8),
    fontSize: responsiveFontSize(2),
    color: 'black',
    backgroundColor: 'white',
    paddingLeft: responsiveWidth(17),
  },
  iconContainer: {
    position: 'absolute',
    right: responsiveWidth(5),
    width: responsiveWidth(12),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
  },
});

export default PasswordInput;
