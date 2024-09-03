import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import MyStacks from './components/MyStacks';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { SafeAreaView, AppRegistry, StatusBar } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  const [loaded, error] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      // You can add any necessary logic here
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
              barStyle="light-content" 
              backgroundColor="#FFFFFF"
              translucent={false} 
            />
            <PaperProvider>
              <NavigationContainer>
                <MyStacks />
              </NavigationContainer>
              <Toast />
            </PaperProvider>
          </SafeAreaView>
        </GestureHandlerRootView>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;

AppRegistry.registerComponent('main', () => App);
