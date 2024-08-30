import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import Stacks from './components/Stacks';
import { Provider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function App() {

  const [loaded, error] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      null
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Provider>
        <NavigationContainer>
          <Stacks />
          <Toast />
        </NavigationContainer>
      </Provider>
    </> 
  );
}

