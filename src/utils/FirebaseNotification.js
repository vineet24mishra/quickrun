import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";
import AccessTokenStore from "../store/AccessTokenStore";
import Constants from "./Constants";
import { store } from "../redux/store/Store";
import { isNewMessageAvailable, acceptedBookignAction } from "../redux/actions/Action";
import BookingDetailsStore from "../store/BookingDetailsStore";

export async function checkApplicationPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log("User has notification permissions enabled.");
  } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log("User has provisional notification permissions.");
  } else {
    console.log("User has notification permissions disabled");
  }

  return authorizationStatus;
}

export function getDeviceToken() {
  messaging()
    .getToken()
    .then(token => {
      console.log("getToken ---->>>", token);
      AsyncStorage.setItem(Constants.DEVICE_TOKEN, token);
      AccessTokenStore.instance.setDeviceToken(token);
    });

  // Listen to whether the token changes
  return messaging().onTokenRefresh(token => {
    console.log("onTokenRefresh ---->>>", token);

  });
}

export function notificationReceivedWhenActiveApp(navProps) {
  messaging().onMessage(async remoteMessage => {
    console.log("Active App Notification Received onMessage ---->>", remoteMessage, navProps);
    const data = remoteMessage && remoteMessage.data && remoteMessage.data.data && JSON.parse(remoteMessage.data.data);
    if (remoteMessage.data.type == Constants.MESSAGE_TYPE_NOTIFICATION) {
      storeNotificationDetails(data, null);
    } else {
      storeNotificationDetails(data, navProps);
    }
  });
}

export function notificationReceivedWhenAppIsInBackground(navProps) {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Message handled in the background! ------->>>>>", remoteMessage );
    const data = remoteMessage && remoteMessage.data && remoteMessage.data.data && JSON.parse(remoteMessage.data.data);
    // const type = remoteMessage && remoteMessage.data && remoteMessage.data.type;
    storeNotificationDetails(data, navProps);
    if (remoteMessage.data.type == Constants.MESSAGE_TYPE_NOTIFICATION) {
      const isChatScreen = AccessTokenStore.instance.getCurrentScreen();
      store.dispatch(isNewMessageAvailable(isChatScreen ? false : true));
    }
  });
}

export function notificationWhenIosAppInBg() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log("When ios app in background ----", remoteMessage);
    const data = remoteMessage.data && JSON.parse(remoteMessage.data.data);
    storeNotificationDetails(data, null);
  });
}

export function notificationWhenBgTapOnNotification() {
  messaging().getInitialNotification().then(remoteMessage => {
    console.log("notificationWhenBgTapOnNotification ------>", remoteMessage);
    const data = remoteMessage && remoteMessage.data && remoteMessage.data.data && JSON.parse(remoteMessage.data.data);
    storeNotificationDetails(data, null);
  });
}

function storeNotificationDetails(notification, navProps, type) {
  console.log("notification----->>>>", notification);
  if (notification) {
      if (notification.status == Constants.BOOKING_STATUS_COMPLETED) {
        BookingDetailsStore.instance.setIsBookingCompleted(true);
        BookingDetailsStore.instance.setCurrentBookingId(notification.bookingId);
      }
      store.dispatch(acceptedBookignAction(notification));
    if (navProps) {
      setTimeout(() => {
        navProps.navigation.navigate("HomeScreen");
      }, 100);
    }
  }
}
