import React, { Component } from "react";
import { View, Text, SafeAreaView, Image, StyleSheet, Keyboard, KeyboardAvoidingView } from "react-native";
import ColorConst from "../../styles/colors/ColorConst";
import { CustomHeader } from "../../component/CustomHeader";
import { TextInputComponent } from "../../component/TextInputComponent";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { FONT_REGULAR } from "../../assets/fonts/Fonts";
import moment from "moment";
import SocketManager from "../../socket/SocketManager";
import { connect } from "react-redux";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import { Loader } from "../../component/Loader";
import Constants from "../../utils/Constants";
import BookingDetailsStore from "../../store/BookingDetailsStore";
import { isNewMessageAvailable } from "../../redux/actions/Action";
import StringEn from "../../locale/StringEn";
import { deviceOs } from "../../Context";
import AccessTokenStore from "../../store/AccessTokenStore";
import ToastCollection from "../../utils/ToastCollection";
class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: "",
            messageList: [],
            bookingID: this.props.route.params && this.props.route.params.bookingID || "",
            userId: this.props.route.params && this.props.route.params.userId || "",
            runnerDetail: this.props.route.params && this.props.route.params.runnerDetails || {},
            keyboardState: StringEn.KEYBOARD_CLOSED,
            isComeFromBookingDetail: this.props.route.params && this.props.route.params.isComeFromBookingDetail,
            flatListMarginBottom : 60
        };
    }

    componentDidMount() {
        this.props.isNewMessageAvailable(false);
        AccessTokenStore.instance.setCurrentScreen(true);
        this.getMessageApiCall();
        if (deviceOs == Constants.PLATFORM_IOS) {
            this.keyboardDidShowListener = Keyboard.addListener("keyboardWillShow", this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener("keyboardWillHide", this.keyboardDidHide);
        } else {
            this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.keyboardDidHide);
        }
        BookingDetailsStore.instance.retrieveBookedRunnerDetails().then((bookingInfo) => {
            this.setState({ runnerDetail: bookingInfo.runner });
        });
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        AccessTokenStore.instance.setCurrentScreen(false);
    }

    render() {
        const runnerFullName = this.state.runnerDetail.firstName + " " + this.state.runnerDetail.lastName;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY }}>
                <CustomHeader
                    showBackButton={true}
                    title={runnerFullName}
                    onPress={() => { this.props.navigation.goBack(); }}
                />
                {deviceOs == Constants.PLATFORM_IOS
                    ? <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
                        {this.renderContentView()}
                    </KeyboardAvoidingView> : this.renderContentView()}
                {this.state.isLoading ? (
                    <Loader isLoading={true} />
                ) : null}
            </SafeAreaView>
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.newMessageArrivedData !== this.props.newMessageArrivedData) {
            const newMessage = [...this.state.messageList, this.props.newMessageArrivedData];
            this.setState({ messageList: newMessage });
        }
    }

    keyboardDidShow = () => {
        this.setState({
            keyboardState: StringEn.KEYBOARD_OPENED,
            flatListMarginBottom : deviceOs == Constants.PLATFORM_IOS ? 120 : 60
        });
        setTimeout(() => {
            this.refs.messageListRef.scrollToEnd({ animated: true });
        }, 1000);
    }

    keyboardDidHide = () => {
        this.setState({
            keyboardState: StringEn.KEYBOARD_CLOSED,
            flatListMarginBottom : 60
        });
    }

    renderContentView = () => {
        return (
            <View style={styles.container}>

                <FlatList
                    ref="messageListRef"
                    style={{ flex: 1, marginBottom: !this.state.isComeFromBookingDetail ? this.state.flatListMarginBottom : 0 }}
                    data={this.state.messageList}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => this.state.messageList.length >= 0 && this.refs.messageListRef.scrollToEnd()}
                    ListEmptyComponent={() => !this.state.isLoading && this.showNoDataPlaceholder()}
                />
                {!this.state.isComeFromBookingDetail && <View style={[styles.messageBoxViewStyle,
                { marginBottom: deviceOs == Constants.PLATFORM_IOS && this.state.keyboardState == StringEn.KEYBOARD_OPENED ? 45 : 0 }]}>
                    <TextInputComponent
                        additionalStyle={styles.textInputAdditionalStyle}
                        placeHolderText={StringEn.MESSAGE_PLACEHOLDER}
                        textChange={(text) => this.setState({ message: text })}
                        keyboardType="default"
                        keyType="next"
                        multiline={true}
                        setValue={this.state.message}
                    />
                    <TouchableOpacity
                        onPress={() => { this.onPressSend(); }}>
                        <Image
                            style={styles.sendIconStyle}
                            source={require("../../assets/icons/send.png")}
                        />
                    </TouchableOpacity>
                </View>}
            </View>
        );
    }

    renderItem = ({ item }) => {
        const isSender = this.state.runnerDetail._id !== item.messageBy;
        const time = this.dateTimeFormat(item.time);
        return (
            <View style={{ width: "100%", marginVertical: 5 }}>
                <View style={[styles.messageCellStyle, isSender ? styles.sentMessageCellStyle : styles.receivedMessageCellStyle]}>
                    <Text style={{
                        fontSize: 14, ...FONT_REGULAR,
                        color: isSender ? ColorConst.THEME_COLOR_BLACK : ColorConst.THEME_COLOR_WHITE
                    }}>{item.message}</Text>
                </View>
                <Text style={[styles.dateTextStyle, { alignSelf: isSender ? "flex-end" : "flex-start", marginRight: isSender ? 20 : 0, marginLeft: 20 }]}>
                    {time}
                </Text>
            </View>
        );
    }

    showNoDataPlaceholder = () => {
        return (
            <View style = {styles.noDataPlaceholderViewStyle}>
                <Image
                    style={styles.noDataIconStyle}
                    source={require("../../assets/icons/noData.png")}
                />
                <Text style={[styles.dateTextStyle, { fontSize: 20, color: ColorConst.THEME_COLOR_GRAY }]}>{StringEn.NO_DATA_PLACEHOLDER}</Text>
            </View>
        );
    }

    onPressSend = () => {
        if (this.state.message == "") {
            return;
        }
        SocketManager.instance.emitSendMessage(this.state.bookingID, this.state.message, this.state.userId);
        this.setState({ message: "" });
    }

    dateTimeFormat = (epoch) => {
        return moment.unix(epoch / 1000).utcOffset(moment().utcOffset()).format(Constants.TIME_FORMAT_CHAT);
    }

    getMessageApiCall = () => {
        this.setState({ isLoading: true });
        ApiRequest.getMethodApiCall(Server.GET_BOOKING_CHAT_LIST + this.state.bookingID, (response, error) => {
            if (response) {
                this.setState({ isLoading: false });
                if (response.success) {
                    this.setState({ messageList: response.chat });
                }
            } 
        });
    }

}


const mapStateToProps = (state) => {
    return {
        newMessageArrivedData: state.newMessageAction.newMessageData
    };
};
export default connect(mapStateToProps, {isNewMessageAvailable})(ChatScreen);


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messageBoxViewStyle: {
        width: "95%",
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: ColorConst.THEME_COLOR_WHITE,
        borderRadius: 30,
        alignContent: "center",
        minHeight: 50,
        shadowOpacity: 0.15,
        elevation: 2
    },
    textInputAdditionalStyle: {
        width: "80%",
        borderWidth: 0, maxHeight: 100
    },
    sendIconStyle: {
        width: 36,
        height: 36,
        tintColor: ColorConst.THEME_COLOR_BLUE
    },
    messageCellStyle: {
        flex: 1,
        padding: 10,
        maxWidth: "70%",
        borderRadius: 20,
        paddingHorizontal: 12,
        shadowOpacity: 0.15,
        minHeight: 50,
        backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG,
        elevation: 2
    },
    sentMessageCellStyle: {
        alignSelf: "flex-end",
        borderBottomRightRadius: 0,
        backgroundColor: ColorConst.THEME_COLOR_WHITE,
        marginRight: 20
    },
    receivedMessageCellStyle: {
        alignSelf: "flex-start",
        borderBottomLeftRadius: 0,
        backgroundColor: ColorConst.THEME_COLOR_BLUE,
        marginLeft: 20
    },
    dateTextStyle: {
        fontSize: 12, ...FONT_REGULAR, marginTop: 5
    },
    noDataPlaceholderViewStyle : {
        flex: 1, 
        justifyContent : "center", 
        alignItems : "center", 
        marginTop: 20
    },
    noDataIconStyle : {
        height: 36, 
        width: 36, 
        tintColor: ColorConst.THEME_COLOR_GRAY
    }
});
