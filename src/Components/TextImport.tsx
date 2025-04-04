import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {
  Image,
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface TextImportProps extends TextInputProps {
  imageSource: any;
  placeholder: string;
  initialValue?: string;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
  keyboard_Type?: any;
  textContentType?: any;
  autoComplete?: any;
  importantForAutofill?: 'yes' | 'no' | 'auto';
  inputMode?:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';
}

const TextImport = forwardRef<TextInput, TextImportProps>(
  (
    {
      imageSource,
      placeholder,
      initialValue = '',
      editable = true,
      keyboard_Type,
      onChangeText,
      secureTextEntry = false,
      textContentType,
      autoComplete,
      importantForAutofill = 'yes',
      inputMode,
      style,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [text, setText] = useState<string>(initialValue);
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
      // Additional focus handling if needed
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      // Additional blur handling if needed
      onBlur?.(e);
    };

    return (
      <View style={[styles.container, style]}>
        <Image
          source={imageSource}
          style={{
            width: responsiveWidth(20),
            height: responsiveHeight(10),
            left: responsiveWidth(14),
            position: 'relative',
            zIndex: 1000,
          }}
        />
        <TextInput
          allowFontScaling={false}
          keyboardType={keyboard_Type}
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          value={text}
          editable={editable}
          onChangeText={handleTextChange}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="gray"
          textContentType={textContentType}
          autoComplete={autoComplete}
          importantForAutofill={importantForAutofill}
          inputMode={inputMode}
          enablesReturnKeyAutomatically={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveHeight(1.3),
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 100,
  },
  input: {
    width: responsiveWidth(75),
    padding: responsiveHeight(1.2),
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: responsiveWidth(8),
    fontSize: responsiveFontSize(2),
    color: 'black',
    backgroundColor: 'white',
    paddingLeft: responsiveWidth(14),
    marginRight: responsiveWidth(15),
  },
});

export default TextImport;
