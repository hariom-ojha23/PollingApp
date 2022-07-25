import React from 'react';
import {View, Text, useColorScheme, StyleSheet} from 'react-native';

import Colors from '../../constants/Colors';

const Profile = () => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: Colors[colorScheme].background},
      ]}></View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Profile;
