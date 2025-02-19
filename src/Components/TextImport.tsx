import React, {forwardRef, useState} from 'react';
import {
  Image,
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleSheet,
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
}

const TextImport = forwardRef<TextInput, TextImportProps>(
  (
    {
      imageSource,
      placeholder,
      initialValue = '',
      editable = true,
      onChangeText,
      secureTextEntry = false,
      style,
      ...rest
    },
    ref,
  ) => {
    const [text, setText] = useState<string>(initialValue);

    const handleTextChange = (value: string) => {
      setText(value);
      onChangeText?.(value);
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
          ref={ref}
          style={styles.input}
          placeholder={placeholder}
          value={text}
          editable={editable}
          onChangeText={handleTextChange}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="gray"
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
