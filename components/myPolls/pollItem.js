import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';

import Colors from '../../constants/Colors';
import PollHeader from '../polls/PollHeader';

const pollItem = ({poll, onPress}) => {
  const colorScheme = useColorScheme();
  const colorText = {color: Colors[colorScheme].text};
  const colorGray = {color: Colors[colorScheme].gray};

  return (
    <TouchableOpacity
      onPress={() => onPress(poll)}
      style={[styles.card, {backgroundColor: Colors[colorScheme].card}]}>
      <PollHeader
        createdAt={poll.createdAt}
        colorText={colorText}
        colorGray={colorGray}
        createdBy={poll.createdBy}
      />

      <View style={styles.questionBox}>
        <Text style={[styles.name, colorGray]}>{poll.pollName}</Text>
        <Text style={[styles.question, colorText]}>{poll.pollQuestion}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={[colorGray, {fontWeight: '600'}]}>
          Total Votes: {poll.voters.length}
        </Text>
      </View>
    </TouchableOpacity>
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

export default pollItem;
