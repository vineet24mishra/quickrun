import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Text, TouchableWithoutFeedback, Keyboard, View, ScrollView, Image } from "react-native";
import { TextInputComponent } from "../../component/TextInputComponent";
import stringFile from "../../locale/StringEn";
import ColorConst from "../../styles/colors/ColorConst";
import { TextButton } from "../../component/TextButton";
import * as Font from "../../assets/fonts/Fonts";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import { Loader } from "../../component/Loader";
import { TextStyles } from "../../styles/componentStyle/TextStyles";
import SignUpDataStore from "../../store/SignUpDataStore";
import { TouchableOpacityDoubleClick, TextDoubleClick } from "../../component/PreventDoubleClick";
import ToastCollection from "../../utils/ToastCollection";
import {FirebaseManager} from "../../utils/FirebaseManager";
import AccessTokenStore from "../../store/AccessTokenStore";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      isLoading: false,
      signedUpData: {},
      countryDialCode: stringFile.DEFAULT_CODE,
      countryIsoCode : stringFile.DEFAULT_ISO_CODE
    };
  }

  componentDidMount() {
    SignUpDataStore.instance.retrieveSignUpDataModel().then((data) => {
      this.setState({ signedUpData: data });
    });
    // auth.verifyPhoneNumber();
  }

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
            <ScrollView keyboardShouldPersistTaps="handled" >
              <View style={styles.parentViewStyle}>
                <Text style={[TextStyles.textStyleHeading, styles.signInTextStyle]}>{stringFile.SIGNIN_SCREEN_HEADER_TITLE}</Text>

                <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.EMAIL_OR_MOBILE_NUMBER}</Text>

                <TextInputComponent additionalStyle={{ marginTop: 5, paddingLeft: 90, height: 50 }}
                  textChange={(text) => this.setState({ phone: text })}
                  keyType="done"
                  keyboardType={"phone-pad"}
                />
                <TouchableOpacityDoubleClick style={styles.countryCodeSelectionView}
                  onPress={() => { this.onCountryCodeSelection(); }}>
                  <Text style={[TextStyles.textStyleDefault, styles.countryCodeTextStyle, { marginEnd: 0, marginStart: 10 }]}>
                    {this.state.countryDialCode ? this.state.countryDialCode
                      : stringFile.DEFAULT_CODE}</Text>
                  <Image
                    style={[styles.addressBoxRightIconStyle, { transform: [{ rotate: "90deg" }] }]}
                    source={require("../../assets/icons/next.png")} resizeMode={"contain"} />
                </TouchableOpacityDoubleClick>

                <Text style={[TextStyles.textStyleDefault, styles.dontHaveAccountStyle]}>
                  {stringFile.DO_NOT_HAVE_ACCOUNT}
                  <TextDoubleClick
                    onPress={() => { this.onSignupClick(); }}
                    style={{ color: ColorConst.THEME_COLOR_BLUE, ...Font.FONT_SEMIBOLD }}>
                    {stringFile.SIGN_UP}
                  </TextDoubleClick>
                </Text>
                <TextButton
                  additionalStyle={{ marginBottom: 30 }}
                  buttonTitle={stringFile.SIGNIN_SCREEN_HEADER_TITLE}
                  onButtonPress={() => { this.onLoginButtonPress(); }} />
              </View>
            </ScrollView>

          </TouchableWithoutFeedback>
          {this.state.isLoading ? (
            <Loader isLoading={true} />
          ) : null}
        </SafeAreaView>
      </>
    );
  }

  onCountryCodeSelection = () => {
    this.props.navigation.navigate("CountryPicker", { pickCountryCode: this.pickCountryCode });
  }

  pickCountryCode = (selectCountry) => {
    this.setState({
      countryCode: selectCountry.name + selectCountry.code,
      countryDialCode: selectCountry.code,
      countryIsoCode : selectCountry.isoCode
    });
  }

  onSignupClick = () => {
    if (!this.state.signedUpData) {
      this.props.navigation.navigate("Signup");
    } else {
      AccessTokenStore.instance.setBackHandler(false);
      this.props.navigation.navigate("TestClass", { isComeFromForgot: false, phoneNumber: this.state.signedUpData.phone, countryCode: this.state.signedUpData.countryCode, dialCode : this.state.signedUpData.dialCode });
    }
  }

  onLoginButtonPress = () => {
    Keyboard.dismiss();
    if (!this.state.phone) {
      ToastCollection.toastShowAtBottom(stringFile.EMPTY_EMAIL_OR_PHONE_NUMBER);
      return;
    }
    this.loginUser();
  }

  loginUser = () => {
    const body = JSON.stringify({
      phone: this.state.phone,
      countryCode: this.state.countryIsoCode,
      dialCode : this.state.countryDialCode
    });
    this.setState({ isLoading: true });
    ApiRequest.postMethodApiCall(Server.SEND_USER_OTP, body, (response, error) => {
      if (response) {
        // this.setState({ isLoading: false });
        console.log("response ---->>>", response);
        if (response.success) {
          // this.props.navigation.navigate("MobileVerification", { isComeFromLogin: true, countryCode: this.state.countryIsoCode, phoneNumber: this.state.phone, isPhoneVerified: response.isPhoneVerified, dialCode : this.state.countryDialCode });
          FirebaseManager.signInWithPhoneNumber(
            this.state.countryDialCode + this.state.phone,
            (confirmation) => {
              console.log("confirmation --->>>>", confirmation);
              this.setState({ isLoading: false });
              if(confirmation){
                AccessTokenStore.instance.setBackHandler(false);
                this.props.navigation.navigate("TestClass", { isComeFromLogin: true, countryCode: this.state.countryIsoCode, phoneNumber: this.state.phone, isPhoneVerified: response.isPhoneVerified, dialCode : this.state.countryDialCode, confirm : confirmation  });
              } else {
                ToastCollection.toastShowAtBottom("Something went wrong, Please try again later.");
              }
              // this.props.navigation.navigate("MobileVerification", { countryCode: this.state.countryDialCode, phoneNumber: this.state.mobile, countryISOCode : this.state.countryISOCode, confirm : confirmation });
              // setConfirm(confirmation);
            },
            (error) => {
              this.setState({ isLoading: false });
              console.log("error ----->>>", error);
              ToastCollection.toastShowAtBottom("It seems you are not able to get OTP, Please try again later.");
            }
          );
        } else {
          this.setState({ isLoading: false });
          ToastCollection.toastShowAtBottom(response.error);
        }
      } else {
        this.setState({ isLoading: false });
        ToastCollection.toastShowAtBottom(error);
      }
    });
  }
}

const styles = StyleSheet.create({
  parentViewStyle: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 100
  },
  signInTextStyle: {
    color: ColorConst.THEME_COLOR_BLUE,
    marginLeft: 15,
    ...Font.FONT_BOLD
  },
  textStyle: {
    marginTop: 20,
    marginLeft: 15,
    color: ColorConst.THEME_COLOR_BLACK
  },
  dontHaveAccountStyle: {
    marginVertical: 30,
    textAlign: "center",
    marginTop: 30
  },
  addressBoxRightIconStyle: {
    marginStart: 5,
    alignSelf: "center",
    marginEnd: 10,
    height: 15,
    width: 15
  },
  countryCodeTextStyle: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 5,
    color: ColorConst.THEME_COLOR_BLACK
  },
  countryCodeSelectionView: {
    height: 35,
    bottom: 40,
    borderRightWidth: 0.3,
    flexDirection: "row",
    width: 80,
    alignItems: "center"
  }
});
