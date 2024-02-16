import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Image, ScrollView, Keyboard, BackHandler, AppState } from "react-native";
import auth from "@react-native-firebase/auth";
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
import SignUpDataStore from "../../store/SignUpDataStore";
import { TouchableOpacityDoubleClick } from "../../component/PreventDoubleClick";
import ToastCollection from "../../utils/ToastCollection";
import { FirebaseManager } from "../../utils/FirebaseManager";
import BGTimer from "../../utils/BGTimer";
import BookingDetailsStore from "../../store/BookingDetailsStore";

export default function Test({ route }) {
    const [timer, setTimer] = React.useState(30);
    const { phoneNumber } = route.params;
    const { dialCode } = route.params;
    const { countryCode } = route.params;
    const { isComeFromLogin } = route.params;
    const { isPhoneVerified } = route.params;
    const [isLoading, setLoader] = React.useState(false);
    const { confirm } = route.params;
    const [otpCode, setOtpCode] = React.useState("");
    const [confirmOtp, setConfirmOtp] = React.useState(confirm);
    const [bgTimer, setBgTimer] = React.useState(null);
    const [ backHandlerValue ]  = React.useState(AccessTokenStore.instance.getBackHandler());
    const [appState, setAppState] = React.useState(AppState.currentState);
    const ctx = React.useContext(AuthContext);
    
    const handleAppState = nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === "active") {
          console.log("App has come to the foreground!");
        }
        setAppState(nextAppState);
        console.log(nextAppState);
      };

    function onAuthStateChanged(user) {
        user && (isComeFromLogin && isPhoneVerified ? userLogin(ctx) : otpVerification(ctx));
    }

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    React.useEffect(() => {
        timeCountDown();
        if(backHandlerValue == false){
            BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
        } else {
            BackHandler.addEventListener("hardwareBackPress", handleBackButton);
        }
        return () => clearTimeCountDown();
    }, []);

    React.useEffect(() => {
        AppState.addEventListener("change", handleAppState);
        return () => {
            AccessTokenStore.instance.setBackHandler(false);
            AppState.removeEventListener("change", handleAppState);
        };
    }, []);

    function clearTimeCountDown() {
        BGTimer.clearInterval(bgTimer);
        setTimer(0);
        setBgTimer(null);
    }

    function timeCountDown() {
        if (!bgTimer) {
            setBgTimer(BGTimer.setInterval(() => {
                if (timer == 0) {
                    clearTimeCountDown();
                    return;
                }
                setTimer(timer => timer - 1);
            }, 1000));
        }
    }

    function handleBackButton() {
        return true;
    }

    function resendCode() {
        setTimer(30);
        setLoader(true);
        FirebaseManager.signInWithPhoneNumber(
            dialCode + phoneNumber,
            (confirmation) => {
                console.log(confirmation);
                setLoader(false);
                setConfirmOtp(confirmation);
            },
            (error) => {
                setLoader(false);
                console.log("error ----->>>", error);
            });
        if (!bgTimer) {
            setBgTimer(BGTimer.setInterval(() => {
                if (timer == 0) {
                    clearTimeCountDown();
                    return;
                }
                setTimer(timer => timer - 1);

            }, 1000));
        }
    }

    function verifyCode() {
        if (!otpCode) {
            ToastCollection.toastShowAtBottom(stringFile.ENTER_OTP);
            return;
        }
        if (otpCode.length != 6) {
            ToastCollection.toastShowAtBottom(stringFile.ENTER_FOUR_DIGIT_CODE);
            return;
        } else {
            handleVerifyCode();
        }
    }

    function userLogin(context) {
        const body = JSON.stringify({
            phone: phoneNumber,
            countryCode: countryCode,
            dialCode: dialCode,
            otp: "1111"
        });
        ApiRequest.postMethodApiCall(Server.LOGIN_URL, body, (response, error) => {
            if (response) {
                setLoader(false);
                setBgTimer(null);
                if (response.success) {
                    AccessTokenStore.instance.saveAccessToken(response.token);
                    AccessTokenStore.instance.setAccessToken(response.token);
                    UserModelStore.instance.persistUserModel(response.user);
                    getBookingDetail(context, response.token);
                } else {
                    ToastCollection.toastShowAtBottom(response.error);
                }
            } else {
                ToastCollection.toastShowAtBottom(error);
            }
        });
    }

    function getBookingDetail(context, token) {
        setLoader(true);
        ApiRequest.getMethodApiCall(Server.GET_BOOKING_DETAILS, (response, error) => {
         if(response) {
             setLoader(false);
             if(response.success) {
                BookingDetailsStore.instance.persistCurrentBookinData(response.booking);
                if(response.booking != null){
                    BookingDetailsStore.instance.setIsBookingAvaiable(true);
                }
                context.signIn(token);
             } else {
                ToastCollection.toastShowAtBottom(response.error);
             }
         } else {
             ToastCollection.toastShowAtBottom(error);
         }
        });
    }


    function otpVerification(context) {
        const body = JSON.stringify({
            phone: phoneNumber,
            countryCode: countryCode,
            dialCode: dialCode,
            otp: "1111"
        });
        ApiRequest.putMethodApiCall(Server.SIGN_UP_URL_STEP_TWO, body, (response, error) => {
            if (response) {
                setLoader(false);
                setBgTimer(null);
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

    async function handleVerifyCode() {
        setLoader(true);
        try {
            await confirmOtp.confirm(otpCode);
        } catch (error) {
            console.log("error verify otp -->>", error);
            setLoader(false);
            ToastCollection.toastShowAtBottom(stringFile.EXPIRE_OTP_MESSAGE);
        }
    }

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
                            {dialCode}{" "}{phoneNumber}</Text>

                        <OTPInputView
                            style={styles.otpViewStyle}
                            pinCount={6}
                            code={otpCode}
                            onCodeChanged={code => { setOtpCode(code); }}
                            autoFocusOnLoad
                            codeInputFieldStyle={styles.underlineStyleBase}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled={(code => {
                                console.log(`Code is ${code}, you are good to go!`);
                            })}
                        />
                        <View >
                            <TextButton
                                buttonTitle={isComeFromLogin ? stringFile.SUBMIT : stringFile.VERIFY_CODE}
                                onButtonPress={() => { verifyCode(); }} />
                        </View>

                        <View style={styles.reSendCodeStyle}>
                            <TouchableOpacityDoubleClick>
                                {timer <= 0 && <Text
                                    onPress={() => { resendCode(); }}
                                    style={{
                                        color: ColorConst.THEME_COLOR_BLUE, ...Font.FONT_SEMIBOLD
                                    }}>{stringFile.RESEND_CODE}</Text>}

                            </TouchableOpacityDoubleClick>
                            {timer > 0 && <Text style={{
                                color: ColorConst.THEME_COLOR_ACTIVE_TAB,
                                ...Font.FONT_SEMIBOLD
                            }}> 00:{("0" + timer).slice(-2)}</Text>}

                        </View>
                    </View>
                </View>
            </ScrollView>
            {isLoading ? (
                <Loader isLoading={true} />
            ) : null}
        </SafeAreaView>

    );
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
