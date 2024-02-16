import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, Text, Image } from "react-native";
import { connect } from "react-redux";
import ColorConst from "../../styles/colors/ColorConst";
import stringFile from "../../locale/StringEn";
import { CustomHeader } from "../../component/CustomHeader";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { ShowDataCard, SelectPackageCard } from "../home/CustomViews";
import * as Font from "../../assets/fonts/Fonts";
// import { ShowStarRating } from "../../component/ServiceRating";
import Constants from "../../utils/Constants";
class ServiceDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.route.params && this.props.route.params.bookingDetails,
            packageItems: this.props.route.params && this.props.route.params.bookingDetails.productDetails,
            runnerDetails: this.props.route.params && this.props.route.params.bookingDetails.runner,
            dateAndTime: this.props.route.params && this.props.route.params.timeAndDate,
            maxRating: 5,
            userId: undefined
        };
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY }}>
                <CustomHeader
                    title={stringFile.BOOKING_DETAIL_TITLE}
                    showBackButton={true}
                    onPress={() => { this.props.navigation.goBack(); }}
                />
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.mainContentViewStyle}>
                        <View style={styles.timeAndDateViewStyle}>
                            <Text style={styles.timeAndDateTextStyle}>{stringFile.BOOKING_ID}{this.state.item._id}</Text>
                            <Text style={styles.timeAndDateTextStyle}>{this.state.dateAndTime}</Text>
                        </View>
                        { this.state.item.status == Constants.BOOKING_STATUS_COMPLETED && <View style={styles.statusTextViewStyle}>
                            <Text style={styles.timeAndDateTextStyle}>{stringFile.FINAL_AMOUNT}</Text>
                            <Text style={styles.timeAndDateTextStyle}>
                                {this.state.item.totalAmount ? stringFile.DOLLAR_SIGN + this.state.item.totalAmount : stringFile.AMOUNT}
                            </Text>
                        </View>}
                        <View style={styles.statusAndHistoryViewStyle}>
                            <Text style={styles.timeAndDateTextStyle}>{stringFile.STATUS}</Text>
                            <Text style={[styles.timeAndDateTextStyle, {
                                color: this.state.item.status == Constants.BOOKING_STATUS_COMPLETED
                                    ? ColorConst.THEME_COLOR_GREEN : ColorConst.THEME_COLOR_ACTIVE_TAB, ...Font.FONT_MEDIUM
                            }]}>
                            {this.state.item.status == Constants.BOOKING_STATUS_COMPLETED ? stringFile.COMPLETED_STATUS : stringFile.CANECLED_STATUS}
                            </Text>
                            <TouchableOpacity
                                onPress={() => { this.navigateToChatScreen(); }}
                                style={styles.chatViewStyle}>
                                <Image style={styles.callIconStyle}
                                    source={require("../../assets/icons/chat.png")} />
                                <Text style={styles.actionButtonTextStyle}>{stringFile.CHAT_HISTORY}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 20, alignItems: "center" }}>
                            <SelectPackageCard
                                title={stringFile.SELECTED_PACAGE}
                                selectedProduct={this.state.packageItems}
                                additonalPackageViewStyle={{ width: "90%", marginRight: 30 }}
                                dropAddress={this.state.item.fromAddress}
                                extraTextStyle={{ ...Font.FONT_MEDIUM }}
                            />
                            <ShowDataCard
                                title={stringFile.PICKUP_TEXT}
                                icon1={require("../../assets/icons/pickup_navigator.png")}
                                address={this.state.item.fromAddress}
                                extraAddressTextStyle={{ ...Font.FONT_MEDIUM }}
                            />
                            <ShowDataCard
                                title={stringFile.DROP_TEXT}
                                icon1={require("../../assets/icons/drop_navigator.png")}
                                address={this.state.item.toAddress}
                                extraAddressTextStyle={{ ...Font.FONT_MEDIUM }}
                            />
                            {this.state.item.instruction !== "" && <ShowDataCard
                                title={stringFile.INSTRUCTIONS}
                                icon1={require("../../assets/icons/ink.png")}
                                address={this.state.item.instruction}
                                extraAddressTextStyle={{ ...Font.FONT_MEDIUM }}
                            />}
                            <ShowDataCard
                                title={stringFile.RUNNER_NAME}
                                icon1={require("../../assets/icons/greenUser.png")}
                                address={this.state.runnerDetails.firstName + " " + this.state.runnerDetails.lastName}
                                extraAddressTextStyle={styles.additionalAddressTextStyle}
                            />
                            {/* <ShowStarRating  //WILL BE USE IN FUTURE
                            rating={this.state.runnerDetails.rating.averageRating}
                            maxRating={this.state.maxRating}
                            isShowfeedBackView={false}
                        /> */}
                            <ShowDataCard
                                title={stringFile.PHONE_NUMBER}
                                icon1={require("../../assets/icons/greenCall.png")}
                                address={this.state.runnerDetails.dialCode + " " + this.state.runnerDetails.phone}
                                extraAddressTextStyle={styles.additionalAddressTextStyle}
                            />
                            <View style={{ alignSelf:"flex-end", marginRight: 30 }}>
                            <TouchableOpacity
                                onPress={() => { this.navigateToHelpScreen(); }}
                                style={styles.chatViewStyle}>
                                <Image style={styles.callIconStyle}
                                    source={require("../../assets/icons/chat.png")} />
                                <Text style={[styles.actionButtonTextStyle, { marginStart: 10 }]}>{"Help and Support"}</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>

            </SafeAreaView>
        );
    }
    navigateToChatScreen = () => {
        this.props.navigation.navigate("ChatScreen",
            { bookingID: this.state.item._id, runnerDetails: this.state.item.runner, isComeFromBookingDetail: true });
    }
    navigateToHelpScreen = () => {
        this.props.navigation.navigate("HelpSupport",
        {runnerDetails: this.state.item.runner});
    }
}

const mapStateToProps = (
    // state
) => {
    return {
    };
};
export default connect(mapStateToProps, {})(ServiceDetails);

const styles = StyleSheet.create({
    mainContentViewStyle: {
        width: "90%",
        backgroundColor: ColorConst.THEME_COLOR_WHITE,
        marginTop: 30,
        borderRadius: 20,
        marginBottom: 30,
        alignItems: "center",
        padding: 20,
        alignSelf: "center"
    },
    timeAndDateViewStyle: {
        flexDirection: "column",
        marginTop: 10,
        justifyContent: "space-around",
        width: "100%"
    },
    timeAndDateTextStyle: {
        ...Font.FONT_MEDIUM,
        color: ColorConst.THEME_COLOR_GRAY
    },
    statusTextViewStyle: {
        flexDirection: "row",
        width: "100%",
        marginTop: 10
    },
    chatViewStyle: {
        flexDirection: "row",
        borderRadius: 10,
        borderWidth: 1,
        marginLeft: 60,
        borderColor: ColorConst.THEME_COLOR_BLUE,
        padding: 5,
        right: 5
    },
    callIconStyle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        padding: 5,
        backgroundColor: ColorConst.THEME_COLOR_BLUE
    },
    statusAndHistoryViewStyle : {
        flexDirection: "row", 
        width: "100%", 
        alignItems: "center"
    },
    additionalAddressTextStyle : {
        fontSize: 14, 
        marginTop: 0, 
        ...Font.FONT_MEDIUM
    }
});
