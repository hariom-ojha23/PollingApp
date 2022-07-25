import React from 'react';
import {TextInput, StyleSheet, View, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../constants/Colors';

const OutlinedInput = props => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.inputBox}>
      <Icon
        style={{marginRight: 15}}
        name={props.icon}
        size={18}
        color="#007bff"
      />
      <TextInput
        style={[styles.input, {color: Colors[colorScheme].text}]}
        {...props}
        placeholder={props.placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    paddingHorizontal: 20,
    borderColor: '#C0C0C0',
    borderWidth: 1.2,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    flex: 1,
  },
});

export default React.memo(OutlinedInput);
