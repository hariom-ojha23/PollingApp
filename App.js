import React from 'react';
import {SafeAreaView, useColorScheme, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Navigation from './navigation/navigation';

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <Navigation colorScheme={colorScheme} />
    </SafeAreaProvider>
  );
};

export default App;
