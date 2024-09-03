import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import MyStacks from './components/MyStacks';
import { Provider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { SafeAreaView, AppRegistry } from 'react-native';
import {Provider as ReduxProvider} from 'react-redux'
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {

  const [loaded, error] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf')
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
    
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <SafeAreaView style={{flex: 1}}>
          <Provider>
            <NavigationContainer>
              <MyStacks>
                <Toast />
              </MyStacks>
            </NavigationContainer>
          </Provider>
      </SafeAreaView> 
      </PersistGate>
    </ReduxProvider>
    
  );
}

