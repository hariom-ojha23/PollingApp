import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Share,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

import Colors from '../../constants/Colors';
import Choice from '../../components/polls/Choice';
import Icon from 'react-native-vector-icons/Ionicons';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {FirebaseContext} from '../../context/firebaseContext';

const colorArr = ['#ee5186', '#66BB6A', '#49a3f1', '#FFA726'];

const PollDetail = props => {
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState({
    id: '',
    pollName: '',
    pollQuestion: '',
    createdBy: '',
    createdAt: {
      seconds: 0,
      milisecondes: 0,
    },
    voters: [],
  });

  const {id} = props.route.params;
  const {user} = useContext(FirebaseContext);

  const colorScheme = useColorScheme();
  const colorText = {color: Colors[colorScheme].text};
  const colorGray = {color: Colors[colorScheme].gray};

  useEffect(() => {
    const sub = firestore()
      .collection('polls')
      .doc(id)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.exists) {
          setPoll({
            ...querySnapshot.data(),
            id: querySnapshot.id,
          });
        }
      });

    return () => sub();
  }, []);

  useEffect(() => {
    const sub = firestore()
      .collection('polls')
      .doc(id)
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
        setLoading(false);
      });

    return () => sub();
  }, [poll]);

  const onPressChoice = async choice => {
    const document = await firestore().collection('polls').doc(id).get();

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
      .doc(id)
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
      .doc(id)
      .update({
        voters: firestore.FieldValue.arrayUnion(user.uid),
      })
      .then(() => console.log('Voter list updated'))
      .catch(er => console.log(er));
  };

  const onPressShare = async () => {
    const link = await dynamicLinks().buildLink({
      link: `https://matdaanapp.page.link/vote?poll=${id}`,
      domainUriPrefix: 'https://matdaanapp.page.link',
      android: {
        packageName: 'com.pollingapp',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.pollingapp',
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
    });

    try {
      await Share.share({
        title: `Polling App - ${poll.pollName}`,
        message: link,
        url: link,
      });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const deleteChoices = async () => {
    for (let choice of choices) {
      await firestore()
        .collection('polls')
        .doc(id)
        .collection('choices')
        .doc(choice.id)
        .delete()
        .catch(er => console.log(er));
    }
  };

  const onPressDelete = async () => {
    await deleteChoices();
    await firestore()
      .collection('polls')
      .doc(id)
      .delete()
      .then(() => {
        ToastAndroid.show('Poll Deleted Successfully', ToastAndroid.SHORT);
      })
      .catch(error => {
        console.log(error.message);
      });
    props.navigation.goBack();
  };

  if (loading) {
    return <ActivityIndicator size={30} style={{marginTop: 30}} />;
  }

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

      <View style={styles.btnBox}>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#007bff'}]}
          onPress={onPressShare}>
          <Icon name="share-social" size={20} color="white" />
          <Text style={styles.btnText}>Share Poll Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, {backgroundColor: 'red'}]}
          onPressOut={onPressDelete}>
          <Icon name="trash" size={20} color="white" />
          <Text style={styles.btnText}>Delete Poll</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 15,
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
  btnBox: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignSelf: 'center',
  },
  btn: {
    padding: 14,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
});

export default PollDetail;
