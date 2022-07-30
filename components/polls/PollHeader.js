import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

const PollHeader = ({createdAt, createdBy, colorText, colorGray}) => {
  const [userData, setUserData] = useState({
    displayName: '',
    photoURL:
      'https://firebasestorage.googleapis.com/v0/b/social-app-9923d.appspot.com/o/default.jpg?alt=media&token=25fb473c-f799-4270-8a29-6de3350660c2',
  });

  useEffect(() => {
    const getUserData = async () => {
      await firestore()
        .collection('users')
        .doc(createdBy)
        .get()
        .then(snapshot => {
          if (snapshot.exists) {
            setUserData(snapshot.data());
          }
        })
        .catch(er => console.log(er));
    };
    getUserData();
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.nameBox}>
        <Image
          style={styles.avatar}
          source={{
            uri: userData.photoURL,
          }}
        />
        <Text style={[styles.name, colorText]}>{userData.displayName}</Text>
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
