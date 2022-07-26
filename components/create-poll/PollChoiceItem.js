import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../constants/Colors';

const PollChoiceItem = props => {
  const colorScheme = useColorScheme();

  const deleteChoice = () => {
    const arr = props.choices.filter(x => x.id !== props.choice.id);
    props.setChoices(arr);
  };

  return (
    <View style={styles.choiceItemContainer}>
      <View style={styles.choiceBox}>
        <Text style={[styles.index, {color: Colors[colorScheme].gray}]}>
          {props.index + 1}.
        </Text>
        <Text style={[styles.choice, {color: Colors[colorScheme].text}]}>
          {props.choice.choice}
        </Text>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={deleteChoice}>
        <Icon name="times-circle" color="red" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  choiceItemContainer: {
    paddingHorizontal: 20,
    position: 'relative',
    width: '100%',
    marginVertical: 10,
  },
  choiceBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '85%',
  },
  index: {
    fontSize: 17,
    marginRight: 15,
  },
  choice: {
    fontSize: 17,
  },
  deleteBtn: {
    position: 'absolute',
    right: 0,
    width: '10%',
  },
});

export default React.memo(PollChoiceItem);
