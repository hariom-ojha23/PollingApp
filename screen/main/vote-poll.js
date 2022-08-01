import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ToastAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

import Colors from '../../constants/Colors';
import Choice from '../../components/polls/Choice';
import {FirebaseContext} from '../../context/firebaseContext';

const colorArr = ['#ee5186', '#66BB6A', '#49a3f1', '#FFA726'];

const VotePoll = props => {
  const [choices, setChoices] = useState([]);

  const {poll, user, setSearchPoll} = useContext(FirebaseContext);

  const {id} = props.route.params;
  const colorScheme = useColorScheme();
  const colorText = {color: Colors[colorScheme].text};
  const colorGray = {color: Colors[colorScheme].gray};

  useEffect(() => {
    setSearchPoll(id);
  }, []);

  useEffect(() => {
    const sub = firestore()
      .collection('polls')
      .doc(poll.id)
      .collection('choices')
      .onSnapshot(querySnapshot => {
        const choices = [];

        querySnapshot.forEach(snapshot => {
          choices.push({
            ...snapshot.data(),
            id: snapshot.id,
          });
        });
        setChoices(choices);
      });

    return () => sub();
  }, [poll]);

  const onPressChoice = async choice => {
    const document = await firestore().collection('polls').doc(poll.id).get();

    if (!document.exists) {
      ToastAndroid.show(
        'No Such Poll Exist. Please Refresh',
        ToastAndroid.SHORT,
      );
      return;
    } else if (document.data().voters.includes(user.uid)) {
      ToastAndroid.show('You already voted!', ToastAndroid.SHORT);
      return;
    }

    firestore()
      .collection('polls')
      .doc(poll.id)
      .collection('choices')
      .doc(choice.id)
      .update({
        voteCount: choice.voteCount + 1,
      })
      .then(() => {
        console.log('updated');
      })
      .catch(error => console.log(error));

    firestore()
      .collection('polls')
      .doc(poll.id)
      .update({
        voters: firestore.FieldValue.arrayUnion(user.uid),
      })
      .then(() => console.log('Voter list updated'))
      .catch(er => console.log(er));
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: Colors[colorScheme].background},
      ]}>
      <View style={styles.questionBox}>
        <Text style={[styles.name, colorGray]}>{poll.pollName}</Text>
        <Text style={[styles.question, colorText]}>{poll.pollQuestion}</Text>
      </View>

      <View style={styles.choiceBox}>
        {choices.map((choice, i) => (
          <Choice
            key={choice.id}
            choice={choice}
            bg={colorArr[i]}
            totalVote={poll.voters.length}
            onPress={onPressChoice}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[colorGray, {fontWeight: '600'}]}>
          Total Votes: {poll.voters.length}
        </Text>
        <Text style={[colorGray, {fontWeight: '600'}]}>
          {moment(poll.createdAt.seconds * 1000).format('DD MMM yyy')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    position: 'relative',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  questionBox: {
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  question: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  choiceBox: {
    marginBottom: 20,
  },
  footer: {
    marginHorizontal: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 12,
    width: '100%',
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
});

export default VotePoll;
