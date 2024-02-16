import React, { Component } from "react";
import { View, StyleSheet, Text, Image, SafeAreaView, Keyboard } from "react-native";
import { TextInputComponent } from "../../component/TextInputComponent";
import stringFile from "../../locale/StringEn";
import { TextButton } from "../../component/TextButton";
import ColorConst from "../../styles/colors/ColorConst";
import { TextStyles } from "../../styles/componentStyle/TextStyles";
import { CustomHeader } from "../../component/CustomHeader";
import { TouchableOpacityDoubleClick } from "../../component/PreventDoubleClick";
import ToastCollection from "../../utils/ToastCollection";
import * as Font from "../../assets/fonts/Fonts";

export default class PickAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            houseNumber: this.props.route.params && this.props.route.params.pickupHouseNumber || "",
            apartmentName: this.props.route.params && this.props.route.params.pickupApartmentName || "",
            isComeFromPickedAddress: this.props.route.params && this.props.route.params.isComeFromPickedAddress,
            addressInfo: this.props.route.params && this.props.route.params.addressInfo || "",
            screenName: this.props.route.params && this.props.route.params.nextScreenTitle || "",
            pickAddress: this.props.route.params && this.props.route.params.pickedAddress || "",
            dropAddress: this.props.route.params && this.props.route.params.dropOffAddress || ""
        };
    }
    render() {
        return (
            <SafeAreaView style={styles.mainViewStyle}>
                <CustomHeader
                    title={this.state.screenName}
                    onPress={() => { this.props.navigation.goBack(); }}
                    showBackButton={true}
                />
                <View style={[styles.mainViewStyle, { paddingHorizontal: 50 }]}>
                    <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.HOUSE_NUMBER}</Text>
                    <TextInputComponent additionalStyle={{ marginTop: 5, height: 50 }}
                        refrence={input => this.emailTextInput = input}
                        textChange={(text) => this.setState({ houseNumber: text })}
                        keyboardType="default"
                        keyType="next"
                        autoCapitalize={"words"}
                        setValue={this.state.houseNumber}
                        onSubmitEditing={() => { this.apartmentNameInput.focus(); }} />

                    <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.BUILDING_APARTMENT_NAME}</Text>
                    <TextInputComponent additionalStyle={{ marginTop: 5, height: 50 }}
                        refrence={input => this.apartmentNameInput = input}
                        textChange={(text) => this.setState({ apartmentName: text })}
                        keyboardType="default"
                        setValue={this.state.apartmentName}
                    />

                    <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.PICK_ADDRESS}</Text>
                    <TouchableOpacityDoubleClick style={[styles.addressTextStyle, { marginTop: 5, minHeight: 50, borderRadius: 30, padding: 10 }]}
                        onPress={() => { this.props.navigation.navigate("SearchAddress", { pickAddressFromGoogle: this.pickAddressFromGoogle }); }}
                    >
                        <Text style={[TextStyles.textStyleMedium, styles.addressStyle]}>
                            {this.state.addressInfo.formatted_address}</Text>
                        <Image
                            style={styles.addressBoxRightIconStyle}
                            source={require("../../assets/icons/next.png")} resizeMode={"contain"}/>
                    </TouchableOpacityDoubleClick>

                    <TextButton
                        additionalStyle={{ alignSelf: "center", marginTop: 30 }}
                        buttonTitle={stringFile.PICK_PRODUCT}
                        onButtonPress={() => { this.onPickButtonPress(); }} />

                </View>
            </SafeAreaView>

        );
    }

    onPickButtonPress = () => {
        Keyboard.dismiss();
        if (!this.state.houseNumber) {
            ToastCollection.toastShowAtBottom(stringFile.EMPTY_HOUSE_NUMBER);
            return;
        }
        if (!this.state.apartmentName) {
            ToastCollection.toastShowAtBottom(stringFile.EMPTY_APARTMENT_NAME);
            return;
        }
        if (!this.state.addressInfo) {
            ToastCollection.toastShowAtBottom(stringFile.EMPTY_PICKED_ADDRESS);
            return;
        }
        this.sendAddress();
    }

    sendAddress = () => {
        if (this.state.screenName != stringFile.PICKUP_TEXT && (this.state.pickAddress && this.state.addressInfo
            && this.state.pickAddress.geometry.location.lat == this.state.addressInfo.geometry.location.lat
            && this.state.pickAddress.geometry.location.lng == this.state.addressInfo.geometry.location.lng)) {
            ToastCollection.toastShowAtBottom(stringFile.SAME_ADRESS_ALERT);
            return;
        }
        if (this.state.screenName != stringFile.DROP_TEXT && (this.state.dropAddress && this.state.addressInfo
            && this.state.dropAddress.geometry.location.lat == this.state.addressInfo.geometry.location.lat
            && this.state.dropAddress.geometry.location.lng == this.state.addressInfo.geometry.location.lng)) {
            ToastCollection.toastShowAtBottom(stringFile.SAME_ADRESS_ALERT);
            return;
        }
        if (this.props.route.params && this.props.route.params.pickupAddress) {
            this.props.route.params.pickupAddress(this.state.addressInfo, this.state.houseNumber, this.state.apartmentName);
        } else if (this.props.route.params && this.props.route.params.dropAddress) {
            this.props.route.params.dropAddress(this.state.addressInfo, this.state.houseNumber, this.state.apartmentName);
        }
        this.props.navigation.goBack();
    }

    pickAddressFromGoogle = (address) => {
        this.setState({ addressInfo: address });
    }
}

const styles = StyleSheet.create({
    mainViewStyle: {
        flex: 1,
        backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG
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
    addressBoxRightIconStyle: {
        marginStart: 5,
        alignSelf: "center",
        marginEnd: 10,
        height: 15,
        width: 15
    },
    textStyle: {
        marginTop: 20,
        marginLeft: 15,
        color: ColorConst.THEME_COLOR_BLACK
    },
    addressStyle: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 5,
        ...Font.FONT_REGULAR,
        color: ColorConst.THEME_COLOR_BLACK,
        fontSize: 13
    }
});

