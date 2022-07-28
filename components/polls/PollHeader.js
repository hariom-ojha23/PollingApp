import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import moment from 'moment';

const PollHeader = ({createdAt, colorText, colorGray}) => {
  return (
    <View style={styles.header}>
      <View style={styles.nameBox}>
        <Image
          style={styles.avatar}
          source={{
            uri: 'https://reactnative.dev/img/tiny_logo.png',
          }}
        />
        <Text style={[styles.name, colorText]}>Hari om Ojha</Text>
      </View>

      <Text style={[styles.timestamp, colorGray]}>
        {moment(createdAt.seconds * 1000).format('DD MMM yyy')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
  timestamp: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PollHeader;
