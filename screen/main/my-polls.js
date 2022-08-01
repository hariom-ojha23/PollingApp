import React, {useContext} from 'react';
import {View, Text, StyleSheet, useColorScheme, FlatList} from 'react-native';

import Colors from '../../constants/Colors';
import FloatingCreateButton from '../../components/FloatingCreateButton';
import PollItem from '../../components/myPolls/pollItem';
import {FirebaseContext} from '../../context/firebaseContext';

const MyPolls = ({navigation}) => {
  const {myPolls} = useContext(FirebaseContext);
  const colorScheme = useColorScheme();

  const onPressFab = () => {
    navigation.navigate('CreatePoll');
  };

  const onPressPoll = poll => {
    navigation.navigate('PollDetail', {id: poll.id});
  };

  if (myPolls.length === 0) {
    return (
      <View style={[styles.container, {padding: 15, marginTop: 20}]}>
        <Text style={[styles.noPoll, {color: Colors[colorScheme].text}]}>
          You do not have any polls. Please create some polls
        </Text>
      </View>
    );
  }

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
  noPoll: {
    fontSize: 22,
    textAlign: 'center',
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
