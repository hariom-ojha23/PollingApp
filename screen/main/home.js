import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import FloatingCreateButton from '../../components/FloatingCreateButton';
import PollItem from '../../components/home/PollItem';

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const sub = firestore()
      .collection('polls')
      .where('privacy', '==', 'Public')
      .orderBy('createdAt', 'desc')
      .onSnapshot({
        error: e => console.log(e),
        next: querySnapshot => {
          const polls = [];
          querySnapshot.forEach(snapshot => {
            polls.push({
              ...snapshot.data(),
              id: snapshot.id,
            });
          });

          setPolls(polls);
          setLoading(false);
        },
      });

    return () => sub();
  }, []);

  const onPress = () => {
    navigation.navigate('CreatePoll');
  };

  if (loading) {
    return <ActivityIndicator size={30} style={{marginTop: 30}} />;
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.fabContainer}>
        <FloatingCreateButton onPress={onPress} />
      </View>

      <View style={styles.pollsContainer}>
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
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
  list: {
    paddingHorizontal: 15,
  },
});

export default Home;
