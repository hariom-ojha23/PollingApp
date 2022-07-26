import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Colors from '../../constants/Colors';
import OutlinedInput from '../../components/auth/OutlinedInput';
import CreatePollModal from '../../components/create-poll/CreatePollModal';
import PollChoiceItem from '../../components/create-poll/PollChoiceItem';

const privacyOption = [
  {
    label: 'Public',
  },
  {
    label: 'Private',
  },
];

const CreatePoll = () => {
  const colorScheme = useColorScheme();

  const [pollName, setPollName] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [choices, setChoices] = useState([]);
  const [privacy, setPrivacy] = useState(null);
  const [open, setOpen] = useState(false);

  const {currentUser} = auth();

  const createPoll = async () => {
    const body = {
      pollName,
      pollQuestion,
      privacy,
      choices,
      createdBy: currentUser.uid,
      createdAt: firestore.Timestamp.now(),
    };

    await firestore()
      .collection('polls')
      .add(body)
      .then(() => console.log('Poll Added'))
      .catch(er => console.log(er.message));

    setPollName('');
    setPollQuestion('');
    setChoices([]);
    setPrivacy(null);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: Colors[colorScheme].background},
      ]}>
      <ScrollView style={{padding: 25}}>
        <View style={styles.inputBox}>
          <OutlinedInput
            icon="info-circle"
            placeholder="Enter Poll Name"
            value={pollName}
            onChangeText={setPollName}
          />
        </View>

        <View style={styles.inputBox}>
          <OutlinedInput
            icon="question-circle"
            placeholder="Enter Poll Question"
            multiline={true}
            value={pollQuestion}
            onChangeText={setPollQuestion}
          />
        </View>

        <View style={styles.choiceBox}>
          <Text style={[styles.title, {color: Colors[colorScheme].text}]}>
            Choices
          </Text>

          <View style={styles.choices}>
            {choices.map((x, i) => (
              <PollChoiceItem
                key={x.id}
                choice={x}
                index={i}
                choices={choices}
                setChoices={setChoices}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.choiceBtn}
            onPress={() => setOpen(true)}>
            <Icon
              name="plus"
              size={16}
              color="#007bff"
              style={{marginRight: 10}}
            />
            <Text style={styles.choiceBtnText}>Add Choice</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.privacyBox}>
          <Text style={[styles.title, {color: Colors[colorScheme].text}]}>
            Privacy
          </Text>
          <RadioButtonRN
            data={privacyOption}
            selectedBtn={e => setPrivacy(e.label)}
            icon={<Icon name="check-circle" size={25} color="#2c9dd1" />}
            boxStyle={{
              backgroundColor: 'transparent',
            }}
            textStyle={{color: Colors[colorScheme].text}}
            animationTypes={['pulse']}
          />
        </View>

        <Pressable style={styles.btn} onPress={createPoll}>
          <Text style={styles.btnText}>Create Poll</Text>
        </Pressable>

        <CreatePollModal
          open={open}
          setOpen={setOpen}
          setChoices={setChoices}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  choiceBox: {
    marginBottom: 15,
  },
  choices: {
    marginBottom: 15,
  },
  choiceBtn: {
    width: '100%',
    marginVertical: 10,
    borderColor: '#007bff',
    borderWidth: 1.5,
    paddingVertical: 15,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceBtnText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  privacyBox: {
    marginBottom: 30,
  },
  btn: {
    width: '100%',
    marginVertical: 30,
    backgroundColor: '#007bff',
    paddingVertical: 17,
    borderRadius: 50,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CreatePoll;
