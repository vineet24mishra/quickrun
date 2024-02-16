/**
 * @format
 */
import * as React from "react";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import {
    checkApplicationPermission, getDeviceToken,
    notificationReceivedWhenAppIsInBackground,
    notificationWhenBgTapOnNotification,
    notificationWhenIosAppInBg
} from "./src/utils/FirebaseNotification";
import BookingDetailsStore from "./src/store/BookingDetailsStore";

initializeNotificationsEvents();

export function initializeNotificationsEvents() {
    checkApplicationPermission();
    getDeviceToken();
    notificationReceivedWhenAppIsInBackground();
    notificationWhenBgTapOnNotification();
    notificationWhenIosAppInBg();
}

function headlessCheck({ isHeadless }) {
    if (isHeadless) {
        console.log("isHeadless -------->>>", isHeadless);
        return null;
    }
    BookingDetailsStore.instance.retrieveCurrentBookingDetail().then((data) => {
        if (data) { 
         BookingDetailsStore.instance.setIsBookingAvaiable(true)
        }
      });
    return <App />;
}
AppRegistry.registerComponent(appName, () => headlessCheck);
