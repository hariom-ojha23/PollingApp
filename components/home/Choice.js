import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  Animated,
} from 'react-native';

import Colors from '../../constants/Colors';

const Choice = ({choice, bg, totalVote, onPress}) => {
  const colorScheme = useColorScheme();
  const colorText = {color: Colors[colorScheme].text};

  const [percent, setPercent] = useState(0);

  const barWidth = useRef(new Animated.Value(0)).current;
  const votePercent = barWidth.interpolate({
    inputRange: [0, totalVote],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    Animated.timing(barWidth, {
      duration: 1500,
      toValue: choice.voteCount,
      useNativeDriver: false,
    }).start();

    if (totalVote === 0) {
      setPercent(0);
    } else {
      const per = (choice.voteCount / totalVote) * 100;
      setPercent(per.toPrecision(3));
    }
  }, [choice]);

  return (
    <TouchableOpacity onPress={() => onPress(choice)} style={[styles.choice]}>
      <Animated.View
        style={[styles.progress, {backgroundColor: bg, width: votePercent}]}
      />
      <Text style={[styles.choiceText, colorText]}>{choice.choice}</Text>
      <Text style={[styles.choicePercent, colorText]}>{percent}%</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  choice: {
    borderColor: 'lightgray',
    borderWidth: 0.5,
    borderRadius: 50,
    marginVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
  },
  progress: {
    borderRadius: 50,
    opacity: 0.9,
    height: 38,
  },
  choiceText: {
    width: '85%',
    fontWeight: '600',
    position: 'absolute',
    left: 10,
  },
  choicePercent: {
    width: '15%',
    textAlign: 'center',
    fontWeight: '600',
    position: 'absolute',
    right: 10,
  },
});

export default React.memo(Choice);