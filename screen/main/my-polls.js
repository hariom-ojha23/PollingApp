import React, {useContext} from 'react';
import {View, StyleSheet, useColorScheme, FlatList} from 'react-native';

import FloatingCreateButton from '../../components/FloatingCreateButton';
import PollItem from '../../components/myPolls/pollItem';
import {FirebaseContext} from '../../context/firebaseContext';

const MyPolls = ({navigation}) => {
  const {myPolls} = useContext(FirebaseContext);

  const onPressFab = () => {
    navigation.navigate('CreatePoll');
  };

  const onPressPoll = poll => {
    navigation.navigate('PollDetail', {poll});
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.fabContainer}>
        <FloatingCreateButton onPress={onPressFab} />
      </View>

      <View>
        <FlatList
          contentContainerStyle={styles.list}
          data={myPolls}
          renderItem={({item}) => (
            <PollItem onPress={onPressPoll} poll={item} />
          )}
          keyExtractor={poll => poll.id}
          ListFooterComponent={
            <View style={{height: 150, width: '100%'}}></View>
          }
        />
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
  list: {
    paddingHorizontal: 15,
  },
});

export default MyPolls;
