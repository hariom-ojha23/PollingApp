import React, {useContext} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';

import FloatingCreateButton from '../../components/FloatingCreateButton';
import PollItem from '../../components/polls/PollItem';
import {FirebaseContext} from '../../context/firebaseContext';

const Home = ({navigation}) => {
  const {polls, loading, user} = useContext(FirebaseContext);

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
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
  list: {
    paddingHorizontal: 15,
  },
});

export default React.memo(Home);
