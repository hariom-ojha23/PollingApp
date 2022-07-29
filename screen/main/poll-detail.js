import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

import Colors from '../../constants/Colors';
import Choice from '../../components/polls/Choice';
import Icon from 'react-native-vector-icons/Ionicons';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const colorArr = ['#ee5186', '#66BB6A', '#49a3f1', '#FFA726'];

const PollDetail = props => {
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const {poll} = props.route.params;

  const colorScheme = useColorScheme();
  const colorText = {color: Colors[colorScheme].text};
  const colorGray = {color: Colors[colorScheme].gray};

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
        setLoading(false);
      });

    return () => sub();
  }, [poll]);

  const onPressChoice = _ => {};

  const onPressShare = async () => {
    const link = await dynamicLinks().buildLink({
      link: `https://pollingapp/vote?poll=${poll.id}`,
      domainUriPrefix: 'https://pollingapp.page.link',
      android: {
        packageName: 'com.pollingapp',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.pollingapp',
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
    });

    // const link = `pollingapp://vote/${poll.id}`;
    console.log(link);
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

      <TouchableOpacity style={styles.btn} onPress={onPressShare}>
        <Icon name="share-social" size={20} color="white" />

        <Text style={styles.btnText}>Share Poll Link</Text>
      </TouchableOpacity>
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

export default PollDetail;
