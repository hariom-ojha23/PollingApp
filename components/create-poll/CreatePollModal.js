import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
  useColorScheme,
} from 'react-native';
import Colors from '../../constants/Colors';
import uuid from 'react-native-uuid';

const CreatePollModal = props => {
  const [choice, setChoice] = useState('');
  const colorScheme = useColorScheme();

  const addChoice = val => {
    if (val.length === 0) {
      console.log('Invalid Data');
      return;
    }

    const data = {
      id: uuid.v4(),
      choice: choice,
    };

    props.setChoices(choices => [...choices, data]);
    setChoice('');
    props.setOpen(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={props.open}
      transparent={true}
      onRequestClose={() => props.setOpen(false)}>
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {backgroundColor: Colors[colorScheme].card},
          ]}>
          <Text style={[styles.title, {color: Colors[colorScheme].text}]}>
            Choice
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Choice"
            multiline={true}
            value={choice}
            onChangeText={setChoice}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => addChoice(choice)}>
            <Text style={styles.textStyle}>Add Choice</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '87%',
    borderRadius: 10,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#007bff',
    borderRadius: 50,
    width: '95%',
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    paddingVertical: 12,
    elevation: 2,
    width: '100%',
  },
  buttonClose: {
    backgroundColor: '#007bff',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default React.memo(CreatePollModal);
