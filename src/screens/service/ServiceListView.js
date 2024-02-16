import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as Font from "../../assets/fonts/Fonts";
import ColorConst from "../../styles/colors/ColorConst";
import stringFile from "../../locale/StringEn";
// import { ShowStarRating } from "../../component/ServiceRating";
import Constants from "../../utils/Constants";

export const ServiceListItemView = ({ index, item, onPress, time, maxRating }) => (
    <View style={styles.maimContentView}>
        <TouchableOpacity
            key={index}
            style={[styles.cellActionStyle, { marginTop: index == 0 ? 10 : 0 }]}
            onPress={onPress}>
            <View style={{ flex: 1 }}>
                <View style={styles.bookingIDViewAndNextIcoStyle}>
                    <View style={{ marginStart: 14 }}>
                        <Text
                            numberOfLines={2}
                            style={styles.statusTextStyle}>{stringFile.BOOKING_ID}{item._id}</Text>
                        <Text style={styles.statusTextStyle}>{time}</Text>
                    </View>

                    <View style={styles.nextIconBackgroundView}>
                        <Image
                            style={styles.nextIconStyle}
                            resizeMode={"contain"}
                            source={require("../../assets/icons/next.png")} />
                    </View>

                </View>
                <View style={styles.statusViewStyle}>
                    <Text style={styles.statusTextStyle}>{stringFile.STATUS}</Text>
                    <Text style={[styles.statusTextStyle, { color: item.status == Constants.BOOKING_STATUS_COMPLETED ? ColorConst.THEME_COLOR_GREEN : ColorConst.THEME_COLOR_ACTIVE_TAB, marginLeft: 0 }]}>
                        {item.status == Constants.BOOKING_STATUS_COMPLETED ? stringFile.COMPLETED_STATUS : stringFile.CANECLED_STATUS}
                    </Text>
                    {/* <Text style={[styles.statusTextStyle, { marginLeft: 0 }]}>(By User)</Text> */}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        style={styles.indicatorIconsStyle}
                        source={require("../../assets/icons/greenUser.png")} />
                    <Text style={[styles.graySmallTextStyle, { marginTop: 15, marginStart: 10 }]}>{stringFile.RUNNER_NAME}</Text>
                </View>
                <Text style={[styles.blackMediumTextStyle, { marginStart: 20 }]}>  {item.runner.firstName + " " + item.runner.lastName}</Text>
                {/* <View style={{ marginStart: 25 }}> //WILL BE USE IN FUTURE
                    <ShowStarRating 
                        rating={item.runner.rating.averageRating}
                        maxRating={maxRating}
                        isShowfeedBackView={false}
                    />
                </View> */}

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                        style={styles.indicatorIconsStyle}
                        source={require("../../assets/icons/greenCall.png")} />
                    <Text style={[styles.graySmallTextStyle, { marginTop: 15 }]}>{stringFile.PHONE_NUMBER}</Text>
                </View>
                <Text style={[styles.blackMediumTextStyle, { marginStart: 20 }]}>  {item.runner.dialCode + " " + item.runner.phone}</Text>

            </View>
        </TouchableOpacity>
    </View>

);

const styles = StyleSheet.create({
    blackMediumTextStyle: {
        ...Font.FONT_MEDIUM,
        color: ColorConst.THEME_COLOR_BLACK,
        marginLeft: 16
    },
    graySmallTextStyle: {
        ...Font.FONT_REGULAR,
        color: ColorConst.THEME_COLOR_GRAY,
        marginLeft: 8
    },
    statusTextStyle: {
        ...Font.FONT_MEDIUM,
        color: ColorConst.THEME_COLOR_GRAY,
        marginLeft: 8
    },
    indicatorIconsStyle: {
        marginTop: 10,
        height: 15,
        width: 15
    },
    maimContentView: {
        flex: 1,
        backgroundColor: ColorConst.THEME_COLOR_WHITE,
        marginTop: 30,
        marginHorizontal: 30,
        marginBottom: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: ColorConst.THEME_COLOR_LIGHT_GRAY_SHADE,
        padding: 20,
        shadowColor: ColorConst.THEME_COLOR_GRAY,
        elevation: 2,
        shadowOpacity: 0.15
    },
    cellActionStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 1,
        paddingStart: 10,
        paddingEnd: 10,
        alignItems: "center"
    },
    bookingIDViewAndNextIcoStyle: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    nextIconBackgroundView: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: ColorConst.THEME_COLOR_BLUE,
        alignItems: "center",
        justifyContent: "center",
        right: 10
    },
    nextIconStyle: {
        height: 15,
        width: 15,
        tintColor: ColorConst.THEME_COLOR_WHITE
    },
    statusViewStyle: {
        flexDirection: "row",
        width: "100%",
        marginTop: 10, 
        marginStart: 14
    }
});
