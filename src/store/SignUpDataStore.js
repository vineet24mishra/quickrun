import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";

export default class SignUpDataStore {
  static instance = SignUpDataStore.instance || new SignUpDataStore();

  persistSignUpData = async(signUpData) => {
    try {
      await AsyncStorage.setItem(Constants.PERSIST_SIGN_UP_DATA_MODEL, signUpData);
    } catch (error) {
      // Error saving data
    }
  }


  retrieveSignUpDataModel = async() => {
    try {
      const value = await AsyncStorage.getItem(Constants.PERSIST_SIGN_UP_DATA_MODEL);
      const signUpData = JSON.parse(value);
      if (signUpData !== null) {
        return signUpData;
      }
    } catch (error) {
      // Error retrieving data
    }
  }


  deleteSignUpStoredData = async() => {
    try {
      await AsyncStorage.removeItem(Constants.PERSIST_SIGN_UP_DATA_MODEL);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

}
