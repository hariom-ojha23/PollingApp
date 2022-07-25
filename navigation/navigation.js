import React, {useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';

import SignIn from '../screen/auth/sign-in';
import VerifyOtp from '../screen/auth/verify-otp';
import Home from '../screen/main/home';
import Profile from '../screen/main/profile';

const Navigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const sub = auth().onAuthStateChanged(onAuthStateChanged);
    return sub;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={RootNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const BottomNavigator = () => {
  return (
    <Bottom.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarStyle: {
          position: 'absolute',
          height: 55,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
          bottom: 6,
        },
      }}>
      <Bottom.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => <Icon name="home" size={20} color={color} />,
          headerShown: false,
        }}
      />
      <Bottom.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({color}) => (
            <Icon name="user-alt" size={18} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Bottom.Navigator>
  );
};

export default Navigation;
