import PushNotification from "react-native-push-notification";

export default class NotificationReceiver {

	constructor(onRegister, onNotification) {
		this.configure(onRegister, onNotification);
		this.lastId = 0;
	}

	// eslint-disable-next-line no-unused-vars
	configure(onRegister, onNotification, gcm = "") {
		PushNotification.configure({
			// (optional) Called when Token is generated (iOS and Android)
			onRegister: onRegister, //this._onRegister.bind(this),

			// (required) Called when a remote or local notification is opened or received
			onNotification: onNotification, //this._onNotification,

			// ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
			senderID: "942118902588",

			// IOS ONLY (optional): default: all - Permissions to register.
			permissions: {
				alert: true,
				badge: true,
				sound: true
			},

			// Should the initial notification be popped automatically
			// default: true
			popInitialNotification: true,
			requestPermissions: true
		});
	}

	checkPermission(cbk) {
		return PushNotification.checkPermissions(cbk);
	}

	cancelNotif() {
		PushNotification.cancelLocalNotifications({id: ""+this.lastId});
	}

	cancelAll() {
		PushNotification.cancelAllLocalNotifications();
	}
}
