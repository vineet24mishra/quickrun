import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";

export default class ChatDetailStore {
    static instance = ChatDetailStore.instance || new ChatDetailStore();

    persistMessageDetails = async(messageDetails) => {
        this.storeDetails(Constants.CHAT_DETAIL_STORE_KEY, messageDetails);
    }

    storeMessageDetails = async(key, value) => {
        if (key == Constants.CHAT_DETAIL_STORE_KEY) {
            try {
                var bookingDetails = await AsyncStorage.setItem(key, JSON.stringify(value));
                return bookingDetails;
            } catch (error) { }
        }
    }

    retrieveMessageDetails = async() => {
        try {
            const value = await AsyncStorage.getItem(Constants.CHAT_DETAIL_STORE_KEY);
            const messageDetails = JSON.parse(value);
            console.log("MessageDetails---->", messageDetails);
            if (messageDetails !== null) {
                return messageDetails;
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    deleteMessageDetails = async() => {
        try {
            await AsyncStorage.removeItem(Constants.CHAT_DETAIL_STORE_KEY);
            return true;
        }
        catch (exception) {
            return false;
        }
    }

}
