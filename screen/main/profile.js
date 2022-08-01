import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  useColorScheme,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

import Colors from '../../constants/Colors';
import OutlinedInput from '../../components/auth/OutlinedInput';
import {FirebaseContext} from '../../context/firebaseContext';

const Profile = () => {
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState(
    'https://firebasestorage.googleapis.com/v0/b/social-app-9923d.appspot.com/o/default.jpg?alt=media&token=25fb473c-f799-4270-8a29-6de3350660c2',
  );
  const [phoneNumber, setPhoneNumber] = useState('');

  const colorScheme = useColorScheme();
  const {user} = useContext(FirebaseContext);

  useEffect(() => {
    if (!!user) {
      setFullName(user.displayName);
      setPhoto(user.photoURL);
      setPhoneNumber(user.phoneNumber);
    }
  }, [user]);

  const selectPhoto = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      maxWidth: 2000,
      maxHeight: 2000,
    };

    await launchImageLibrary(options, response => {
      if (response.errorMessage) {
        ToastAndroid.show(response.errorMessage, ToastAndroid.SHORT);
      } else if (response.assets) {
        const file = response.assets[0];
        setPhoto(file.uri);
      }
    });
  };

  const uploadAndGetUrl = async () => {
    return new Promise(resolve => {
      const ref = storage().ref(user.uid);
      const task = ref.putFile(photo);

      task.on('state_changed', snap => {
        ToastAndroid.show(
          `${snap.bytesTransferred} transferred out of ${snap.totalBytes}`,
          ToastAndroid.SHORT,
        );
      });

      task.then(async () => {
        const downloadUrl = await ref.getDownloadURL();
        resolve(downloadUrl);
      });
    });
  };

  const updateProfile = async () => {
    if (photo !== user.photoURL) {
      await uploadAndGetUrl().then(async url => {
        await auth()
          .currentUser.updateProfile({photoURL: url})
          .then(() => ToastAndroid.show('Profile Updated', ToastAndroid.SHORT))
          .catch(er => console.log(er));
      });
    }

    if (fullName !== user.displayName) {
      await auth()
        .currentUser.updateProfile({displayName: fullName})
        .then(() => ToastAndroid.show('Full Name Updated', ToastAndroid.SHORT))
        .catch(er => console.log(er));
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: Colors[colorScheme].background},
      ]}>
      <ScrollView style={{padding: 15}}>
        <View style={styles.avatarContainer}>
          <View style={{position: 'relative'}}>
            <Image source={{uri: photo}} style={styles.avatar} />
            <TouchableOpacity
              onPress={selectPhoto}
              style={[
                styles.iconContainer,
                {backgroundColor: Colors[colorScheme].card},
              ]}>
              <Icon
                style={styles.icon}
                name="camera"
                size={19}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.input}>
            <OutlinedInput
              icon="user-alt"
              placeholder="Enter Your Name"
              value={`${fullName}`}
              onChangeText={setFullName}
            />
          </View>
          <View style={styles.input}>
            <OutlinedInput
              icon="phone-alt"
              value={`${phoneNumber}`}
              editable={false}
            />
          </View>
        </View>

        <TouchableOpacity onPress={updateProfile} style={styles.btn}>
          <Text style={styles.btnText}>Save Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 60,
  },
  avatarBox: {
    padding: 10,
    borderRadius: 150,
    overflow: 'hidden',
    width: 180,
    height: 180,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 150,
  },
  iconContainer: {
    position: 'absolute',
    padding: 8,
    borderRadius: 50,
    elevation: 10,
    bottom: 0,
    right: 15,
  },
  input: {
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#007bff',
    padding: 12,
    width: '100%',
    borderRadius: 50,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});

export default Profile;
