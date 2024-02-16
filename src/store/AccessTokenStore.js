import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";

export default class AccessTokenStore {
  static instance = AccessTokenStore.instance || new AccessTokenStore();
  accessToken = "";
  deviceToken = "";
  isChatScreen = false;
  isBackHandler = false;

  saveAccessToken = async (token) => {
    try {
      await AsyncStorage.setItem(Constants.SAVE_ACCESS_TOKEN, token);
    } catch (error) {
      // Error saving data
    }
  }

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem(Constants.SAVE_ACCESS_TOKEN);
      return value;

    } catch (error) {
      // Error retrieving data
    }
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  setDeviceToken(token) {
    this.deviceToken = token;
  }

  setCurrentScreen(isChatScreen) {
    this.isChatScreen = isChatScreen;
  }

  setBackHandler(backHandle) {
    this.isBackHandler = backHandle
  }

  getAccessToken() {
    return this.accessToken;
  }

  getDeviceToken() {
    return this.deviceToken;
  }

  getCurrentScreen() {
    return this.isChatScreen;
  }

  getBackHandler() {
    return this.isBackHandler;
  }

  deleteToken = async () => {
    try {
      await AsyncStorage.removeItem(Constants.SAVE_ACCESS_TOKEN);
      return true;
    }
    catch (exception) {
      return false;
    }
  }
}
