import React, { Component } from "react";
import {
  SafeAreaView, StyleSheet, Image, View, Text, Dimensions, Platform,
  Linking, ScrollView, AppState, Keyboard
} from "react-native";
import stringFile from "../../locale/StringEn";
import ColorConst from "../../styles/colors/ColorConst";
import * as Font from "../../assets/fonts/Fonts";
import MapView, { PROVIDER_GOOGLE, Marker, ProviderPropType } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Constants from "../../utils/Constants";
import SocketManager from "../../socket/SocketManager";
import UserModal from "../../store/UserModelStore";
import { connect } from "react-redux";
import ToastCollection from "../../utils/ToastCollection";
import DialogUtils from "../../utils/DialogUtils";
import BookingDetailsStore from "../../store/BookingDetailsStore";
import {
  PickUpAddressCard,
  SelectPackageCard,
  AmountCalculationCard,
  UserInfoView,
  DistanceAndPickupInfoView,
  TrackingStatusView,
  InstrutionTextBoxCard
} from "./CustomViews";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import { Loader } from "../../component/Loader";
import moment from "moment";
import { deviceOs } from "../../Context";
import AsyncStorage from "@react-native-community/async-storage";
import AccessTokenStore from "../../store/AccessTokenStore";
import NotificationReceiver from "../../utils/NotificationReceiver";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextButton } from "../../component/TextButton";
import isEqual from "../../utils/isEqual";
import { acceptedBookignAction } from "../../redux/actions/Action";
const { width, height } = Dimensions.get("window");
const LONGITUDE_DELTA = Constants.LATITUDE_DELTA * width / height;
let animationTimeout;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      pickupAddress: "",
      dropAddress: "",
      selectedProduct: [],
      pickupHouseNumber: "",
      pickupApartmentName: "",
      dropOffHouseNumber: "",
      dropOffApartmentName: "",
      packageDetailItem: "",
      manualItemText: "",
      pickUpLatitude: "",
      pickUpLongitude: "",
      dropLatitude: "",
      dropLongitude: "",
      region: {
        latitude: Constants.LATITUDE,
        longitude: Constants.LONGITUDE,
        latitudeDelta: Constants.LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      userId: undefined,
      isShowMapView: BookingDetailsStore.instance.getIsBookingAvailabel(),
      estimatedAmount: "",
      isLoading: false,
      acceptedRunnersDetails: {},
      bookingID: undefined,
      bookingDetails: {},
      serviceStartTime: "",
      reqReceivedAndConfirmTime: "",
      reqReceivedAndConfirmTimeMeridian: "",
      serviceStartTimeMeridian: "",
      serviceEndTime: "",
      serviceEndTimeMeridian: "",
      instruction: "",
      isDataGetFromApi: false,
      deviceToken: AccessTokenStore.instance.getDeviceToken() || "",
      defaultRating: 2,
      maxRating: 5,
      keyboardSpace: 0,
      runnersLocationInfo: [],
      showNoRunnerToast: false,
      newMessageReceived: false,
      isBookingCompleted: BookingDetailsStore.instance.getIsBookingCompleted(),
      currentBookingId: BookingDetailsStore.instance.getBookingId(),
      totalDistance: "",
      isConnection: true
    };
    BookingDetailsStore.instance.retrieveCurrentBookingDetail().then((data) => {
      if (data) { 
        // this.setState({ bookingDetails : data, acceptedRunnersDetails : data });
        if (data.status == Constants.BOOKING_STATUS_ACCEPTED) {
          this.bookingAccepted(data);
        } else if (data.status == Constants.BOOKING_STATUS_STARTED) {
          this.bookingStarted(data);
        }
      }
      console.log("CUrrentBokingData----->>>>", data);
    });
    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
    UserModal.instance.getUserModel().then((user) => {
      this.setState({ userId: user._id }, () => {
      });
      SocketManager.instance.initSocket(user._id);
    });
    this.notif = new NotificationReceiver();
  }

  componentDidMount() {
    if (this.state.isBookingCompleted && this.state.currentBookingId) {
      this.runnersDetails(this.state.currentBookingId);
    }
    Keyboard.addListener("keyboardWillShow", this.updateKeyboardSpace);
    Keyboard.addListener("keyboardWillHide", this.resetKeyboardSpace);
    if (this.state.deviceToken) {
      this.updateDeviceToken(this.state.deviceToken);
    } else {
      AsyncStorage.getItem(Constants.DEVICE_TOKEN).then((deviceToken) => {
        this.updateDeviceToken(deviceToken);
      });
    }
  }

  componentWillUnmount() {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }
    Keyboard.removeListener("keyboardWillShow");
    Keyboard.removeListener("keyboardWillHide");
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG }}>
        {this.state.isShowMapView ? this.showTrackingStatus()
          : <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={"interactive"}
            contentInset={{ bottom: this.state.keyboardSpace }}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.packageDetailsStyle}>{stringFile.HOME_SCREEN_PACKAGE_DETAILS}</Text>
            {/* <Text>{"Connection Status " + this.state.isConnection}</Text> */}
            <PickUpAddressCard
              onPress={() => {
                this.props.navigation.navigate("PickAddress", {
                  pickupAddress: this.pickupAddress,
                  pickupHouseNumber: this.state.pickupHouseNumber,
                  pickupApartmentName: this.state.pickupApartmentName,
                  addressInfo: this.state.pickupAddress,
                  nextScreenTitle: stringFile.PICKUP_TEXT,
                  pickedAddress: this.state.pickupAddress,
                  dropOffAddress: this.state.dropAddress
                });
              }}
              address={this.state.pickupAddress}
              title={stringFile.PICK_ADDRESS_TITLE}
              icon1={require("../../assets/icons/pickup_navigator.png")}
              icon2={require("../../assets/icons/search.png")}
              apartmentName={this.state.pickupApartmentName}
              houseNumber={this.state.pickupHouseNumber}
            />
            <PickUpAddressCard
              onPress={() => {
                this.state.pickupAddress && this.props.navigation.navigate("PickAddress", {
                  dropAddress: this.dropAddress,
                  pickupHouseNumber: this.state.dropOffHouseNumber,
                  pickupApartmentName: this.state.dropOffApartmentName,
                  addressInfo: this.state.dropAddress,
                  nextScreenTitle: stringFile.DROP_TEXT,
                  pickedAddress: this.state.pickupAddress
                });
              }}
              address={this.state.dropAddress}
              title={stringFile.DROP_TEXT}
              icon1={require("../../assets/icons/drop_navigator.png")}
              icon2={require("../../assets/icons/search.png")}
              apartmentName={this.state.dropOffApartmentName}
              houseNumber={this.state.dropOffHouseNumber}
              isDisableTouch={this.state.pickupAddress ? false : true}
              backgroundColor={this.state.pickupAddress
                ? ColorConst.THEME_COLOR_WHITE : ColorConst.THEME_COLOR_LIGHT_GRAY}
            />
            <SelectPackageCard
              title={stringFile.PACKAGE_TEXT}
              onPress={() => { this.state.dropAddress && this.props.navigation.navigate("ProductList", { selectedProduct: this.selectedProduct, selectedProductList: this.state.selectedProduct }); }}
              onPressIcon={() => { this.state.dropAddress && this.props.navigation.navigate("ProductList", { selectedProduct: this.selectedProduct, selectedProductList: this.state.selectedProduct }); }}
              dropAddress={this.state.dropAddress}
              selectedProduct={this.state.selectedProduct}
              pickupAddress={this.state.pickupAddress}
              manualItem={this.state.manualItemText}
              onPressRemoveItem={this.removeItemFromlist}
              showIndicator={true}
              showRemoveIcon={true}
              showNextIcon={true}
            />
            <InstrutionTextBoxCard
              cardTitle={stringFile.TYPE_PACKAGE_TEXT}
              address={this.state.dropAddress}
              icon1={require("../../assets/icons/ink.png")}
              icon2={require("../../assets/icons/add.png")}
              onChangeText={(text) => this.setState({ packageDetailItem: text })}
              keyType="done"
              value={this.state.packageDetailItem}
              onPressAddItem={() => { this.addPackageToList(); }}
              backgroundColor={this.state.dropAddress ? ColorConst.THEME_COLOR_WHITE : ColorConst.THEME_COLOR_LIGHT_GRAY}
            />
            <InstrutionTextBoxCard
              cardTitle={stringFile.SHIPMENT_INSTRUCTION}
              icon1={require("../../assets/icons/ink.png")}
              keyType="done"
              placeholder={stringFile.PRODUCT_INSTRUCTION}
              onChangeText={(text) => this.setState({ instruction: text })}
              selectionColor={ColorConst.THEME_COLOR_GRAY}
              editable={true}
              backgroundColor={ColorConst.THEME_COLOR_WHITE}
              value={this.state.instruction}
            />
            <AmountCalculationCard
              onConfirmPickupPress={() => { this.onConfirmPickupPress(); }}
              onQwiikRunClick={this.onQwiikRunClick}
              estimatedAmount={this.state.estimatedAmount}
            />
          </ScrollView>
        }
        {this.state.isLoading ? (
          <Loader isLoading={true} />
        ) : null}
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.state.bookingID && this.props.newMessageInfo != this.state.newMessageReceived) {
      this.setState({ newMessageReceived: this.props.newMessageInfo });
    }
    if (this.state.isShowMapView) {
      this.updateRunnersLocation(prevProps, this.props);
    }
    if (this.props && this.state.isConnection != this.props.networkConnectionState) {
      if (this.props.networkConnectionState == true && !this.state.isBookingCompleted && this.state.bookingID) {
        this.getBookingDetailsApiCall(true);
      } else if (this.props.networkConnectionState == true && this.state.isBookingCompleted && this.state.currentBookingId) {
        this.runnersDetails(this.state.currentBookingId);
      } else if (this.props.networkConnectionState == true) {
        this.updateDeviceToken(this.state.deviceToken);
      }
      this.setState({ isConnection: this.props.networkConnectionState });
    }
    // if (deviceOs == Constants.PLATFORM_ANDROID) {
    //   this.retrieveNotificationDataAndroid(prevProps);
    // }
    // else if (deviceOs == Constants.PLATFORM_IOS && this.props.acceptedBookingDetails.acceptedBookingData) {
    //   this.retrieveNotificationDataIos(prevProps);
    // }
    this.retrieveNotificationDataAndroid(prevProps);
  }

  updateKeyboardSpace(frames) {
    const coordinatesHeight = frames.endCoordinates.height;
    const keyboardSpace = (this.props.viewIsInsideTabBar) ? coordinatesHeight - 49 : coordinatesHeight;
    this.setState({
      keyboardSpace: keyboardSpace
    });
  }

  resetKeyboardSpace() {
    this.setState({
      keyboardSpace: 0
    });
  }

  UpdateRating = (key) => {
    this.setState({ defaultRating: key });
  }

  showStarRatingView = () => {
    const starRatingBar = [];
    for (var i = 1; i <= this.state.maxRating; i++) {
      starRatingBar.push(
        <TouchableOpacity
          activeOpacity={0.7}
          key={i}
          onPress={this.UpdateRating.bind(this, i)}>
          <Image
            style={i <= this.state.defaultRating
              ? styles.selectedStarImageStyle
              : styles.unselecetdStarImageStyle}
            source={
              i <= this.state.defaultRating
                ? require("../../assets/icons/selectedStar.png")
                : require("../../assets/icons/unSelectedStar.png")
            }
          />
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.serviceRatingViewStyle}>
        <Text style={[styles.feedbackTextStyle, { fontSize: 16 }]}>{stringFile.FEEDBACK_TEXT}</Text>
        <Text style={[styles.feedbackTextStyle, { fontSize: 14 }]}>{stringFile.PLEASE_RATE_US}</Text>
        <View style={{ flexDirection: "row", marginBottom: 20, marginTop: 40 }}>
          {starRatingBar}
        </View>
        <TextButton
          buttonTitle={stringFile.SUBMIT}
          newTextStyle={{ fontSize: 16 }}
          onButtonPress={() => { }} />
      </View>
    );
  }

  getBookingDetailsApiCall = (showMap) => {
    console.log("APiCalled---->>>>");
    this.setState({ isLoading: true });
    ApiRequest.getMethodApiCall(Server.GET_BOOKING_DETAILS, (response, error) => {
      if (response) {
        this.setState({ isLoading: false });
        if (response.success) {
          BookingDetailsStore.instance.persistCurrentBookinData(response.booking);
          console.log("Booking-Response--->>", response);
          if (!response.booking) {
            this.setState({ isShowMapView: showMap });
            BookingDetailsStore.instance.deleteAllDetails();
          } else if (response.booking && response.booking.status == Constants.BOOKING_STATUS_ACCEPTED) {
            this.bookingAccepted(response.booking);
          } else if (response.booking && response.booking.status == Constants.BOOKING_STATUS_STARTED) {
            this.bookingStarted(response.booking);
          }
        } else {
          console.log(error);
        }
      }
    });
  }

  bookingAccepted = (bookingDetails) => {
    const reqAcceptTime = this.timeFormat(bookingDetails.requestedAt);
    const meridianTime = this.meridianFormat(meridianTime);
    this.setState({
      isDataGetFromApi: true,
      acceptedRunnersDetails: bookingDetails,
      bookingDetails: bookingDetails,
      bookingID: bookingDetails._id,
      isLoading: false,
      isShowMapView: true,
      reqReceivedAndConfirmTime: reqAcceptTime,
      reqReceivedAndConfirmTimeMeridian: meridianTime,
      serviceStartTime: bookingDetails.startedAt
    });
    BookingDetailsStore.instance.persistBookingId(bookingDetails._id);
    BookingDetailsStore.instance.persistBookingAcceptTime({ reqAcceptTime: reqAcceptTime, requestMeridian: meridianTime });
  }

  bookingStarted = (bookingDetails) => {
    const reqAcceptTime = this.timeFormat(bookingDetails.requestedAt);
    const serviceStartTime = this.timeFormat(bookingDetails.startedAt);
    const meridianTime = this.meridianFormat(meridianTime);
    this.setState({
      isDataGetFromApi: true,
      acceptedRunnersDetails: bookingDetails,
      bookingDetails: bookingDetails,
      bookingID: bookingDetails._id,
      isLoading: false,
      isShowMapView: true,
      reqReceivedAndConfirmTime: reqAcceptTime,
      reqReceivedAndConfirmTimeMeridian: meridianTime,
      serviceStartTime: serviceStartTime
    });
    BookingDetailsStore.instance.persistBookingId(this.state.bookingID);
    BookingDetailsStore.instance.persistBookingAcceptTime({ reqAcceptTime: reqAcceptTime, requestMeridian: meridianTime });
    BookingDetailsStore.instance.persistBookingStartTime({ startTime: serviceStartTime, startMeridian: meridianTime });
  }

  bookingCompleted = (bookingDetails) => {
    const reqAcceptTime = this.timeFormat(bookingDetails.requestedAt);
    const serviceStartTime = this.timeFormat(bookingDetails.startedAt);
    const serviceEndTime = this.timeFormat(bookingDetails.endedAt);
    const meridianTime = this.meridianFormat(meridianTime);
    this.setState({
      isDataGetFromApi: true,
      acceptedRunnersDetails: bookingDetails,
      bookingDetails: bookingDetails,
      bookingID: undefined,
      isLoading: false,
      isShowMapView: true,
      reqReceivedAndConfirmTime: reqAcceptTime,
      reqReceivedAndConfirmTimeMeridian: meridianTime,
      serviceStartTime: serviceStartTime,
      serviceStartTimeMeridian: meridianTime,
      serviceEndTime: serviceEndTime,
      serviceEndTimeMeridian: meridianTime,
      currentBookingId: "",
      isBookingCompleted: false
    });
  }

  retrieveBookingDetailStore = () => {
    BookingDetailsStore.instance.retrieveBookedRunnerDetails().then((acceptedBookingInfo) => {
      if (acceptedBookingInfo) {
        var receivedTime = moment(acceptedBookingInfo.booking.createdAt).format(Constants.MERIDIEN_TIME_FORMAT);
        this.setState({
          bookingDetails: acceptedBookingInfo, isShowMapView: acceptedBookingInfo ? true : false,
          reqReceivedAndConfirmTime: moment(acceptedBookingInfo.booking.createdAt).format(Constants.TIME_FORMAT),
          reqReceivedAndConfirmTimeMeridian: moment(receivedTime).localeData()
            .meridiem(receivedTime)
        });
      }
    });
    BookingDetailsStore.instance.retrieveBookingId().then((bookingId) => {
      if (bookingId) {
        this.setState({ bookingID: bookingId });
      }
    });
    BookingDetailsStore.instance.retrieveAcceptTime().then((acceptTimeInfo) => {
      if (acceptTimeInfo) {
        this.setState({
          reqReceivedAndConfirmTime: acceptTimeInfo.reqAcceptTime,
          reqReceivedAndConfirmTimeMeridian: acceptTimeInfo.requestMeridian
        });
      }
    });

    BookingDetailsStore.instance.retrieveStartTime().then((startTimeInfo) => {
      if (startTimeInfo) {
        this.setState({
          serviceStartTime: startTimeInfo.startTime,
          serviceStartTimeMeridian: startTimeInfo.startMeridian
        });
      }
    });

    BookingDetailsStore.instance.retrieveServiceEndTime().then((endTimeInfo) => {
      if (endTimeInfo) {
        this.setState({
          serviceEndTime: endTimeInfo.serviceEndTime,
          serviceEndTimeMeridian: endTimeInfo.serviceEndMeridian
        });
      }
    });
  }

  updateDeviceToken = (deviceToken) => {
    const body = JSON.stringify({
      deviceToken: deviceToken,
      deviceType: deviceOs
    });
    ApiRequest.putMethodApiCall(Server.UPDATE_DEVICE_TOKEN, body, (response) => {
      console.log("Response--->>>>", response);
    });
  }

  updateRunnersLocation = (prevProps, currentProps) => {
    if (this.state.runnersLocationInfo.length == 0 && currentProps.runnerLocation && currentProps.runnerLocation.userId) {
      var newArray = [...this.state.runnersLocationInfo, currentProps.runnerLocation];
      this.setState({ runnersLocationInfo: newArray });
    } else if (this.state.runnersLocationInfo && currentProps.runnerLocation && currentProps.runnerLocation.location) {
      if (!isEqual(currentProps.runnerLocation, prevProps.runnerLocation)) {
        let runner = this.state.runnersLocationInfo;
        runner = [...this.state.runnersLocationInfo, this.props.runnerLocation];
        this.setState({ runnersLocationInfo: runner });
      }
    }
  }

  retrieveNotificationDataAndroid = (prevProps) => {
    prevProps = this.props;
    const isBookingAvailable = prevProps.acceptedBookingDetails && prevProps.acceptedBookingDetails.acceptedBookingData
      && !this.state.serviceStartTime;
    const isServiceStarted = this.props.acceptedBookingDetails.acceptedBookingData
      && this.props.acceptedBookingDetails.acceptedBookingData.bookingId == this.state.bookingID
      && this.props.acceptedBookingDetails.acceptedBookingData.status == Constants.BOOKING_STATUS_STARTED
      && !this.state.serviceStartTime;
    const isBookingCompleted = this.props.acceptedBookingDetails.acceptedBookingData
      && this.props.acceptedBookingDetails.acceptedBookingData.bookingId == this.state.bookingID
      && this.props.acceptedBookingDetails.acceptedBookingData.status
      == Constants.BOOKING_STATUS_COMPLETED && !this.state.serviceEndTime;
    if (isBookingAvailable) {
      var newNotificationDetails = this.props.acceptedBookingDetails.acceptedBookingData;
      var newMessageId = newNotificationDetails && newNotificationDetails.bookingId;
      var bookingId = prevProps.acceptedBookingDetails.acceptedBookingData
        && prevProps.acceptedBookingDetails.acceptedBookingData.bookingId;

      const isBookingReqAccepted = newMessageId != this.state.bookingID
        && this.props.acceptedBookingDetails.acceptedBookingData
        && this.props.acceptedBookingDetails.acceptedBookingData.status == Constants.BOOKING_STATUS_ACCEPTED;

      const isBookingCancelled = this.state.bookingDetails && this.state.isShowMapView && newMessageId == this.state.bookingID
        && newNotificationDetails && newNotificationDetails.status == Constants.BOOKING_STATUS_CANCELLED && !this.state.serviceStartTime;

      if (isBookingReqAccepted) {
        this.setState({ bookingAccepted : true });
        this.acceptedRequestAndroid(prevProps, bookingId);
        this.getBookingDetailsApiCall(true);
      }
      else if (isServiceStarted) {
        this.updateRunnersBookingDetails(newNotificationDetails.startedAt);
        this.getBookingDetailsApiCall(true);
      }
      else if (isBookingCancelled) {
        this.cancelledRequest();
      }
    } else if (isServiceStarted) {
      const bookingStartTime = this.props.acceptedBookingDetails.acceptedBookingData.startedAt;
      this.updateRunnersBookingDetails(bookingStartTime);
      this.getBookingDetailsApiCall(true);
    }
    else if (isBookingCompleted) {
      const completedBookingInfo = this.props.acceptedBookingDetails.acceptedBookingData;
      this.serviceCompleted(completedBookingInfo.endedAt, completedBookingInfo.bookingId);
      this.getBookingDetailsApiCall(true);
    }
  }

  retrieveNotificationDataIos = (prevProps) => {

    const isBookingDetailsAvailable = prevProps.acceptedBookingDetails && prevProps.acceptedBookingDetails.acceptedBookingData
      && prevProps.acceptedBookingDetails.acceptedBookingData.message && !this.state.serviceStartTime;

    const isServiceStarted = this.props.acceptedBookingDetails.acceptedBookingData.message.body.bookingId == this.state.bookingID
      && this.props.acceptedBookingDetails.acceptedBookingData.message.body.status == Constants.BOOKING_STATUS_STARTED
      && !this.state.serviceStartTime;

    const isBookingCompleted = this.props.acceptedBookingDetails.acceptedBookingData.message.body
      && prevProps.acceptedBookingDetails.acceptedBookingData.message.body !== this.props.acceptedBookingDetails.acceptedBookingData.message.body
      && this.props.acceptedBookingDetails.acceptedBookingData.message.body.bookingId == this.state.bookingID
      && this.props.acceptedBookingDetails.acceptedBookingData.message.body.status == Constants.BOOKING_STATUS_COMPLETED;

    if (isBookingDetailsAvailable) {
      var message = prevProps.acceptedBookingDetails.acceptedBookingData.message;
      const messageId = message.body.bookingId;

      const isBookingReqAccepted = messageId != this.state.bookingID
        && this.props.acceptedBookingDetails.acceptedBookingData.message.body.status == Constants.BOOKING_STATUS_ACCEPTED;

      const isBookingCancelled = this.state.bookingDetails && this.state.isShowMapView
        && this.props.acceptedBookingDetails.acceptedBookingData.message.body.bookingId == this.state.bookingID
        && this.props.acceptedBookingDetails.acceptedBookingData.message.body.status == Constants.BOOKING_STATUS_CANCELLED
        && !this.state.serviceStartTime;

      if (isBookingReqAccepted) {
        this.acceptedRequestIos(prevProps, messageId);
      }
      else if (isServiceStarted) {
        this.updateRunnersBookingDetails(this.props.acceptedBookingDetails.acceptedBookingData.message.body.startedAt);
      }
      else if (isBookingCancelled) {
        this.cancelledRequest();
      }
    } else if (isServiceStarted) {
      this.updateRunnersBookingDetails(this.props.acceptedBookingDetails.acceptedBookingData.message.body.startedAt);
    }
    else if (isBookingCompleted) {
      const completedBookingInfo = this.props.acceptedBookingDetails.acceptedBookingData.message.body;
      this.serviceCompleted(completedBookingInfo.endedAt);
    }
  }

  acceptedRequestAndroid = (prevProps, bookingId) => {
    const reqAcceptTime = this.timeFormat(prevProps.acceptedBookingDetails.acceptedBookingData.acceptedAt);
    const meridianTime = this.meridianFormat(meridianTime);
    this.setState({
      acceptedRunnersDetails: prevProps.acceptedBookingDetails.acceptedBookingData,
      bookingID: bookingId,
      isLoading: false,
      reqReceivedAndConfirmTime: reqAcceptTime,
      reqReceivedAndConfirmTimeMeridian: meridianTime,
      isDataGetFromApi: false
    }, () => {
      this.runnersDetails(this.state.bookingID);
      this.getBookingDetailsApiCall(true);
    });
    BookingDetailsStore.instance.persistBookingAcceptTime({ reqAcceptTime: reqAcceptTime, requestMeridian: meridianTime });
  }

  timeFormat = (epoch) => {
    return moment.unix(epoch / 1000).utcOffset(moment().utcOffset()).format(Constants.TIME_FORMAT);
  }
  meridianFormat = (time) => {
    const hours = moment(time).format(Constants.MERIDIEN_TIME_FORMAT);
    return moment(hours).localeData().meridiem(hours);
  }

  acceptedRequestIos = (prevProps, messageId) => {
    const reqAcceptTime = this.timeFormat(prevProps.acceptedBookingDetails.acceptedBookingData.message.body.acceptedAt);
    const meridianTime = this.meridianFormat(meridianTime);
    prevProps.acceptedBookingDetails.acceptedBookingData.message && this.setState({
      acceptedRunnersDetails: prevProps.acceptedBookingDetails.acceptedBookingData,
      bookingID: messageId,
      reqReceivedAndConfirmTime: reqAcceptTime,
      reqReceivedAndConfirmTimeMeridian: meridianTime,
      isDataGetFromApi: false
    }, () => {
      BookingDetailsStore.instance.persistBookingId(this.state.bookingID);
      this.runnersDetails(this.state.bookingID);
    });
    BookingDetailsStore.instance.persistBookingAcceptTime({ reqAcceptTime: reqAcceptTime, requestMeridian: meridianTime });
  }

  cancelledRequest = () => {
    this.setState({
      acceptedRunnersDetails: {},
      bookingID: undefined,
      isLoading: false,
      isShowMapView: false,
      bookingDetails: {},
      showNoRunnerToast: true,
      currentBookingId: ""
    });
    this.bookingCancelled();
  }

  updateRunnersBookingDetails = (startTime) => {
    const updateStartTime = this.timeFormat(startTime);
    const meridianStartTime = this.meridianFormat(meridianStartTime);
    this.setState({
      serviceStartTime: updateStartTime,
      serviceStartTimeMeridian: meridianStartTime
    });
    BookingDetailsStore.instance.persistBookingStartTime({ startTime: updateStartTime, startMeridian: meridianStartTime });
    this.map.fitToSuppliedMarkers(Constants.markerIDs, true);
  }

  serviceCompleted = (deliveryTime, bookingID) => {
    this.runnersDetails(bookingID);
    const DeliveredTime = this.timeFormat(deliveryTime);
    const meridianDelivered = this.meridianFormat(meridianDelivered);
    this.setState({
      bookingID: undefined,
      serviceEndTime: DeliveredTime,
      serviceEndTimeMeridian: meridianDelivered,
      showNoRunnerToast: true
    });
    BookingDetailsStore.instance.persistBookingDeliveredTime({ serviceEndTime: DeliveredTime, serviceEndMeridian: meridianDelivered });
  }

  bookingCancelled = () => {
    this.clearSavedBookingData();
    this.cancelledBookingInfoPopup();
  }

  runnersDetails = (bookingId) => {
    const url = Server.RUNNERS_DETAILS + bookingId;
    this.setState({ isLoading: true });
    ApiRequest.getMethodApiCall(url, (response) => {
      if (response) {
        this.setState({ isLoading: false });
        if (response.success) {
          if (response.booking.status == Constants.BOOKING_STATUS_ACCEPTED) {
            this.setState({
              isShowMapView: true, bookingDetails: response, isDataGetFromApi: false
            });
            BookingDetailsStore.instance.persistBookingId(bookingId);
            BookingDetailsStore.instance.persistBookedRunnerDetails(response.booking);
          } else if (response.booking.status == Constants.BOOKING_STATUS_COMPLETED) {
            BookingDetailsStore.instance.setIsBookingCompleted(false);
            this.bookingCompleted(response.booking);
          }
          this.map.fitToSuppliedMarkers(Constants.markerIDs, true);
        }
      }
    });
  }

  addPackageToList = () => {
    if (this.state.packageDetailItem.length > 0) {
      var nwArray = [...this.state.selectedProduct, this.state.packageDetailItem];
      this.setState({ selectedProduct: nwArray, packageDetailItem: "" });
    }
  }

  removeItemFromlist = (index) => {
    this.setState({
      selectedProduct: this.state.selectedProduct.filter((_, i) => i !== index)
    });
  }

  selectedProduct = (product) => {
    this.setState({ selectedProduct: product });
  }

  pickupAddress = (address, houseNumber, apartmentName) => {
    this.setState({
      pickupAddress: address, pickupHouseNumber: houseNumber, pickupApartmentName: apartmentName,
      pickUpLatitude: address.geometry.location.lat, pickUpLongitude: address.geometry.location.lng
    }, () => {
      if (address.geometry.location.lat, address.geometry.location.lng && this.state.dropLatitude, this.state.dropLongitude) {
        this.getEstimatedAmount();
      }
    });

  }

  dropAddress = (address, houseNumber, apartmentName) => {
    this.setState({
      dropAddress: address, dropOffHouseNumber: houseNumber, dropOffApartmentName: apartmentName,
      dropLatitude: address.geometry.location.lat, dropLongitude: address.geometry.location.lng
    }, () => {
      if (this.state.pickUpLatitude, this.state.pickUpLongitude && address.geometry.location.lat, address.geometry.location.lng) {
        this.getEstimatedAmount();
      }
    });
  }

  onQwiikRunClick = () => {
  }

  makeCall = () => {
    var contactNumber = "";
    if (this.state.isDataGetFromApi) {
      contactNumber = this.state.bookingDetails.runner.dialCode + this.state.bookingDetails.runner.phone;
    } else {
      contactNumber = this.state.bookingDetails.booking.runner.dialCode + this.state.bookingDetails.booking.runner.phone;
    }
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = "tel:$" + "{" + contactNumber + "}";
    } else {
      phoneNumber = "telprompt:$" + "{" + contactNumber + "}";
    }
    Linking.openURL(phoneNumber);
  };

  onPressChat = () => {
    this.props.navigation.navigate("ChatScreen",
      {
        bookingID: this.state.bookingID, userId: this.state.userId,
        runnerDetails: this.state.acceptedRunnersDetails.runner, isComeFromBookingDetail: false
      });
  }

  getEstimatedAmount = () => {
    this.setState({ isLoading: true });
    ApiRequest.getMethodApiCall(Server.ESTIMATED_AMOUNT + `fromLatLong=${this.state.pickUpLatitude},${this.state.pickUpLongitude}&toLatLong=${this.state.dropLatitude},${this.state.dropLongitude}`, (response, error) => {
      if (response) {
        this.setState({ isLoading: false });
        if (response.success) {
          this.setState({ estimatedAmount: response.amount });
        }
      } else {
        console.log("error", error);
      }
    });
  }

  onConfirmPickupPress = () => {
    if (!this.state.pickupAddress) {
      ToastCollection.toastShowAtBottom(stringFile.EMPTY_PICKUP_ADDRESS);
      return;
    }
    if (!this.state.dropAddress) {
      ToastCollection.toastShowAtBottom(stringFile.EMPTY_DROP_ADDRESS);
      return;
    }
    if (!this.state.estimatedAmount) {
      ToastCollection.toastShowAtBottom(stringFile.ZERO_AMOUNT_MESSAGE);
      return;
    }

    if (this.state.selectedProduct.length < 1) {
      ToastCollection.toastShowAtBottom(stringFile.EMPTY_PACKAGE);
      return;
    }
    this.confirmPickupRequest();
  }

  confirmPickupRequest = () => {
    const body = JSON.stringify({
      fromLocation: [this.state.pickUpLongitude, this.state.pickUpLatitude],
      fromAddress: this.state.pickupHouseNumber + " " + this.state.pickupApartmentName + " " + this.state.pickupAddress.formatted_address,
      toLocation: [this.state.dropLongitude, this.state.dropLatitude],
      toAddress: this.state.dropOffHouseNumber + " " + this.state.dropOffApartmentName + " " + this.state.dropAddress.formatted_address,
      productDetails: this.state.selectedProduct,
      instruction: this.state.instruction
    });
    this.setState({ isLoading: true });
    ApiRequest.postMethodApiCall(Server.CONFIRM_PICKUP_REQUEST, body, (response, error) => {
      if (response) {
        if (response.success) {
          setTimeout(() => {
            this.setState({ isLoading: false });
            if (this.state.bookingID == undefined && this.state.isShowMapView == false && this.state.showNoRunnerToast == false) {
              ToastCollection.toastShowAtBottom(stringFile.NO_RUNNER_ALERT_MESSAGE);
            }
          }, response.expireWithIn * 1000);
        } else {
          ToastCollection.toastShowAtBottom(response.error);
          this.setState({ isLoading: false });
        }
      } else {
        console.log("error", error);
        ToastCollection.toastShowAtBottom(error);
        this.setState({ isLoading: false });
      }
    });
  }
  cancelBooking = () => {
    ApiRequest.putMethodApiCallWIthoutBody(Server.CANCEL_REQUEST + this.state.bookingID, (response, error) => {
      if (response) {
        if (response.success) {
          this.clearData();
        } else {
          ToastCollection.toastShowAtBottom(response.error);
        }
      } else {
        ToastCollection.toastShowAtBottom(error);
      }
    });
  }

  clearSavedBookingData = () => {
    BookingDetailsStore.instance.deleteAllDetails();
    BookingDetailsStore.instance.setIsBookingCompleted(false);
    BookingDetailsStore.instance.setCurrentBookingId("");
    BookingDetailsStore.instance.setIsBookingAvaiable(false)
    this.props.acceptedBookignAction({});
  }

  clearData = () => {
    this.clearSavedBookingData();
    this.setState({
      currentBookingId: "",
      isDataGetFromApi: false,
      isShowMapView: false,
      pickupAddress: "",
      dropAddress: "",
      selectedProduct: [],
      pickupHouseNumber: "",
      pickupApartmentName: "",
      dropOffHouseNumber: "",
      dropOffApartmentName: "",
      packageDetailItem: "",
      manualItemText: "",
      pickUpLatitude: "",
      pickUpLongitude: "",
      dropLatitude: "",
      dropLongitude: "",
      serviceStartTime: "",
      reqReceivedAndConfirmTime: "",
      reqReceivedAndConfirmTimeMeridian: "",
      serviceStartTimeMeridian: "",
      serviceEndTime: "",
      serviceEndTimeMeridian: "",
      estimatedAmount: "",
      instruction: "",
      runnersLocationInfo: [],
      showNoRunnerToast: false,
      totalDistance: "",
      bookingID: undefined
    });
  }

  showAlertForCancelBooking = () => {
    DialogUtils.twoButtonInfoDialog(stringFile.CANCEL_REQUEST, stringFile.CANCEL_REQUEST_CONFIRMATION_MESSAGAE,
      stringFile.NO, stringFile.YES, (callBack) => {
        if (callBack) {
          this.cancelBooking();
        }
      });
  }
  showAlertForGotPackge = () => {
    // this.clearData();
    // Will be used in future
    DialogUtils.twoButtonInfoDialog(stringFile.GOT_PACKAGE, stringFile.PACKAGE_GOT_CONFIRMATION,
      stringFile.NO, stringFile.YES, (callBack) => {
        if (callBack) {
          this.clearData();
        }
        else {
          this.props.navigation.navigate("HelpSupport", { runnerDetails: this.state.acceptedRunnersDetails.runner, bookingOTP: this.state.acceptedRunnersDetails.otp });
        }
      });
  }
  cancelledBookingInfoPopup = () => {
    DialogUtils.oneButtonInfoDialog(stringFile.REQUEST_CANCELLED, stringFile.RUNNER_CANCELLED_REQUEST_INFO,
      stringFile.DAILOG_OK_BUTTON_TITLE);
  }

  showTrackingStatus = () => {
    var shipperName = "";
    var isOrderReceived = false;
    var otp = "";
    console.log(this.state.bookingDetails);
    if (this.state.isDataGetFromApi) {
      shipperName = this.state.bookingDetails.runner.firstName + " " + this.state.bookingDetails.runner.lastName;
      isOrderReceived = (this.state.bookingDetails.status === Constants.BOOKING_STATUS_ACCEPTED
        || this.state.bookingDetails.status === Constants.BOOKING_STATUS_STARTED
        || this.state.bookingDetails.status === Constants.BOOKING_STATUS_COMPLETED) ? true : false;
      var origin = {
        latitude: this.state.bookingDetails.fromLocation[1],
        longitude: this.state.bookingDetails.fromLocation[0]
      };
      var destination = {
        latitude: this.state.bookingDetails.toLocation[1],
        longitude: this.state.bookingDetails.toLocation[0]
      };
      var startTime = this.state.serviceStartTime ? this.state.serviceStartTime : stringFile.PRODUCT_YET_TO_PICKUP;
      var isPickedup = this.state.serviceStartTime ? true : false;
      otp = this.state.bookingDetails.otp;
    } 

    else if(this.state.bookingAccepted) {
      shipperName = this.state.bookingDetails.booking.runner.firstName 
      + " " + this.state.bookingDetails.booking.runner.lastName;
      isOrderReceived = (this.state.bookingDetails.booking.status === Constants.BOOKING_STATUS_ACCEPTED
        || this.state.bookingDetails.booking.status === Constants.BOOKING_STATUS_STARTED
        || this.state.bookingDetails.booking.status === Constants.BOOKING_STATUS_COMPLETED) ? true : false;
      origin = {
        latitude: this.state.bookingDetails.booking.fromLocation[1],
        longitude: this.state.bookingDetails.booking.fromLocation[0]
      };
      destination = {
        latitude: this.state.bookingDetails.booking.toLocation[1],
        longitude: this.state.bookingDetails.booking.toLocation[0]
      };
      startTime = this.state.serviceStartTime ? this.state.serviceStartTime : stringFile.PRODUCT_YET_TO_PICKUP;
      isPickedup = this.state.serviceStartTime ? true : false;
      otp = this.state.bookingDetails.booking.otp;
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_WHITE, zIndex: 999 }}>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <MapView
              ref={ref => {
                this.map = ref;
              }}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              // region={this.state.region}
              onMapReady={() => { this.map.fitToSuppliedMarkers(Constants.markerIDs, true); }}
            >
              <Marker coordinate={origin}
                identifier={Constants.markerIDs[0]} />

              <Marker coordinate={destination}
                identifier={Constants.markerIDs[1]} />

              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={Constants.GOOGLE_API_KEY}
                mode="DRIVING"
                precision="low"
                onReady={(result) => {
                  this.setState({ totalDistance: result.distance.toFixed(1) });
                }}
              />
            </MapView>
            <View style={{ flex: 1 }}>
              <DistanceAndPickupInfoView
                distance={this.state.totalDistance ? this.state.totalDistance : stringFile.DEFAULT_DISTANCE}
                startTime={startTime}
                meridiem={this.state.serviceStartTime ? this.state.serviceStartTimeMeridian : ""}
              />
              <UserInfoView
                isShowTrackingStatusText={true}
                shiperName={shipperName}
                yourShiper={stringFile.YOUR_SHIPER}
                showOtp={true}
                otp={otp}
                isShowCancelButton={isPickedup ? false : true}
                onPressCancelButton={() => { this.showAlertForCancelBooking(); }}
              />
              <TrackingStatusView
                time={this.state.reqReceivedAndConfirmTime}
                title={stringFile.ORDER_RECEIVED}
                message={stringFile.CONFIRMATION_WAITING}
                isPickedStatus={isOrderReceived}
                meridiem={this.state.reqReceivedAndConfirmTimeMeridian}
              />
              <TrackingStatusView
                time={this.state.reqReceivedAndConfirmTime}
                title={stringFile.ORDER_CONFIRMED}
                message={stringFile.DELIVERY_BOY_ON_THE_WAY}
                isPickedStatus={isOrderReceived}
                meridiem={this.state.reqReceivedAndConfirmTimeMeridian}
              />
              <TrackingStatusView
                time={this.state.serviceStartTime ? this.state.serviceStartTime : stringFile.DEFAULT_TIME}
                title={stringFile.ORDER_PICKED}
                message={stringFile.ORDER_PICKED_UP_DESC}
                isShowCallView={this.state.serviceEndTime ? false : true}
                isPickedStatus={isPickedup}
                onPressCall={() => { this.makeCall(); }}
                onPressChat={() => { this.onPressChat(); }}
                newMessageReceived={this.state.newMessageReceived}
                meridiem={this.state.serviceStartTime ? this.state.serviceStartTimeMeridian : ""}
              />
              <TrackingStatusView
                time={this.state.serviceEndTime ? this.state.serviceEndTime : stringFile.DEFAULT_TIME}
                title={stringFile.YOUR_LOCATION}
                isLocation={true}
                isPickedStatus={this.state.serviceEndTime ? true : false}
                meridiem={this.state.serviceEndTime ? this.state.serviceEndTimeMeridian : ""}
                onPressDone={() => { this.state.serviceEndTime && this.showAlertForGotPackge(); }}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

Home.propTypes = {
  provider: ProviderPropType
};

const mapStateToProps = (state) => {
  return {
    runnerLocation: state.updateRunnersLocation.runnerLocation || [],
    acceptedBookingDetails: state.acceptedBookignAction,
    newMessageInfo: state.isNewMessageAvailable.isNewMessageAvailable,
    networkConnectionState: state.networkStateAction.isConnectionAvailabel
  };
};

export default connect(mapStateToProps, { acceptedBookignAction })(Home);

const styles = StyleSheet.create({
  packageDetailsStyle: {
    marginStart: 25,
    marginTop: 60,
    color: ColorConst.THEME_COLOR_BLACK_DARK,
    fontSize: 18,
    marginBottom: 20,
    ...Font.FONT_REGULAR,
    fontWeight: "400"
  },
  map: {
    height: 300
  },
  serviceRatingViewStyle: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: "center"
    // flexDirection: "row"
  },
  selectedStarImageStyle: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    margin: 4,
    tintColor: ColorConst.THEME_COLOR_BLUE
  },
  unselecetdStarImageStyle: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    margin: 4,
    tintColor: ColorConst.THEME_COLOR_GRAY
  },
  feedbackTextStyle: {
    ...Font.FONT_SEMIBOLD,
    color: ColorConst.THEME_COLOR_GRAY,
    textAlign: "center"
  }
});
