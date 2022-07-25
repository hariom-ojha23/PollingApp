import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, useColorScheme, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';

import Colors from '../../constants/Colors';
import OutlinedInput from '../../components/auth/OutlinedInput';

const VerifyOtp = props => {
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState('');

  const colorScheme = useColorScheme();
  const {phoneNumber} = props.route.params;

  useEffect(() => {
    const number = `+91${phoneNumber}`;
    signInWithPhoneNumber(number);
  }, []);

  const signInWithPhoneNumber = async number => {
    const confirmation = await auth().signInWithPhoneNumber(number);
    setConfirm(confirmation);
  };

  const confirmCode = async () => {
    try {
      await confirm.confirm(otp);
    } catch (error) {
      console.log('Invalid Code');
      console.log(error.message);
    }
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
          We have send you 6 digit code at number
        </Text>
        <Text
          style={[
            styles.subtitle,
            {fontWeight: '600', color: Colors[colorScheme].gray},
          ]}>{`+91 ${phoneNumber}`}</Text>
      </View>
      <View style={styles.form}>
        <OutlinedInput
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChangeText={setOtp}
          icon="lock"
          keyboardType="numeric"
        />

        <Pressable style={styles.btn} onPress={confirmCode}>
          <Text style={styles.btnText}>Verify Phone Number</Text>
        </Pressable>
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
    lineHeight: 20,
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

export default VerifyOtp;
