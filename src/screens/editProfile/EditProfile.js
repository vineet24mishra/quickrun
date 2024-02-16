import React, { Component } from "react";
import { View, Text, SafeAreaView, StyleSheet, Keyboard } from "react-native";
import ColorConst from "../../styles/colors/ColorConst";
import { CustomHeader } from "../../component/CustomHeader";
import { TextInputComponent } from "../../component/TextInputComponent";
import stringFile from "../../locale/StringEn";
import { TextStyles } from "../../styles/componentStyle/TextStyles";
import { ScrollView } from "react-native-gesture-handler";
import { TextButton } from "../../component/TextButton";
import ToastCollection from "../../utils/ToastCollection";
import { deviceOs } from "../../Context";
import Constants from "../../utils/Constants";
import UserModelStore from "../../store/UserModelStore";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import { Loader } from "../../component/Loader";
import AccessTokenStore from "../../store/AccessTokenStore";

export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName : "",
            email: "",
            keyboardSpace: 0,
            keyboardState: stringFile.KEYBOARD_CLOSED,
            userInfo: {},
            isLoading : false
        };
        
    }

    componentDidMount() {
        UserModelStore.instance.getUserModel().then((user) => {
            this.setState({ userInfo: user });
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
                <CustomHeader
                    title={stringFile.EDIT_PROFILE_TITLE}
                    showBackButton={true}
                    onPress={() => { this.props.navigation.goBack(); }}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode={"interactive"}
                    contentInset={{ bottom: this.state.keyboardState == stringFile.KEYBOARD_OPENED ? 250 : 0 }}>
                    <View style={styles.parentViewStyle}>
                        <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.FIRST_NAME}</Text>
                        <TextInputComponent additionalStyle={styles.additionalStyleTextInput}
                            textChange={(text) => this.setState({ firstName: text })}
                            keyType="next"
                            keyboardType={"default"}
                           placeHolderText={this.state.userInfo.firstName}
                        />

                        <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.LAST_NAME}</Text>
                        <TextInputComponent additionalStyle={styles.additionalStyleTextInput}
                            textChange={(text) => this.setState({ lastName: text })}
                            keyType="next"
                            keyboardType={"default"}
                            placeHolderText={this.state.userInfo.lastName}
                        />

                        <Text style={[TextStyles.textStyleMedium, styles.textStyle]}>{stringFile.EMAIL}</Text>
                        <TextInputComponent additionalStyle={styles.additionalStyleTextInput}
                            textChange={(text) => this.setState({ email: text })}
                            keyType="next"
                            keyboardType={"email-address"}
                            placeHolderText={this.state.userInfo.email}
                        />
                        <TextButton
                            additionalStyle={styles.submitButtonadditionalStyle}
                            buttonTitle={stringFile.SUBMIT}
                            newTextStyle={{ fontSize: 16 }}
                            onButtonPress={() => { this.updateProfileApiCall(); }} />
                    </View>
                </ScrollView>
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
            keyboardState: stringFile.KEYBOARD_CLOSED
        });
    }

    updateProfileApiCall = () => {
        if (this.state.email && !this.state.email.match(Constants.EMAIL_REGEX)) {
            ToastCollection.toastShowAtBottom(stringFile.INVALID_EMAIL);
            return;
        }
        const body = JSON.stringify({
            firstName: this.state.firstName || this.state.userInfo.firstName,
            lastName: this.state.lastName || this.state.userInfo.lastName,
            email: this.state.email|| this.state.userInfo.email
        });
        this.setState({ isLoading: true });
        ApiRequest.putMethodApiCall(Server.EDIT_PROFILE, body, (response, error) => {
            if (response) {
                this.setState({ isLoading: false });
                if (response.success) {
                    AccessTokenStore.instance.saveAccessToken(response.token);
                    AccessTokenStore.instance.setAccessToken(response.token);
                    UserModelStore.instance.persistUserModel(response.user);
                    ToastCollection.toastShowAtBottom(stringFile.UPDATED_SUCCESS);
                    this.props.route.params.updateProfile && this.props.route.params.updateProfile(response.user); 
                    this.props.navigation.goBack();
                } else {
                    ToastCollection.toastShowAtBottom(response.error);
                }
            } else {
                ToastCollection.toastShowAtBottom(error);
            }
        });
    }

}

const styles = StyleSheet.create({
    parentViewStyle : { 
        flex: 1, 
        paddingHorizontal: 50, 
        paddingTop: 100 
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
    additionalStyleTextInput : { 
        marginTop: 5,
         height: 50
    },
    submitButtonadditionalStyle : { 
        width: "50%",
        alignSelf: "center",
        marginTop: 30
     }
});
