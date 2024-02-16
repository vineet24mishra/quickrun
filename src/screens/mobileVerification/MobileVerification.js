import React, { Component } from "react";
import { StyleSheet, SafeAreaView, View, Text, Image, ScrollView, Keyboard, BackHandler } from "react-native";
import { TextButton } from "../../component/TextButton";
import ColorConst from "../../styles/colors/ColorConst";
import stringFile from "../../locale/StringEn";
import * as Font from "../../assets/fonts/Fonts";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import { Loader } from "../../component/Loader";
import AccessTokenStore from "../../store/AccessTokenStore";
import UserModelStore from "../../store/UserModelStore";
import { AuthContext } from "../../Context";
import { TextStyles } from "../../styles/componentStyle/TextStyles";
import BackgroundTimer from "react-native-background-timer";
import SignUpDataStore from "../../store/SignUpDataStore";
import { TouchableOpacityDoubleClick } from "../../component/PreventDoubleClick";
import ToastCollection from "../../utils/ToastCollection";


export default class MobileVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 30,
            otpCode: "",
            phoneNumber: this.props.route.params.phoneNumber || "",
            countryCode: this.props.route.params.countryCode || "",
            dialCode : this.props.route.params.dialCode || "",
            isComeFromLogin: this.props.route.params.isComeFromLogin,
            isLoading: false,
            isPhoneVerified: this.props.route.params.isPhoneVerified
        };
    }

    componentDidMount() {
        this.timeCountDown();
        this.state.isComeFromLogin ? null : BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    }

    componentDidUpdate() {
        if (this.state.timer == "01") {
            this.setState({ timer: "00" });
            clearInterval(this.interval);
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
        clearInterval(this.interval);
        BackgroundTimer.stopBackgroundTimer();
    }

    render() {
        return (
            <AuthContext.Consumer>
                {
                    context => {
                        return (
                            <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_WHITE }}>
                                <ScrollView style={{ flex: 1 }}
                                    keyboardShouldPersistTaps="handled"
                                    onPress={() => { Keyboard.dismiss(); }}>
                                    <View style={styles.parentViewStyle}>

                                        <View style={styles.mainViewStyle}>

                                            <View style={styles.mobileIconViewStyle}>
                                                <Image style={{ alignSelf: "center" }}
                                                    source={require("../../assets/icons/mobile.png")} />
                                            </View>

                                            <Text style={[TextStyles.textStyleLarge, styles.verifyMobileTextStyle]}>{stringFile.VERIFY_NUMBER}</Text>
                                            <Text style={[TextStyles.textStyleDefault, { color: ColorConst.THEME_COLOR_BLACK, textAlign: "center", marginTop: 20 }]}>
                                                {stringFile.VERIFICATION_CODE_SENT}</Text>
                                            <Text style={[TextStyles.textStyleLarge, { color: ColorConst.THEME_COLOR_BLACK, textAlign: "center" }]}>
                                                {this.state.dialCode}{" "}{this.state.phoneNumber}</Text>

                                            <OTPInputView
                                                style={styles.otpViewStyle}
                                                pinCount={4}
                                                code={this.state.otpCode}
                                                onCodeChanged={code => { this.setState({ otpCode: code }); }}
                                                autoFocusOnLoad
                                                codeInputFieldStyle={styles.underlineStyleBase}
                                                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                                onCodeFilled={(code => {
                                                    console.log(`Code is ${code}, you are good to go!`);
                                                })}
                                            />
                                            <View >
                                                <TextButton
                                                    buttonTitle={this.state.isComeFromLogin ? stringFile.SUBMIT : stringFile.VERIFY_CODE}
                                                    onButtonPress={() => { this.verifyCode(context); }} />
                                            </View>

                                            <View style={styles.reSendCodeStyle}>
                                                <TouchableOpacityDoubleClick>
                                                    {this.state.timer == 0 && <Text
                                                        onPress={() => { this.resendVerificationCode(); }}
                                                        style={{
                                                            color: ColorConst.THEME_COLOR_BLUE, ...Font.FONT_SEMIBOLD
                                                        }}>{stringFile.RESEND_CODE}</Text>}

                                                </TouchableOpacityDoubleClick>
                                                {this.state.timer > 0 && <Text style={{
                                                    color: ColorConst.THEME_COLOR_ACTIVE_TAB,
                                                    ...Font.FONT_SEMIBOLD
                                                }}> 00:{("0" + this.state.timer).slice(-2)}</Text>}

                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                                {this.state.isLoading ? (
                                    <Loader isLoading={true} />
                                ) : null}
                            </SafeAreaView>
                        );
                    }
                }
            </AuthContext.Consumer>
        );
    }
    handleBackButton() {
        return true;
    }

    timeCountDown = () => {
        BackgroundTimer.runBackgroundTimer(() => {
            if (this.state.timer == 0) {
                BackgroundTimer.stop();
                return;
            }
            this.setState({ timer: this.state.timer - 1 });
        }, 1000);
    }

    resendVerificationCode = () => {
        this.resetTimer();
        const body = JSON.stringify({
            phone: this.state.phoneNumber,
            countryCode: this.state.countryCode,
            dialCode : this.state.dialCode
        });
        this.setState({ isLoading: true });
        ApiRequest.postMethodApiCall(Server.SEND_USER_OTP, body, (response, error) => {
            if (response) {
                this.setState({ isLoading: false });
                if (response.success) {
                    console.log("response --->>", response);
                    // TODO :- Will use once gets the endpoints
                } else {
                    ToastCollection.toastShowAtBottom(response.error);
                }
            } else {
                ToastCollection.toastShowAtBottom(error);
            }
        });
    }

    resetTimer = () => {
        this.setState({ timer: 30 });
    }
    verifyCode = (context) => {
        if (!this.state.otpCode) {
            ToastCollection.toastShowAtBottom(stringFile.ENTER_OTP);
            return;
        }
        if (this.state.otpCode.length != 4) {
            ToastCollection.toastShowAtBottom(stringFile.ENTER_FOUR_DIGIT_CODE);
            return;
        }
        this.state.isComeFromLogin && this.state.isPhoneVerified ? this.userLogin(context) : this.otpVerification(context);
    }

    userLogin = (context) => {
        const body = JSON.stringify({
            phone: this.state.phoneNumber,
            countryCode: this.state.countryCode,
            dialCode : this.state.dialCode,
            otp: this.state.otpCode
        });
       
        this.setState({ isLoading: true });
        ApiRequest.postMethodApiCall(Server.LOGIN_URL, body, (response, error) => {
            if (response) {
               
                this.setState({ isLoading: false });
                if (response.success) {
                    AccessTokenStore.instance.saveAccessToken(response.token);
                    AccessTokenStore.instance.setAccessToken(response.token);
                    UserModelStore.instance.persistUserModel(response.user);
                    context.signIn(response.token);
                } else {
                    ToastCollection.toastShowAtBottom(response.error);
                }
            } else {
                ToastCollection.toastShowAtBottom(error);
            }
        });
    }


    otpVerification = (context) => {
        const body = JSON.stringify({
            phone: this.state.phoneNumber,
            countryCode: this.state.countryCode,
            dialCode : this.state.dialCode,
            otp: this.state.otpCode
        });
        this.setState({ isLoading: true });
        ApiRequest.putMethodApiCall(Server.SIGN_UP_URL_STEP_TWO, body, (response, error) => {
            if (response) {
                this.setState({ isLoading: false });
                if (response.success) {
                    SignUpDataStore.instance.deleteSignUpStoredData();
                    AccessTokenStore.instance.saveAccessToken(response.token);
                    AccessTokenStore.instance.setAccessToken(response.token);
                    UserModelStore.instance.persistUserModel(response.user);
                    context.signIn(response.token);
                }
                else {
                    ToastCollection.toastShowAtBottom(response.error);
                }
            } else {
                ToastCollection.toastShowAtBottom(error);
            }
        });
    }

}

const styles = StyleSheet.create({
    parentViewStyle: {
        flex: 1
    },
    mainViewStyle: {
        flex: 1,
        paddingHorizontal: 50
    },
    mobileIconViewStyle: {
        width: 140,
        height: 140,
        borderRadius: 75,
        backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY,
        alignSelf: "center",
        marginTop: 50,
        justifyContent: "center"
    },
    verifyMobileTextStyle: {
        marginTop: 20,
        textAlign: "center",
        color: ColorConst.TEXT_COLOR_RED
    },
    mobileNumberTextStyle: {
        textAlign: "center",
        color: ColorConst.THEME_COLOR_ACTIVE_TAB,
        ...Font.FONT_REGULAR
    },
    textStyle: {
        marginTop: 20,
        marginLeft: 15,
        color: ColorConst.THEME_COLOR_BLACK
    },
    underlineStyleBase: {
        width: 45,
        height: 45,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 25, backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY, color: ColorConst.THEME_COLOR_BLACK
    },
    underlineStyleHighLighted: {
        borderColor: "#03DAC6"
    },
    otpViewStyle: {
        width: "100%",
        height: 100
    },
    reSendCodeStyle: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "space-between"
    }
});
