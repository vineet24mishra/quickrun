import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";

export default class UserModel {
  static instance = UserModel.instance || new UserModel();

  persistUserModel = async(userModel) => {
    try {
      await AsyncStorage.setItem(Constants.USER_MODEL, JSON.stringify(userModel));
    } catch (error) {
      // Error saving data
    }
  }


  getUserModel = async() => {
    try {
      const value = await AsyncStorage.getItem(Constants.USER_MODEL);
      const userModel = JSON.parse(value);
      if (value !== null) {
        return userModel;
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  deleteUserModel = async() => {
    try {
      await AsyncStorage.removeItem(Constants.USER_MODEL);
      return true;
    }
    catch (exception) {
      return false;
    }
  }
}
