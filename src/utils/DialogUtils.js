import { Alert } from "react-native";

export default class DialogUtils {
  static oneButtonInfoDialog = (dialogTitle, dailogMessage, buttonTitle) => {
    Alert.alert(
      dialogTitle,
      dailogMessage,
      [
        { text: buttonTitle, onPress: () => console.log("Cancel Pressed"), style: "cancel" }
      ],
      { cancelable: false }
    );
  }

  static twoButtonInfoDialog = (dialogTitle, dailogMessage, buttonTitleOne, buttonTitleTwo, callback) => {
    Alert.alert(
      dialogTitle,
      dailogMessage,
      [
        { text: buttonTitleOne, onPress: () => { callback(false); }, style: "cancel" },
        { text: buttonTitleTwo, onPress: () => { callback(true); } }
      ],
      { cancelable: false }
    );
  }
}
