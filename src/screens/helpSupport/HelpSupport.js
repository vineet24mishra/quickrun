import React, { Component } from "react";
import { View, Text, SafeAreaView, Image, StyleSheet, Linking } from "react-native";
import ColorConst from "../../styles/colors/ColorConst";
import { CustomHeader } from "../../component/CustomHeader";
import { UserInfoView } from "../home/CustomViews";
import stringFile from "../../locale/StringEn";
import { TouchableOpacityDoubleClick } from "../../component/PreventDoubleClick";
import * as Font from "../../assets/fonts/Fonts";
import { deviceOs } from "../../Context";
import ToastCollection from "../../utils/ToastCollection";

export default class HelpSupport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runnerDetail: this.props.route.params && this.props.route.params.runnerDetails || {},
            bookingOTP : this.props.route.params && this.props.route.params.bookingOTP ||""
        };
    }

    render() {
        const runnerName = this.state.runnerDetail.firstName + " " + this.state.runnerDetail.lastName;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader title={"Help and Support"}
                    onPress={() => { this.props.navigation.goBack(); }}
                    showBackButton={true}
                />
                <View style={styles.container}>
                    <View style={styles.mainContentView}>
                        <UserInfoView
                            shiperName={runnerName}
                            yourShiper={stringFile.YOUR_SHIPER}
                            isShowCancelButton={true}
                            isShowTrackingStatusText={false}
                        />
                        <View style={{ flexDirection:"row", justifyContent:"center" }}>
                            <TouchableOpacityDoubleClick
                                style={styles.callViewStyle}
                                onPress={() => { this.makeCall(); }}>
                                <Image style={styles.callIconStyle}
                                    source={require("../../assets/icons/call.png")} />
                                <Text style={styles.actionButtonTextStyle}>{"Call shipper"}</Text>
                            </TouchableOpacityDoubleClick>

                            <TouchableOpacityDoubleClick
                                onPress={() => { this.onPressChat(); }}
                                style={styles.callViewStyle}>
                                <Image style={styles.callIconStyle}
                                    source={require("../../assets/icons/chat.png")} />

                                <Text style={styles.actionButtonTextStyle}>{"Support"}</Text>
                            </TouchableOpacityDoubleClick>
                        </View>
                        <Text style={styles.messageTextStyle}>{"In case your runner has been completed booking and you didn't get package yet, then you can contact via call and support.\n Thanks for you patience!"}</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
    makeCall = () => {
        var contactNumber = this.state.runnerDetail.dialCode + this.state.runnerDetail.phone;
        let phoneNumber = "";
        if (deviceOs === "android") {
            phoneNumber = "tel:$" + "{" + contactNumber + "}";
        } else {
            phoneNumber = "telprompt:$" + "{" + contactNumber + "}";
        }
        Linking.openURL(phoneNumber);
    };

    onPressChat = () => {
    ToastCollection.toastShowAtBottom("Not yet implemented");
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG
    },
    callViewStyle: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        marginHorizontal: 10,
        borderColor: ColorConst.THEME_COLOR_GREEN,
        justifyContent: "center",
        padding: 5
    },
    callIconStyle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        padding: 5,
        backgroundColor: ColorConst.THEME_COLOR_BLUE
    },
    actionButtonTextStyle: {
        ...Font.FONT_REGULAR, marginStart: 5
    },
    mainContentView : {
        backgroundColor: ColorConst.THEME_COLOR_WHITE, 
        width: "90%", 
        minHeight: 100, 
        borderRadius: 20, 
        shadowOpacity: 0.15, 
        elevation: 2, 
        padding: 10
    },
    messageTextStyle : {
        textAlign:"center", 
        marginTop: 40, 
        ...Font.FONT_SEMIBOLD, 
        fontSize: 16, 
        color:ColorConst.THEME_COLOR_GRAY, 
        margin: 20 
    }
});
