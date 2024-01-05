/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';

async function onMessageReceived(message) {
  if (message.data.type == 'order-delivered') {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'order-delivered',
      name: 'order-delivered',
    });
    await notifee.displayNotification({
      title: 'Your order has been delivered',
      body: 'Your order was delivered at' + ' ' + message.data.timestamp,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  } else if (message.data.type == 'order-cancelled') {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'order-cancelled',
      name: 'order-cancelled',
    });
    await notifee.displayNotification({
      title: 'Your order has been cancelled',
      body:
        'Your order was cancelled at' +
        ' ' +
        message.data.timestamp +
        '. See reasons why',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}

// function to show background message notification if the app state is killed
async function onBgMessageReceived(message) {
  if (message.data.type == 'order-delivered') {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'orders',
      name: 'order-delivered',
    });
    await notifee.displayNotification({
      title: 'Your order has been delivered',
      body: 'Your order was delivered at' + ' ' + message.data.timestamp,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  } else if (message.data.type == 'order-cancelled') {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'orders',
      name: 'order-cancelled',
    });
    await notifee.displayNotification({
      title: 'Your order has been cancelled',
      body:
        'Your order was cancelled at' +
        ' ' +
        message.data.timestamp +
        '. See reasons why',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}
messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onBgMessageReceived);

AppRegistry.registerComponent(appName, () => App);
