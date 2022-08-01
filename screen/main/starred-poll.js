import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import FloatingCreateButton from '../../components/FloatingCreateButton';
import PollItem from '../../components/polls/PollItem';

import {FirebaseContext} from '../../context/firebaseContext';
import Colors from '../../constants/Colors';

const StarredPolls = ({navigation}) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const {starredPoll} = useContext(FirebaseContext);

  useEffect(() => {
    if (starredPoll.length !== 0) {
      const sub = firestore()
        .collection('polls')
        .where(firestore.FieldPath.documentId(), 'in', starredPoll)
        .onSnapshot(querySnapshot => {
          const polls = [];

          querySnapshot.forEach(snapshot => {
            polls.push({
              ...snapshot.data(),
              id: snapshot.id,
            });
          });
          setPolls(polls);
          setLoading(false);
        });

      return () => sub();
    } else {
      setPolls([]);
      setLoading(false);
    }
  }, [starredPoll]);

  const onPress = () => {
    navigation.navigate('CreatePoll');
  };

  if (loading) {
    return <ActivityIndicator size={30} style={{marginTop: 30}} />;
  }

  if (starredPoll.length === 0) {
    return (
      <View style={[styles.container, {padding: 15, marginTop: 20}]}>
        <Text style={[styles.noPoll, {color: Colors[colorScheme].text}]}>
          You do not have any starred polls
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.fabContainer}>
        <FloatingCreateButton onPress={onPress} />
      </View>

      <View>
        <FlatList
          contentContainerStyle={styles.list}
          data={polls}
          renderItem={({item}) => <PollItem poll={item} />}
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

export default React.memo(StarredPolls);
