import React from 'react';
import {SafeAreaView, useColorScheme, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Navigation from './navigation/navigation';
import {FirebaseProvider} from './context/firebaseContext';

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <FirebaseProvider>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    </FirebaseProvider>
  );
};

export default App;
