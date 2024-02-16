import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import ColorConst from "../../styles/colors/ColorConst";
import * as Font from "../../assets/fonts/Fonts";
import stringFile from "../../locale/StringEn";
import { TextButton } from "../../component/TextButton";
import { TextStyles } from "../../styles/componentStyle/TextStyles";
import { TouchableOpacityDoubleClick, TextDoubleClick } from "../../component/PreventDoubleClick";
import { TouchableOpacity, FlatList, TextInput } from "react-native-gesture-handler";
function processIndicator(pickupAddress, dropAddress, selectedProduct) {
    return (
        <View style={styles.sneekBarLineViewStyle}>
            <View style={[styles.sneekBarFlowStyle, { backgroundColor: pickupAddress || dropAddress || selectedProduct ? ColorConst.THEME_COLOR_GREEN : "white" }]}>
                <Image
                    style={{ tintColor: pickupAddress ? ColorConst.THEME_COLOR_WHITE : ColorConst.THEME_COLOR_GRAY, height: 15, width: 15 }}
                    source={require("../../assets/icons/tick.png")} />
            </View>
            <View style={[styles.processIndicatorStyle,
            {
                backgroundColor: pickupAddress || dropAddress || selectedProduct ? ColorConst.THEME_COLOR_GREEN
                    : ColorConst.THEME_PROGRESS_LINE_COLOR
            }]} />
        </View>
    );
}

export const PickUpAddressCard = ({
    onPress, address, title, icon1, apartmentName, houseNumber, icon2, isDisableTouch, backgroundColor
}) => (
        <View style={styles.pickUpAddressParentStyle}>
            {processIndicator(address)}
            <View style={styles.pickUpAddressInnerStyle}>
                <TouchableOpacityDoubleClick
                    disabled={isDisableTouch}
                    onPress={onPress}
                    style={styles.infoBoxStyle}>
                    <View style={[styles.pickUpAddressInfoStyle, { backgroundColor: backgroundColor }]}>
                        <View style={styles.similarFlexStyle}>
                            <View style={styles.indicatorIconsStyle}>
                                <Image
                                    style={styles.indicatorIconsStyle}
                                    source={icon1} />
                            </View>
                            <Text style={[styles.infoTextStyle, styles.addressTitleTextStyle]}>{title}</Text>
                            <Text style={[styles.addressInfoStyle, { marginTop: 15 }]}>{houseNumber}{"  "}{apartmentName}</Text>
                            <Text multiline={true}
                                style={styles.addressInfoStyle}>
                                {address.formatted_address}
                            </Text>
                        </View>
                        <Image
                            style={styles.infoBoxRightIconStyle}
                            source={icon2} resizeMode={"contain"} />
                    </View>
                </TouchableOpacityDoubleClick>
            </View>
        </View>
    );

export const SelectPackageCard = ({
    onPress, dropAddress, selectedProduct, onPressIcon, onPressRemoveItem,
    showIndicator, showRemoveIcon, showNextIcon, additonalPackageViewStyle, extraTextStyle, title
}) => (
        <View style={styles.pickUpAddressParentStyle}>
            {showIndicator && <View style={styles.productTickIcon}>
                <View style={[styles.sneekBarFlowStyle, { backgroundColor: selectedProduct.length > 0 ? ColorConst.THEME_COLOR_GREEN : "white" }]}>
                    <Image
                        style={{
                            tintColor: selectedProduct.length > 0 ? ColorConst.THEME_COLOR_WHITE : ColorConst.THEME_COLOR_GRAY,
                            height: 15, width: 15
                        }}
                        source={require("../../assets/icons/tick.png")} />
                </View>
                <View style={styles.similarFlexStyle}></View>
            </View>}
            <View
                style={[styles.selectedProductStyle, additonalPackageViewStyle, {
                    backgroundColor: dropAddress ? ColorConst.THEME_COLOR_WHITE : ColorConst.THEME_COLOR_LIGHT_GRAY
                }]}>
                <View style={styles.selectedProductHeightViewStyle}>
                    <View style={styles.sellIconTextStyleView}>
                        <TouchableOpacityDoubleClick
                            disabled={dropAddress ? false : true}
                            onPress={onPress}
                            style={{ flexDirection: "row", padding: 5, alignItems: "center" }}>
                            <Image
                                style={styles.indicatorIconsStyle}
                                source={require("../../assets/icons/sell.png")} />

                            <Text style={[styles.infoTextStyle, { marginStart: 10 }]}>{title}</Text>
                        </TouchableOpacityDoubleClick>
                        <FlatList
                            data={selectedProduct}
                            renderItem={((item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={[styles.productListParentViewStyle, { justifyContent: showNextIcon ? "space-between" : "flex-start" }]}
                                    >
                                        <Text style={[styles.itemTextIndexColor, extraTextStyle]}>{item.index + 1})</Text>
                                        <Text style={[styles.productTextViewStyle, extraTextStyle]}>{item.item}</Text>
                                        {showRemoveIcon && <TouchableOpacity
                                            onPress={() => onPressRemoveItem(item.index)}>
                                            <Image
                                                style={styles.deleteIconStyle}
                                                source={require("../../assets/icons/close.png")} resizeMode={"contain"} />
                                        </TouchableOpacity>}
                                    </View>
                                );
                            })}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    {showNextIcon && <TouchableOpacityDoubleClick
                        disabled={dropAddress ? false : true}
                        onPress={onPressIcon}
                        style={{ alignSelf: "center" }}>
                        <Image
                            style={styles.infoBoxRightIconStyle}
                            source={require("../../assets/icons/next.png")} resizeMode={"contain"} />
                    </TouchableOpacityDoubleClick>}
                </View>
            </View>
        </View>
    );

export const InstrutionTextBoxCard = ({ address, onPressAddItem, onChangeText, keyType, value,
    icon1, icon2, cardTitle, placeholder, editable, backgroundColor }) => (
        <View
            style={[styles.infoBoxStyle, styles.addManualPackageExtraStyles,
            { backgroundColor: backgroundColor }]}>
            <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }}>
                <Image
                    style={styles.indicatorIconsStyle}
                    source={icon1} />
                <Text style={[styles.infoTextStyle, { marginTop: 10, marginStart: 10 }]}>{cardTitle}</Text>
                <View style={styles.addItemIconStyle}>
                    <TouchableOpacityDoubleClick
                        disabled={address ? false : true}
                        onPress={onPressAddItem}>
                        <Image
                            style={[styles.indicatorIconsStyle, { tintColor: ColorConst.THEME_COLOR_BLUE }]}
                            source={icon2} />
                    </TouchableOpacityDoubleClick>
                </View>
            </View>
            <TextInput style={styles.manualItemTextStyle}
                multiline={true}
                numberOfLines={4}
                selectionColor={ColorConst.THEME_COLOR_GRAY}
                onChangeText={onChangeText}
                value={value}
                editable={address || editable ? true : false}
                keyboardType="default"
                keyType={keyType}
                placeholder={placeholder}
            />
        </View>
    );
export const AmountCalculationCard = ({
    onConfirmPickupPress, onQwiikRunClick, estimatedAmount
}) => (
        <View>
            <View style={styles.bottomViewStyle}>
                <Text style={[styles.infoTextStyle, styles.estimatedAmountViewStyle]}>{stringFile.ESTIMATED_AMOUNT}</Text>
                <View style={styles.amountEstimationViewStyle}>
                    <Text style={[styles.infoTextStyle, styles.toPayTextStyle]}>{stringFile.TO_PAY}</Text>
                    <Text style={[styles.infoTextStyle, styles.estimatedAmountOtherTextStyle]}>{estimatedAmount ? stringFile.DOLLAR_SIGN + estimatedAmount : stringFile.AMOUNT}</Text>
                </View>

                <View style={styles.bottomViewSeprate} />

                <Text style={styles.disclamerTextStyle}>
                    {stringFile.DISCLAMER}
                    <TextDoubleClick
                        onPress={() => { }}
                        style={styles.appNameInDisclamerStyle}>
                        {stringFile.APP_NAME}
                    </TextDoubleClick>

                </Text>

                <View style={styles.estimatedAmountParentView}>
                    <Text style={styles.estimatedAmountTextStyle}>
                        {estimatedAmount ? "$ " + estimatedAmount : stringFile.AMOUNT}
                        <TextDoubleClick
                            onPress={onQwiikRunClick}
                            style={{ color: ColorConst.THEME_COLOR_GRAY, fontSize: 10 }}>
                            {stringFile.INCLUSIVE_OF_CHARGES}
                        </TextDoubleClick>
                    </Text>
                    <TextButton
                        additionalStyle={styles.confirmPickReqButtonStyle}
                        buttonTitle={stringFile.CONFIRM_PICKUP}
                        newTextStyle={{ fontSize: 16 }}
                        onButtonPress={() => { onConfirmPickupPress(); }} />
                </View>

            </View>

        </View>
    );

export const ShowDataCard = ({
    address, title, icon1, icon2, additionalStyle, extraAddressTextStyle
}) => (
        <View style={styles.cardMainViewStyle}>
            <View style={[styles.viewWidthStyle, additionalStyle]}>
                <View style={styles.bookingInfoBoxStyle}>
                    <View style={styles.cardSubViewStyle}>
                        <View style={styles.similarFlexStyle}>
                            <View style={styles.iconAndTitleAlignmentStyle}>
                                <Image
                                    style={styles.indicatorIconsStyle}
                                    source={icon1} />
                                <Text style={[styles.infoTextStyle, { marginStart: 8 }]}>{title}</Text>
                            </View>
                            <Text
                                multiline={true}
                                style={[styles.addressTextStyle, extraAddressTextStyle]}>
                                {address}
                            </Text>
                        </View>
                        <Image
                            style={styles.infoBoxRightIconStyle}
                            source={icon2} resizeMode={"contain"} />
                    </View>
                </View>
            </View>
        </View>
    );
export const UserInfoView = ({ yourShiper, shiperName, otp, onPressCancelButton, isShowCancelButton, isShowTrackingStatusText, showOtp }) => (
    <View style={{ marginBottom: 20 }}>
        <View style={styles.userInfoMainViewStyle}>
            <View style={styles.userImageBackgroundViewStyle}>
                <Image style={styles.userImageViewStyle}
                    source={require("../../assets/icons/account.png")} />
            </View>
            <Text style={[TextStyles.textStyleSubheading, styles.userNameTextStyle]}>
                {shiperName} {"\n"}
                <Text style={[TextStyles.textStyleMedium, { marginStart: 20, color: ColorConst.THEME_COLOR_GRAY }]}>
                    {yourShiper}{"\n"}
                </Text>
                {showOtp && <Text style={[TextStyles.textStyleMedium, { marginStart: 20, color: ColorConst.THEME_COLOR_GRAY }]}>
                    {stringFile.OTP}{otp}
                </Text>}
            </Text>
        </View>
        <View style={styles.bottomHorizontalViewStyle} />

        { isShowTrackingStatusText ? <View style={styles.canecelButtonView}>
            <Text style={[TextStyles.textStyleMedium, styles.trackingStatusTextStyle]}>{stringFile.TRACKING_STATUS}</Text>
            {isShowCancelButton && <TouchableOpacityDoubleClick
                onPress={onPressCancelButton}
                style={[styles.callViewStyle, { borderColor: ColorConst.THEME_COLOR_ACTIVE_TAB }]}>
                <Text style={[styles.actionButtonTextStyle, { marginEnd: 5 }]}>{stringFile.CANCEL}</Text>
            </TouchableOpacityDoubleClick>}
        </View> : <View style={styles.canecelButtonView}>
                <Text style={[TextStyles.textStyleMedium, styles.trackingStatusTextStyle]}>{"Booking Status"}</Text>
                <Text style={[styles.actionButtonTextStyle, { marginEnd: 20, color: ColorConst.THEME_COLOR_GREEN }]}>{"Completed"}</Text>
            </View>}

    </View>
);

export const DistanceAndPickupInfoView = ({ startTime, meridiem, distance }) => (
    <View style={styles.distanceInfoParentView}>
        <View style={styles.similarFlexStyle}>
            <View style={styles.distanceViewStyle}>
                <Image
                    style={styles.iconViewStyle}
                    source={require("../../assets/icons/pickup_navigator.png")} />
                <Text style={[TextStyles.textStyleMedium, styles.statusTimeTextStyle]}>
                    {stringFile.PICKUP_TIME}  </Text>
            </View>
            <Text style={[TextStyles.textStyleSubheading, styles.distanceTrackingTimeTextStyle]}>
                {startTime}
                <Text style={[TextStyles.textStyleMedium, styles.distanceUnitTextStyle]}> {meridiem} </Text>
            </Text>
        </View>
        <View style={styles.similarFlexStyle}>
            <View style={styles.distanceTextStyle}>
                <Image
                    style={styles.iconViewStyle}
                    source={require("../../assets/icons/pickup_navigator.png")} />

                <Text style={[TextStyles.textStyleMedium, styles.statusTimeTextStyle]}>
                    {stringFile.DISTANCE}  </Text>
            </View>
            <Text style={[TextStyles.textStyleSubheading, styles.distanceTrackingTimeTextStyle]}>{distance}
                <Text style={[TextStyles.textStyleMedium, styles.distanceUnitTextStyle]}> {stringFile.KILOMETERS} </Text>
            </Text>
        </View>
    </View>
);

export const TrackingStatusView = ({ message, time, isPickedStatus, title, isLocation, onPressCall, isShowCallView, meridiem,
    onPressDone, onPressChat, newMessageReceived }) => (
        <View>
            <View style={styles.trackingStatusViewStyle}>
                <View style={{ minWidth: 60, alignItems: "center" }}>
                    <Text style={[TextStyles.textStyleMedium, { color: ColorConst.THEME_COLOR_BLACK, ...Font.FONT_SEMIBOLD }]}>
                        {time}
                    </Text>
                    <Text style={[TextStyles.textStyleSmall, { textAlign: "center" }]}>{meridiem}</Text>
                </View>

                <View style={{ marginStart: 20 }}>
                    <View style={[styles.sneekBarFlowStyle,
                    { backgroundColor: isPickedStatus ? ColorConst.THEME_COLOR_GREEN : ColorConst.THEME_COLOR_GRAY }]}>
                        <Image
                            style={{ tintColor: ColorConst.THEME_COLOR_WHITE, height: 15, width: 15 }}
                            source={require("../../assets/icons/tick.png")} />
                    </View>
                    <View style={[styles.processIndicatorViewStyle,
                    {
                        flex: isLocation ? 0 : 1,
                        backgroundColor: isPickedStatus ? ColorConst.THEME_COLOR_GREEN : ColorConst.THEME_COLOR_GRAY
                    }]} />
                </View>

                <View style={styles.trackingStatusStatusTextStyle}>
                    <Text style={[TextStyles.textStyleMedium, styles.trackingStatusViewTitleStyle]}>
                        {title}
                    </Text>
                    <Text style={[TextStyles.textStyleSmall, { textAlign: "left" }]}>
                        {message}
                    </Text>
                    {isShowCallView && <View style={styles.accountIconViewStyle}>
                        <Image style={styles.accountIconStyle}
                            source={require("../../assets/icons/account.png")} />
                        <TouchableOpacityDoubleClick
                            style={styles.callViewStyle}
                            onPress={onPressCall}>

                            <Image style={styles.callIconStyle}
                                source={require("../../assets/icons/call.png")} />
                            <Text style={styles.actionButtonTextStyle}>{stringFile.CALL}</Text>
                        </TouchableOpacityDoubleClick>

                        <TouchableOpacityDoubleClick
                            onPress={onPressChat}
                            style={styles.callViewStyle}>
                            {newMessageReceived && <View style={styles.newMessageIndicator} />}
                            <Image style={styles.callIconStyle}
                                source={require("../../assets/icons/chat.png")} />

                            <Text style={styles.actionButtonTextStyle}>{stringFile.CHAT}</Text>
                        </TouchableOpacityDoubleClick>
                    </View>}
                    {isLocation && isPickedStatus && <TouchableOpacityDoubleClick
                        onPress={onPressDone}
                        style={[styles.callViewStyle, { marginHorizontal: 0 }]}>
                        <Text style={[styles.actionButtonTextStyle, { marginStart: 0 }]}>{"Got the package"}</Text>
                    </TouchableOpacityDoubleClick>}
                </View>
            </View>
        </View>
    );

const styles = StyleSheet.create({
    pickUpAddressParentStyle: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 10
    },
    processIndicatorStyle: {
        flex: 1,
        width: 2,
        marginBottom: -10
    },
    pickUpAddressInnerStyle: {
        width: "80%",
        marginStart: 20,
        marginTop: -10
    },
    pickUpAddressInfoStyle: {
        flexDirection: "row",
        flex: 1,
        borderRadius: 20
    },
    infoBoxStyle: {
        minHeight: 100,
        backgroundColor: ColorConst.THEME_COLOR_WHITE,
        margin: 10,
        borderRadius: 20,
        shadowOpacity: 0.15,
        elevation: 2
    },
    bookingInfoBoxStyle: {
        minHeight: 30,
        backgroundColor: ColorConst.THEME_COLOR_WHITE,
        margin: 10,
        borderRadius: 20,
        shadowOpacity: 0.15,
        elevation: 2
    },
    indicatorIconsStyle: {
        marginTop: 10,
        marginStart: 5,
        height: 15,
        width: 15
    },
    addressInfoStyle: {
        marginLeft: 35,
        ...Font.FONT_REGULAR,
        color: ColorConst.THEME_COLOR_BLACK
    },
    productTickIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginStart: 20
    },
    infoTextStyle: {
        marginTop: 10,
        marginStart: 15,
        color: ColorConst.THEME_COLOR_GRAY,
        ...Font.FONT_REGULAR
    },
    infoBoxRightIconStyle: {
        marginTop: 10,
        marginStart: 5,
        alignSelf: "center",
        marginEnd: 10,
        height: 15,
        width: 15
    },
    selectedProductStyle: {
        width: "75%",
        marginStart: 30,
        minHeight: 100,
        margin: 0,
        borderRadius: 20,
        shadowOpacity: 0.15,
        elevation: 2
    },
    estimatedAmountViewStyle: {
        color: ColorConst.THEME_COLOR_ACTIVE_TAB,
        marginTop: 20,
        marginStart: 30,
        fontSize: 14
    },
    estimatedAmountTextStyle: {
        color: ColorConst.THEME_COLOR_BLACK,
        flexDirection: "column",
        ...Font.FONT_REGULAR,
        fontSize: 18
    },
    toPayTextStyle: {
        marginTop: 16,
        fontSize: 14,
        marginStart: 0
    },
    selectedProductHeightViewStyle: {
        flex: 1,
        flexDirection: "row",
        height: 150
    },
    sellIconTextStyleView: {
        flex: 1,
        paddingBottom: 10,
        paddingRight: 20
    },
    disclamerTextStyle: {
        marginHorizontal: 30,
        color: ColorConst.THEME_COLOR_GRAY,
        ...Font.FONT_REGULAR,
        fontSize: 10
    },
    estimatedAmountParentView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 30,
        marginVertical: 20
    },
    productListParentViewStyle: {
        flexDirection: "row",
        width: "100%",
        flex: 1,
        padding: 5,
        alignItems: "center"
    },
    productTextViewStyle: {
        marginRight: 20,
        justifyContent: "center",
        alignItems: "center",
        width: "60%",
        ...Font.FONT_REGULAR,
        color: ColorConst.THEME_COLOR_BLACK,
        marginStart: 10
    },
    deleteIconStyle: {
        height: 12,
        width: 12,
        marginRight: 20
    },
    bottomViewStyle: {
        backgroundColor: ColorConst.THEME_COLOR_WHITE,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: 40,
        shadowOpacity: 0.15,
        elevation: 2
    },
    amountEstimationViewStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 30
    },
    estimatedAmountOtherTextStyle: {
        marginTop: 16,
        fontSize: 18,
        color: ColorConst.THEME_COLOR_BLACK
    },
    appNameInDisclamerStyle: {
        color: ColorConst.THEME_COLOR_BLUE,
        fontWeight: "bold",
        ...Font.FONT_REGULAR
    },
    bottomViewSeprate: {
        marginHorizontal: 30,
        height: 2,
        backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY,
        marginVertical: 15
    },
    sneekBarFlowStyle: {
        shadowOpacity: 0.1,
        elevation: 1,
        height: 30,
        width: 30,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    confirmPickReqButtonStyle: {
        width: "50%",
        marginStart: 10
    },
    distanceInfoParentView: {
        width: "100%",
        height: 80,
        flexDirection: "row",
        backgroundColor: ColorConst.THEME_COLOR_ACTIVE_TAB,
        justifyContent: "space-between"
    },
    sneekBarLineViewStyle: {
        alignItems: "center",
        justifyContent: "center",
        marginStart: 20,
        marginTop: 0
    },
    userInfoMainViewStyle: {
        height: 100,
        width: "90%",
        marginVertical: 10,
        alignSelf: "center",
        flexDirection: "row"
    },
    userImageBackgroundViewStyle: {
        height: 100,
        width: 100,
        borderRadius: 10,
        backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY_SHADE
    },
    userImageViewStyle: {
        height: 100,
        width: 100,
        borderRadius: 10
    },
    userNameTextStyle: {
        marginStart: 20,
        color: ColorConst.THEME_COLOR_GRAY,
        flexDirection: "column"
    },
    bottomHorizontalViewStyle: {
        width: "90%",
        alignSelf: "center",
        height: 2,
        backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY_SHADE,
        marginVertical: 10
    },
    trackingStatusTextStyle: {
        marginHorizontal: 20,
        color: ColorConst.THEME_COLOR_GRAY
    },
    distanceViewStyle: {
        flexDirection: "row",
        marginTop: 15,
        marginStart: 30
    },
    iconViewStyle: {
        width: 15,
        height: 15,
        tintColor: ColorConst.THEME_COLOR_WHITE,
        marginTop: 5
    },
    statusTimeTextStyle: {
        color: ColorConst.TEXT_COLOR_LIGHT,
        textAlign: "center",
        marginStart: 5
    },
    distanceTrackingTimeTextStyle: {
        color: ColorConst.TEXT_COLOR_LIGHT,
        textAlign: "center", ...Font.FONT_SEMIBOLD
    },
    distanceTextStyle: {
        flexDirection: "row",
        marginTop: 15,
        marginStart: 40
    },
    trackingStatusViewStyle: {
        flex: 1,
        flexDirection: "row",
        width: "90%",
        alignSelf: "center",
        padding: 5,
        minHeight: 80
    },
    processIndicatorViewStyle: {
        width: 3,
        alignSelf: "center",
        marginBottom: -10
    },
    trackingStatusViewTitleStyle: {
        color: ColorConst.THEME_COLOR_GREEN,
        ...Font.FONT_SEMIBOLD,
        textAlign: "left"
    },
    trackingStatusStatusTextStyle: {
        flex: 1,
        marginRight: 15,
        marginStart: 30
    },
    accountIconViewStyle: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        alignSelf: "auto"
    },
    accountIconStyle: {
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: ColorConst.THEME_COLOR_GRAY
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
    distanceUnitTextStyle: {
        color: ColorConst.TEXT_COLOR_LIGHT,
        justifyContent: "flex-start"
    },
    similarFlexStyle: {
        flex: 1
    },
    addressTitleTextStyle: {
        position: "absolute",
        left: 20,
        top: 5
    },
    itemTextIndexColor: {
        marginLeft: 30,
        color: ColorConst.THEME_COLOR_BLACK, ...Font.FONT_REGULAR
    },
    actionButtonTextStyle: {
        ...Font.FONT_REGULAR, marginStart: 5
    },
    canecelButtonView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    cardMainViewStyle: {
        width: "100%",
        flexDirection: "row"
    },
    viewWidthStyle: {
        width: "95%"
    },
    cardSubViewStyle: {
        flexDirection: "row",
        flex: 1,
        borderRadius: 20
    },
    addressTextStyle: {
        marginLeft: 35,
        marginTop: 10, ...Font.FONT_REGULAR,
        color: ColorConst.THEME_COLOR_BLACK,
        marginBottom: 10
    },
    iconAndTitleAlignmentStyle: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 5,
        paddingLeft: 5
    },
    addManualPackageExtraStyles: {
        marginLeft: 80,
        width: "75%",
        minHeight: 60,
        marginBottom: 20
    },
    addItemIconStyle: {
        alignItems: "flex-end",
        flex: 1,
        marginRight: 10
    },
    manualItemTextStyle: {
        paddingHorizontal: 32,
        marginRight: 5,
        marginEnd: 5,
        textAlignVertical: "top",
        ...Font.FONT_REGULAR
    },
    newMessageIndicator: {
        position: "absolute",
        top: 0,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: ColorConst.THEME_COLOR_BLUE
    }
});

