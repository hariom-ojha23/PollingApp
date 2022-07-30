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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {FirebaseContext} from '../../context/firebaseContext';

import Colors from '../../constants/Colors';
import OutlinedInput from '../../components/auth/OutlinedInput';

const CompleteProfile = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [photo, setPhoto] = useState(
    'https://firebasestorage.googleapis.com/v0/b/social-app-9923d.appspot.com/o/default.jpg?alt=media&token=25fb473c-f799-4270-8a29-6de3350660c2',
  );
  const [photoChanged, setPhotoChanged] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const colorScheme = useColorScheme();
  const {user, setUser} = useContext(FirebaseContext);

  useEffect(() => {
    if (!!user) {
      setPhoneNumber(user.phoneNumber);
    }
  }, []);

  const selectPhoto = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      maxWidth: 2000,
      maxHeight: 2000,
    };

    await launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User canceled image Picker');
      } else if (response.errorMessage) {
        console.log(response.errorMessage);
      } else if (response.assets) {
        const file = response.assets[0];
        setPhoto(file.uri);
        setPhotoChanged(true);
      }
    });
  };

  const uploadAndGetUrl = async () => {
    return new Promise(resolve => {
      if (photo.startsWith('http')) {
        resolve(photo);
        return;
      }

      const ref = storage().ref(user.uid);
      const task = ref.putFile(photo);

      task.on('state_changed', snap => {
        console.log(
          `${snap.bytesTransferred} transferred out of ${snap.totalBytes}`,
        );
      });

      task.then(async () => {
        const downloadUrl = await ref.getDownloadURL();
        console.log('Image Uploaded Successfully', downloadUrl);
        resolve(downloadUrl);
      });
    });
  };

  const completeProfile = async () => {
    await uploadAndGetUrl().then(async url => {
      const userData = {
        displayName: fullName,
        phoneNumber: `+91${phoneNumber}`,
        photoURL: url,
      };

      await firestore()
        .collection('users')
        .doc(user.uid)
        .set(userData)
        .catch(er => console.log(er));

      await auth()
        .currentUser.updateProfile({
          displayName: fullName,
          photoURL: url,
        })
        .then(res => {
          console.log(res);
          setUser(auth().currentUser);
          console.log('Profile Updated');
        })
        .catch(er => console.log(er));
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: Colors[colorScheme].background},
      ]}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 60}}
        style={{padding: 15}}>
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
              placeholder="Enter Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View style={styles.input}>
            <OutlinedInput
              icon="phone-alt"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={false}
            />
          </View>
        </View>

        <TouchableOpacity onPress={completeProfile} style={styles.btn}>
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
    marginTop: 60,
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
    padding: 15,
    width: '100%',
    borderRadius: 50,
    marginBottom: 30,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});

export default CompleteProfile;
