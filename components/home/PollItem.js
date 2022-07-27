import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/Colors';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Choice from './Choice';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FirebaseContext} from '../../context/firebaseContext';

const colorArr = ['#ee5186', '#66BB6A', '#FFA726', '#49a3f1'];

const PollItem = ({poll}) => {
  const [choices, setChoices] = useState([]);

  const colorScheme = useColorScheme();
  const {user, starredPoll} = useContext(FirebaseContext);

  const colorText = {color: Colors[colorScheme].text};
  const colorGray = {color: Colors[colorScheme].gray};

  const {currentUser} = auth();

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
      console.log('No Such Poll Exist. Please Refresh');
      return;
    } else if (document.data().voters.includes(currentUser.uid)) {
      console.log('You already voted!');
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
        voters: firestore.FieldValue.arrayUnion(currentUser.uid),
      })
      .then(() => console.log('Voter list updated'))
      .catch(er => console.log(er));
  };

  const onPressStar = async () => {
    const document = await firestore()
      .collection('starred')
      .doc(user.uid)
      .get();

    if (!document.exists) {
      firestore()
        .collection('starred')
        .doc(user.uid)
        .set({starredPoll: [poll.id]})
        .then(() => console.log('Set and Starred'))
        .catch(er => console.log(er));
    } else if (starredPoll.includes(poll.id)) {
      firestore()
        .collection('starred')
        .doc(user.uid)
        .update({starredPoll: firestore.FieldValue.arrayRemove(poll.id)})
        .then(() => console.log('Unstarred'))
        .catch(er => console.log(er));
    } else {
      firestore()
        .collection('starred')
        .doc(user.uid)
        .update({starredPoll: firestore.FieldValue.arrayUnion(poll.id)})
        .then(() => console.log('Starred'))
        .catch(er => console.log(er));
    }
  };

  return (
    <View style={[styles.card, {backgroundColor: Colors[colorScheme].card}]}>
      <View style={styles.header}>
        <View style={styles.nameBox}>
          <Image
            style={styles.avatar}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
          />
          <Text style={[styles.name, {color: Colors[colorScheme].text}]}>
            Hari om Ojha
          </Text>
        </View>

        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: Colors[colorScheme].gray,
          }}>
          {moment(poll.createdAt.seconds * 1000).format('DD MMM yyy')}
        </Text>
      </View>

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
        <TouchableOpacity onPress={onPressStar}>
          {starredPoll.includes(poll.id) ? (
            <FIcon name="star" size={21} color="red" />
          ) : (
            <Icon name="star" size={20} color="red" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 1,
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  nameBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 50,
    marginRight: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  questionBox: {
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  question: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '600',
  },
  choiceBox: {
    marginBottom: 15,
  },
  footer: {
    marginHorizontal: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default React.memo(PollItem);