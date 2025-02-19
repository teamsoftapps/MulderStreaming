import React, {useState} from 'react';
import {Image, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, TextInput, View, Dimensions} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from 'i18next';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface DropdownProps {
  imageSource: any;
  placeholder: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  changeLanguage: (langCode: string | null) => void;
}

const SelectLangDropdown: React.FC<DropdownProps> = ({
  imageSource,
  placeholder,
  disabled = false,
  style,
  changeLanguage,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    {label: 'English', value: 'en'},
    {label: 'Dutch', value: 'nl'},
  ]);

  const handleChangeLanguage = (langCode: string | null) => {
    setValue(langCode); // Update local value
    changeLanguage(langCode); // Notify parent of the change
  };

  return (
    <View style={styles.container}>
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
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={handleChangeLanguage}
        placeholder={placeholder}
        placeholderStyle={styles.placeholderStyle}
        style={styles.input}
        containerStyle={styles.dropdownContainer}
        dropDownContainerStyle={styles.dropDownContainerStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 100,
  },
  input: {
    width: responsiveWidth(75),
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: responsiveWidth(8),
    fontSize: responsiveFontSize(2),
    color: 'black',
    backgroundColor: 'white',
    paddingLeft: responsiveWidth(14),
  },
  placeholderStyle: {
    color: 'gray',
    fontSize: responsiveFontSize(2),
  },
  dropDownContainerStyle: {
    borderColor: 'gray',
  },
  dropdownContainer: {
    width: responsiveWidth(75),
    zIndex: 100,
    marginRight: responsiveWidth(14),
  },
});

export default SelectLangDropdown;
function setAlertVisible(arg0: boolean) {
  throw new Error('Function not implemented.');
}
