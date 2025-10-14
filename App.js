import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationProvider } from './src/context/NavigationContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/Services/storageService';

const App = () => {

  useEffect(() => {
    initDB ();
  }, []);

  return (
    <AuthProvider>
      <NavigationProvider>
        {/* <NavigationContainer> */}
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <AppNavigator />
        {/* </NavigationContainer> */}
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;