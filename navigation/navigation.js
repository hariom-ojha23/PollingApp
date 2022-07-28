import React, {useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

import SignIn from '../screen/auth/sign-in';
import VerifyOtp from '../screen/auth/verify-otp';
import Home from '../screen/main/home';
import MyPolls from '../screen/main/my-polls';
import StarredPolls from '../screen/main/starred-poll';
import Profile from '../screen/main/profile';
import CreatePoll from '../screen/main/create-poll';
import PollDetail from '../screen/main/poll-detail';
import VotePoll from '../screen/main/vote-poll';
import Colors from '../constants/Colors';

const Navigation = ({colorScheme}) => {
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
      <NavigationContainer
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
      <Stack.Screen
        name="CreatePoll"
        component={CreatePoll}
        options={{
          title: 'Create Poll',
        }}
      />
      <Stack.Screen
        name="PollDetail"
        component={PollDetail}
        options={{
          title: 'Poll Details',
        }}
      />
      <Stack.Screen
        name="VotePoll"
        component={VotePoll}
        options={{
          headerShown: false,
        }}
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
  const colorScheme = useColorScheme();
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
        }}
      />
      <Bottom.Screen
        name="MyPolls"
        component={MyPolls}
        options={{
          title: 'My Polls',
          tabBarIcon: ({color}) => <Icon name="poll" size={20} color={color} />,
        }}
      />
      <Bottom.Screen
        name="StarredPolls"
        component={StarredPolls}
        options={{
          title: 'Starred',
          tabBarIcon: ({color}) => (
            <FIcon name="star" size={23} color={color} />
          ),
          headerTitle: 'Starred Polls',
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
          headerRight: () => (
            <FIcon
              style={{marginRight: 20}}
              name="sign-out"
              size={24}
              color={Colors[colorScheme].text}
              onPress={() => auth().signOut()}
            />
          ),
        }}
      />
    </Bottom.Navigator>
  );
};

export default Navigation;
