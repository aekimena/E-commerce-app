import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from './components/Main';
import Cart from './components/Cart';
import ProductDisplay from './components/ProductDisplay';
import ProductContextProvider from './context/ProductContextProvider';
import Favourites from './components/Favourites';
import Home from './components/mainScreens/Home';
const Stack = createNativeStackNavigator();
function App() {
  return (
    //

    <ProductContextProvider>
      {/* <GestureHandlerRootView> */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="main">
          <Stack.Screen
            name="main"
            component={Main}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProductDisplay"
            component={ProductDisplay}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="cart"
            component={Cart}
            options={{headerShown: false}}
          />
          {/* <Stack.Screen
            name="favourites"
            component={Favourites}
            options={{headerShown: false}}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
      {/* </GestureHandlerRootView> */}
    </ProductContextProvider>
  );
}

export default App;
