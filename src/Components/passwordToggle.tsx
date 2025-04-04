import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {
  Alert,
  Image,
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
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

const generatePassword = (): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  return Array.from(
    {length: 12},
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
};

const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  (
    {
      imageSource,
      placeholder,
      initialValue = '',
      editable = true,
      onChangeText,
      onFocus,
      onBlur,
      style,
      ...rest
    },
    ref,
  ) => {
    const [text, setText] = useState<string>(initialValue);
    const [secureText, setSecureText] = useState<boolean>(true);
    const [isGenerated, setIsGenerated] = useState<boolean>(false);
    const inputRef = React.useRef<TextInput>(null);

    // Pass the ref to the parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      clear: () => {
        inputRef.current?.clear();
        setText('');
      },
      isFocused: () => {
        return inputRef.current?.isFocused() || false;
      },
      setNativeProps: (nativeProps: object) => {
        inputRef.current?.setNativeProps(nativeProps);
      },
    }));

    const handleTextChange = (value: string) => {
      setText(value);
      onChangeText?.(value);
    };

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (!isGenerated && Platform.OS === 'android') {
        Alert.alert(
          'Auto-generate Password',
          'Do you want to auto-generate a secure password?',
          [
            {
              text: 'No',
              onPress: () => setIsGenerated(true),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                const newPassword = generatePassword();
                setText(newPassword);
                onChangeText?.(newPassword);
                setIsGenerated(true);
              },
            },
          ],
        );
      }

      // Call the original onFocus handler if provided
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      // Call the original onBlur handler if provided
      onBlur?.(e);
    };

    return (
      <View style={[styles.container, style]}>
        <Image source={imageSource} style={styles.image} />
        <TextInput
          allowFontScaling={false}
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          value={text}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleTextChange}
          secureTextEntry={secureText}
          placeholderTextColor="gray"
          // Set appropriate platform-specific textContentType and autoComplete
          textContentType={Platform.OS === 'ios' ? 'newPassword' : 'password'}
          autoComplete={Platform.OS === 'ios' ? 'password-new' : 'password'}
          importantForAutofill="yes"
          enablesReturnKeyAutomatically={true}
          keyboardType="default"
          returnKeyType={rest.returnKeyType}
          onSubmitEditing={rest.onSubmitEditing}
          {...rest}
        />

        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={styles.iconContainer}>
          {secureText ? (
            <Image
              tintColor={'black'}
              style={styles.eyeIcon}
              source={require('../../Assets/images/eye.png')}
            />
          ) : (
            <Image
              tintColor={'black'}
              style={styles.eyeIcon}
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
  eyeIcon: {
    resizeMode: 'contain',
    height: responsiveHeight(3),
    width: responsiveWidth(5),
  },
});

export default PasswordInput;
