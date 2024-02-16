import React, { Component } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, Image, Keyboard } from "react-native";
import ColorConst from "../../styles/colors/ColorConst";
import stringFile from "../../locale/StringEn";
import { TextInputComponent } from "../../component/TextInputComponent";
import { TextButton } from "../../component/TextButton";
import * as Font from "../../assets/fonts/Fonts";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import Constants from "../../utils/Constants";
import { Loader } from "../../component/Loader";
import { TextStyles } from "../../styles/componentStyle/TextStyles";
import AsyncStorage from "@react-native-community/async-storage";
import SignUpDataStore from "../../store/SignUpDataStore";
import { TouchableOpacityDoubleClick, TextDoubleClick } from "../../component/PreventDoubleClick";
import ToastCollection from "../../utils/ToastCollection";
import { deviceOs } from "../../Context";
import {FirebaseManager} from "../../utils/FirebaseManager";
import AccessTokenStore from "../../store/AccessTokenStore";

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            promoCode: "",
            isLoading: false,
            countryCode: "",
            countryDialCode: stringFile.DEFAULT_CODE,
            deviceToken: "",
            keyboardSpace: 0,
            countryIsoCode: stringFile.DEFAULT_ISO_CODE,
            keyboardState: stringFile.KEYBOARD_CLOSED
        };
    }

    componentDidMount() {
        AsyncStorage.getItem(Constants.DEVICE_TOKEN).then((deviceToken) => {
            this.setState({ deviceToken: deviceToken });
        });
        if (deviceOs == Constants.PLATFORM_IOS) {
            this.keyboardDidShowListener = Keyboard.addListener("keyboardWillShow", this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardDidHide);
        } else {
            this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.keyboardDidHide);
        }

    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG }}>
                <View style={styles.parentViewStyle}>
                    <TouchableOpacityDoubleClick
                        onPress={() => { this.onSigninClick(); }}
                        style={styles.backButtonStyle}>
                        <Image style={{ height: 20, width: 20, alignSelf: "center" }}
                            source={require("../../assets/icons/arrow.png")} />

                    </TouchableOpacityDoubleClick>
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode={"interactive"}
                        contentInset={{ bottom: this.state.keyboardState == stringFile.KEYBOARD_OPENED ? 250 : 0 }}
                    >
                        <View style={styles.mainViewStyle}>
                            <Text style={[TextStyles.textStyleHeading, styles.signupTextStyle]}>{stringFile.SIGNUP_SCREEN_HEADER_TITLE}</Text>
                            <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.FIRST_NAME}</Text>

                            <TextInputComponent additionalStyle={{ marginTop: 5, height: 50 }}
                                textChange={(text) => this.setState({ firstName: text })}
                                keyboardType="default"
                                keyType={"next"}
                                onSubmitEditing={() => { this.lastNameTextInput.focus(); }} />

                            <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.LAST_NAME}</Text>
                            <TextInputComponent additionalStyle={{ marginTop: 5, height: 50 }}
                                refrence={input => this.lastNameTextInput = input}
                                textChange={(text) => this.setState({ lastName: text })}
                                keyboardType="default"
                                keyType={"next"}
                                onSubmitEditing={() => { this.phoneNumberTextInput.focus(); }} />

                            <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.PHONE_NO}</Text>
                            <TextInputComponent additionalStyle={{ marginTop: 5, paddingLeft: 90, height: 50 }}
                                refrence={input => this.phoneNumberTextInput = input}
                                textChange={(text) => this.setState({ phoneNumber: text })}
                                keyboardType="phone-pad"
                                keyType="next"
                                onSubmitEditing={() => { this.emailTextInput.focus(); }} />

                            <TouchableOpacityDoubleClick style={styles.countryCodeSelectionView}
                                onPress={() => { this.onCountryCodeSelection(); }}>
                                <Text style={[TextStyles.textStyleDefault, styles.addressStyle, { marginEnd: 0, marginStart: 10 }]}>
                                    {this.state.countryDialCode ? this.state.countryDialCode
                                        : stringFile.DEFAULT_CODE}</Text>
                                <Image
                                    style={[styles.addressBoxRightIconStyle, { transform: [{ rotate: "90deg" }] }]}
                                    source={require("../../assets/icons/next.png")} resizeMode={"contain"} />
                            </TouchableOpacityDoubleClick>

                            <Text style={[TextStyles.textStyleMedium, styles.textStyle, { marginTop: 0 }]}>{stringFile.EMAIL}</Text>
                            <TextInputComponent additionalStyle={{ marginTop: 5, height: 50 }}
                                refrence={input => this.emailTextInput = input}
                                textChange={(text) => this.setState({ email: text })}
                                keyboardType="email-address"
                                keyType="next"
                                onSubmitEditing={() => { this.promoCodeTextInput.focus(); }}
                            />

                            <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.ADD_PROMO}</Text>
                            <TextInputComponent additionalStyle={{ marginTop: 5, height: 50 }}
                                refrence={input => this.promoCodeTextInput = input}
                                textChange={(text) => this.setState({ promoCode: text })}
                                keyboardType="default"
                                keyType="done" />

                            <Text style={[TextStyles.textStyleDefault, styles.alreadyHaveAccountStyle]}>
                                {stringFile.ALREADY_HAVE_AN_ACCOUNT}
                                <TextDoubleClick
                                    onPress={() => { this.onSigninClick(); }}
                                    style={{
                                        color: ColorConst.THEME_COLOR_BLUE, ...Font.FONT_SEMIBOLD
                                    }}>
                                    {stringFile.SIGNIN_SCREEN_HEADER_TITLE}
                                </TextDoubleClick>

                            </Text>
                            <View style={{ marginBottom: 80 }}>
                                <TextButton
                                    buttonTitle={stringFile.SUBMIT}
                                    onButtonPress={() => { this.onSignButtonPress(); }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {this.state.isLoading ? (
                    <Loader isLoading={true} />
                ) : null}
            </SafeAreaView>
        );
    }

    keyboardDidShow = () => {
        this.setState({
            keyboardState: stringFile.KEYBOARD_OPENED
        });
    }

    keyboardDidHide = () => {
        this.setState({
            keyboardState:stringFile.KEYBOARD_CLOSED
        });
    }

    onCountryCodeSelection = () => {
        this.props.navigation.navigate("CountryPicker", { pickCountryCode: this.pickCountryCode });
    }

    pickCountryCode = (selectCountry) => {
        this.setState({
            countryCode: selectCountry.name + selectCountry.code,
            countryDialCode: selectCountry.code,
            countryIsoCode: selectCountry.isoCode
        });
    }

    onSigninClick = () => {
        this.props.navigation.goBack();
    }

    onSignButtonPress = () => {
        Keyboard.dismiss();
        if (!this.state.firstName) {
            ToastCollection.toastShowAtBottom(stringFile.EMPTY_FIRST_NAME);
            return;
        }
        if (!this.state.lastName) {
            ToastCollection.toastShowAtBottom(stringFile.EMPTY_LAST_NAME);
            return;
        }
        if (!this.state.countryDialCode) {
            ToastCollection.toastShowAtBottom(stringFile.EMPTY_COUNTRY);
            return;
        }
        if (!this.state.phoneNumber) {
            ToastCollection.toastShowAtBottom(stringFile.EMPTY_PHONE_NUMBER);
            return;
        }
        if (!this.state.phoneNumber.match(Constants.PHONE_NUMBER_REGEX)) {
            ToastCollection.toastShowAtBottom(stringFile.PHONE_NUMBER_NOT_START_WITH_ZERO);
            return;
        }
        if (!this.state.email) {
            ToastCollection.toastShowAtBottom(stringFile.EMPTY_EMAIL);
            return;
        }
        if (!this.state.email.match(Constants.EMAIL_REGEX)) {
            ToastCollection.toastShowAtBottom(stringFile.INVALID_EMAIL);
            return;
        }
        this.signUpUser();
    }

    signUpUser = () => {
        const { firstName, lastName, phoneNumber, email, promoCode, countryIsoCode, countryDialCode } = this.state;
        const body = JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            phone: phoneNumber,
            email: email,
            referralCode: promoCode,
            token: this.state.deviceToken,
            device: deviceOs,
            countryCode: countryIsoCode,
            dialCode: countryDialCode
        });
        this.setState({ isLoading: true });
        ApiRequest.postMethodApiCall(Server.SIGN_UP_URL_STEP_ONE, body, (response, error) => {
            if (response) {
                // this.setState({ isLoading: false });
                console.log("response --->>>", response);
                if (response.success) {
                    SignUpDataStore.instance.persistSignUpData(body);
                    // this.props.navigation.navigate("MobileVerification", { isComeFromLogin: false, phoneNumber: this.state.phoneNumber, dialCode: this.state.countryDialCode, isPhoneVerified: false, countryCode: this.state.countryIsoCode });
                    FirebaseManager.signInWithPhoneNumber(
                        countryDialCode +" " + phoneNumber,
                        (confirmation) => {
                          console.log("confirmation --->>>>", confirmation);
                          if(confirmation) {
                            AccessTokenStore.instance.setBackHandler(true);
                            this.props.navigation.navigate("TestClass", { isComeFromLogin: false, phoneNumber: this.state.phoneNumber, dialCode: this.state.countryDialCode, isPhoneVerified: false, countryCode: this.state.countryIsoCode, confirm : confirmation });
                          } else {
                              ToastCollection.toastShowAtBottom("Something went wrong, Please try again later");
                          }
                         // this.props.navigation.navigate("MobileVerification", { isComeFromLogin: false, phoneNumber: this.state.phoneNumber, dialCode: this.state.countryDialCode, isPhoneVerified: false, countryCode: this.state.countryIsoCode });
                          // setConfirm(confirmation);
                        },
                        (error) => {
                            ToastCollection.toastShowAtBottom("It seems you are not able to get OTP, Please try again later.");
                            console.log("error ----->>>", error);
                        }
                      );
                      this.setState({ isLoading: false });
                }
                else {
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
        flex: 1
    },
    backButtonStyle: {
        width: 30,
        height: 30,
        borderColor: ColorConst.THEME_COLOR_BLUE,
        borderRadius: 15,
        borderWidth: 2,
        justifyContent: "center",
        marginStart: 10,
        marginTop: 10
    },
    mainViewStyle: {
        flex: 1,
        paddingHorizontal: 50,
        marginBottom: 30
    },
    signupTextStyle: {
        marginTop: 30,
        color: ColorConst.THEME_COLOR_BLUE,
        marginLeft: 15,
        ...Font.FONT_BOLD
    },
    textStyle: {
        color: ColorConst.THEME_COLOR_BLACK,
        marginTop: 20,
        marginLeft: 15
    },
    alreadyHaveAccountStyle: {
        marginVertical: 30,
        textAlign: "center",
        marginTop: 50
    },
    addressTextStyle: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        minHeight: 40,
        marginEnd: 30,
        borderWidth: 1,
        marginTop: 30,
        borderColor: ColorConst.THEME_COLOR_GRAY,
        borderRadius: 20,
        shadowOpacity: 0.15
    },
    addressStyle: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 5,
        color: ColorConst.THEME_COLOR_BLACK

    },
    addressBoxRightIconStyle: {
        marginStart: 5,
        alignSelf: "center",
        marginEnd: 10,
        height: 15,
        width: 15
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
