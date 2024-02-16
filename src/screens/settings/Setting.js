import React from "react";
import { StyleSheet, SafeAreaView, FlatList, View } from "react-native";
import AccessTokenStore from "../../store/AccessTokenStore";
import UserModelStore from "../../store/UserModelStore";
import { AuthContext } from "../../Context";
import ColorConst from "../../styles/colors/ColorConst";
import stringFile from "../../locale/StringEn";
import BookingDetailsStore from "../../store/BookingDetailsStore";
import SaveProductItem from "../../store/SaveProductItem";
import { logoutAction } from "../../redux/actions/Action";
import { connect } from "react-redux";
import DialogUtils from "../../utils/DialogUtils";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import { SettingOptionsView } from "./SettingOptionsView";
import { TextButton } from "../../component/TextButton";
import {FirebaseManager} from "../../utils/FirebaseManager";

function Setting({ navigation }) {

  function renderItem({ item, index }) {
    return (
      <SettingOptionsView
        item={item}
        index={index}
        onPress={() => onListItemPress(index)}
      />
    );
  }

  function onListItemPress(index) {
    switch (index) {
      case 0:
        navigation.navigate("Profile");
        break;

      case 1:
        navigation.navigate("ServiceHistoryList");
        break;

      default:
        break;
    }

  }

  function onLogoutPress(context) {
    DialogUtils.twoButtonInfoDialog(stringFile.LOGOUT_TITLE, stringFile.LOGOUT_ALERT_MESSGAGE,
      stringFile.NO, stringFile.YES, (callBack) => {
        if (callBack) {
          FirebaseManager.signOut();
          removeTokenFromServer();
          deleteSavedDetails();
          logoutAction();
          context.signOut();
        }
      });
  }

  function deleteSavedDetails() {
    BookingDetailsStore.instance.setIsBookingCompleted(false);
    BookingDetailsStore.instance.setCurrentBookingId("");
    BookingDetailsStore.instance.deleteAllDetails();
    AccessTokenStore.instance.deleteToken();
    UserModelStore.instance.deleteUserModel();
    SaveProductItem.instance.deleteProductList();
  }

  function removeTokenFromServer() {
    ApiRequest.deleteMethodApiCall(Server.DELETE_TOKEN, () => { });
  }

  return (
    <AuthContext.Consumer>
      {
        context => {
          return (
            <SafeAreaView style={styles.parentViewStyle}>
              <View style={{ backgroundColor: ColorConst.THEME_COLOR_WHITE, height: 300, width: "80%", borderColor: ColorConst.THEME_COLOR_LIGHT_GRAY, borderWidth: 3, borderRadius: 20 }}>
                <FlatList
                  style={{ flex: 1 }}
                  data={stringFile.SETTING_SCREEN_OPTIONS}
                  keyExtractor={(index) => index}
                  renderItem={renderItem}
                  scrollEnabled={true}>
                </FlatList>

                <TextButton
                  additionalStyle={styles.logoutButtonAddStyle}
                  newTextStyle={{ fontSize: 14 }}
                  buttonTitle={stringFile.LOGOUT}
                  onButtonPress={() => { onLogoutPress(context); }} />
              </View>

            </SafeAreaView>
          );
        }
      }
    </AuthContext.Consumer>
  );
}


const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, { logoutAction })(Setting);

const styles = StyleSheet.create({
  parentViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG
  },
  logoutButtonAddStyle: {
    width: "45%",
    alignSelf: "center",
    marginBottom: 20
  }

});
