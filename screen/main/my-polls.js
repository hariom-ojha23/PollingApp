import React from 'react';
import {View, StyleSheet, useColorScheme} from 'react-native';

import FloatingCreateButton from '../../components/FloatingCreateButton';
import Colors from '../../constants/Colors';

const MyPolls = ({navigation}) => {
  const colorScheme = useColorScheme();
  const onPress = () => {
    navigation.navigate('CreatePoll');
  };
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: Colors[colorScheme].background},
      ]}>
      <View style={styles.fabContainer}>
        <FloatingCreateButton onPress={onPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
});

export default MyPolls;
