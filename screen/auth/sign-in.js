import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';

import Colors from '../../constants/Colors';
import OutlinedInput from '../../components/auth/OutlinedInput';

const SignIn = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const colorScheme = useColorScheme();

  const validPhoneNumber = str => {
    if (str.length < 10 || str.length > 10) {
      return false;
    }

    return /^[0-9]+$/.test(str);
  };

  const onPress = () => {
    if (!validPhoneNumber(phoneNumber)) {
      console.log('Invalid Phone Number');
      return;
    }

    navigation.navigate('VerifyOtp', {phoneNumber});
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: Colors[colorScheme].background},
      ]}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>Phone Verification</Text>
        <Text style={[styles.subtitle, {color: Colors[colorScheme].gray}]}>
          We need to register your phone number before getting started !
        </Text>
      </View>
      <View style={styles.form}>
        <OutlinedInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          icon="phone-alt"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>Send the Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    marginBottom: 40,
    paddingHorizontal: 25,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    paddingHorizontal: 25,
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

export default SignIn;
