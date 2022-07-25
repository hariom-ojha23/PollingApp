import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingCreateButton = props => {
  return (
    <Pressable style={styles.btn} {...props}>
      <Icon name="add" size={35} color="#fff" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 55,
    height: 55,
    backgroundColor: '#007bff',
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingCreateButton;
