import React, {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Navigation from './navigation/navigation';
import {FirebaseProvider} from './context/firebaseContext';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import navigationService from './navigation/navigation-service';

const App = () => {
  const colorScheme = useColorScheme();

  // listening for dynamic links in foreground
  useEffect(() => {
    const sub = dynamicLinks().onLink(link => {
      if (link === null) return;
      const id = link.url.split('=').pop();
      setTimeout(() => {
        navigationService.navigate('VotePoll', {id});
      }, 1500);
    });
    return () => sub();
  }, []);

  // listening for dynamic links in background
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link === null) return;
        const id = link.url.split('=').pop();
        setTimeout(() => {
          navigationService.navigate('VotePoll', {id});
        }, 1500);
      });
  }, []);

  return (
    <FirebaseProvider>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    </FirebaseProvider>
  );
};

export default App;
