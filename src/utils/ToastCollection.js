import Toast from "react-native-simple-toast";
import { ToastStyleStandard } from "../styles/componentStyle/ToastStyle";


export default class ToastCollection  {
  
    static toastShowAtTop = (toastMessage) => {
        Toast.show(toastMessage, Toast.SHORT, Toast.TOP, ToastStyleStandard);
    }

    static toastShowAtCenter = (toastMessage) => {
        Toast.show(toastMessage, Toast.SHORT, Toast.CENTER, ToastStyleStandard);
    }

    static toastShowAtBottom = (toastMessage) => {
        Toast.show(toastMessage, Toast.SHORT, Toast.BOTTOM, ToastStyleStandard);
    }

}
