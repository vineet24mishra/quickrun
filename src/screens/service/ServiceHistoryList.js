import React, { Component } from "react";
import { View, FlatList, SafeAreaView, Image, Text, StyleSheet} from "react-native";
import { CustomHeader } from "../../component/CustomHeader";
import stringFile from "../../locale/StringEn";
import { ServiceListItemView } from "./ServiceListView";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import { Loader } from "../../component/Loader";
import ColorConst from "../../styles/colors/ColorConst";
import { FONT_REGULAR } from "../../assets/fonts/Fonts";
import moment from "moment";
import Constants from "../../utils/Constants";
import { UIActivityIndicator } from "react-native-indicators";
import ToastCollection from "../../utils/ToastCollection";

export default class ServiceHistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingHistoryList: [],
      isLoading: false,
      canLoadMore: false,
      limit: 10,
      isResponseGot: false,
      maxRating : 5

    };
    this.pageNumber = 1;
    
  }

  componentDidMount() {
    console.log(this.props);
    this.getBookingList(this.pageNumber);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY }}>
        <CustomHeader
          title={stringFile.SERVICE_HISTORY_SCREEN_TITLE}
          onPress={() => { this.props.navigation.goBack(); }}
          showBackButton={true}
        />
         {this.state.bookingHistoryList.length == 0 && !this.state.isLoading && this.listEmptyComponent()}
          <FlatList
            style={{ flex: 1 }}
            data={this.state.bookingHistoryList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderServiceList}
            extraData={this.state}
            showsVerticalScrollIndicator={false}
            onEndReached={this.onEndReachedCalled}
            onEndReachedThreshold={0.5}
            ListFooterComponent={this.state.canLoadMore && this.renderFooter}
          />
        {this.state.isLoading ? (
          <Loader isLoading={true} />
        ) : null}
      </SafeAreaView>
    );
  }

  renderFooter = () => {
    return (
      <UIActivityIndicator size={35} count={12} color={ColorConst.LOADER_COLOR_GRAY} style={{ margin: 20 }} />
    );
  }
  renderServiceList = ({ item }) => {
    const timeAndDate = item.status == Constants.BOOKING_STATUS_COMPLETED ? item.endedAt : item.acceptedAt;
    return (
      <ServiceListItemView
        item={item}
        onPress={() => { this.props.navigation.navigate("ServiceDetails", { bookingDetails: item, timeAndDate: this.dateTimeFormat(timeAndDate) }); }}
        time={timeAndDate && this.dateTimeFormat(timeAndDate)}
        maxRating={this.state.maxRating}
      />
    );
  }

  onEndReachedCalled = () => {
    if (this.state.canLoadMore && this.state.isResponseGot) {
      this.pageNumber = this.pageNumber + 1;
      this.getBookingList(this.pageNumber);
      this.setState({ isLoading: false, isResponseGot: false });
    }
  }
  listEmptyComponent = () => {
    return (
      <View style={styles.noDataPlaceHolderViewStyle}>
        <Image style={styles.noDataIconStyle}
          source={require("../../assets/icons/noData.png")} />
        <Text style={styles.noDataTextStyle}>{stringFile.NO_RECORD_FOUND}</Text>
      </View>
    );
  }

  dateTimeFormat = (epoch) => {
    return moment.unix(epoch / 1000).utcOffset(moment().utcOffset()).format(Constants.DATE_FORMAT);
  }

  getBookingList = (pageNumber) => {
    this.setState({ isLoading: true });
    ApiRequest.getMethodApiCall(Server.GET_BOOKING_LIST + `${pageNumber}&limit=${this.state.limit}`, (response, error) => {
      if (response) {
        this.setState({ isLoading: false });
        if (response.success) {
          this.setState({
            canLoadMore: response.bookings.length == 10 ? true : false,
            bookingHistoryList: [...this.state.bookingHistoryList, ...response.bookings],
            isResponseGot: true
          });
        } else {
          console.log(response.success);
        }
      } else {
        console.log(error);
      }
    });
  }
}

const styles = StyleSheet.create({

  noDataPlaceHolderViewStyle: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flex: 1
  },
  noDataIconStyle: {
    width: 40,
    height: 40,
    tintColor: ColorConst.THEME_COLOR_GRAY
  },
  noDataTextStyle: {
    fontSize: 18,
    ...FONT_REGULAR,
    color: ColorConst.THEME_COLOR_GRAY
  }
});
