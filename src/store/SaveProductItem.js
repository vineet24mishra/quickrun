import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";

export default class SaveProductItemList {
  static instance = SaveProductItemList.instance || new SaveProductItemList();

  persistProductList = async(itemsList) => {
    try {
      await AsyncStorage.setItem(Constants.PRODUCT_ITEM_LIST, JSON.stringify(itemsList));
    } catch (error) {
      // Error saving data
    }
  }

  getProductList = async() => {
    try {
      const value = await AsyncStorage.getItem(Constants.PRODUCT_ITEM_LIST);
      return JSON.parse(value);
    } catch (error) {
      // Error retrieving data
    }
  }

  deleteProductList = async() => {
    try {
      await AsyncStorage.removeItem(Constants.PRODUCT_ITEM_LIST);
      return true;
    }
    catch (exception) {
      return false;
    }
  }
  
}
