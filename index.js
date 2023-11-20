/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const WrappedApp = () => {
  return (
    // <GestureHandlerRootView>
    <App />
    // </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => WrappedApp);
