import React, { Component } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image } from "react-native";
import * as Font from "../../assets/fonts/Fonts";
import ColorConst from "../../styles/colors/ColorConst";
import stringsFileEng from "../../locale/StringEn";
import { ScrollView } from "react-native-gesture-handler";
import { CustomHeader } from "../../component/CustomHeader";
import UserModelStore from "../../store/UserModelStore";
import {TextButton} from "../../component/TextButton";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxRating: 5,
      userInfo: {}
    };
  }
  componentDidMount() {
    UserModelStore.instance.getUserModel().then((user) => {
      this.setState({ userInfo: user });
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG }}>
        <CustomHeader
          showBackButton={true}
          onPress={() => {  this.props.navigation.goBack(); }}
          title={stringsFileEng.PROFILE_TITLE}
        />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContentViewStyle}>
            <View style={styles.imageNameViewStyle}>
              <Image
                style={styles.indicatorIconsStyle}
                source={require("../../assets/icons/greenUser.png")} />
              <Text style={styles.placeHolderTextStyle}>{stringsFileEng.FULL_NAME}</Text>
            </View>
            <Text style={styles.placeHolderValueTextStyle}>
              {this.state.userInfo.firstName + " " + this.state.userInfo.lastName}
            </Text>

            <View style={styles.imageNameViewStyle}>
              <Image
                style={styles.indicatorIconsStyle}
                source={require("../../assets/icons/greenCall.png")} />
              <Text style={styles.placeHolderTextStyle}>{stringsFileEng.PHONE_NUMBER}</Text>
            </View>
            <Text style={styles.placeHolderValueTextStyle}>
              {this.state.userInfo.dialCode + " " + this.state.userInfo.phone}
            </Text>

            <View style={styles.imageNameViewStyle}>
              <Image
                style={[styles.indicatorIconsStyle, { tintColor: ColorConst.THEME_COLOR_GREEN }]}
                source={require("../../assets/icons/mail.png")} />
              <Text style={styles.placeHolderTextStyle}>{stringsFileEng.EMAIL}</Text>
            </View>
            <Text style={styles.placeHolderValueTextStyle}>
              {this.state.userInfo.email}
            </Text>

            <View style={styles.imageNameViewStyle}>
              <View style={styles.greenViewStyle}></View>
              <Text style={styles.placeHolderTextStyle}>{stringsFileEng.ACCOUNT_STATUS}</Text>
            </View>
            <Text style={[styles.placeHolderValueTextStyle, { marginBottom: 20 }]}>
              {this.state.userInfo.isAccountActive ? stringsFileEng.ACTIVE_STATUS : stringsFileEng.INACTIVE_STATUS}
            </Text>
          </View>
          <TextButton
            additionalStyle={{ width:"50%", alignSelf:"center" }}
            buttonTitle={"Edit Profile"}
            newTextStyle={{ fontSize: 16 }}
            onButtonPress={() => { this.navigateToEditProfile(); }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  showStarsRating = (rating) => {
    const starRatingBar = [];
    for (var i = 1; i <= this.state.maxRating; i++) {
      starRatingBar.push(
        <View>
          <Image
            style={i <= rating
              ? styles.selectedStarImageStyle
              : styles.unselecetdStarImageStyle}
            source={
              i <= rating
                ? require("../../assets/icons/selectedStar.png")
                : require("../../assets/icons/unSelectedStar.png")
            }
          />
        </View>
      );
    }
    return (
      <View style={styles.ratingViewStyle}>
        {starRatingBar}
      </View>
    );
  }

  navigateToEditProfile = () => {
    this.props.navigation.navigate("EditProfile", {updateProfile : this.updateProfile});
  }

  updateProfile = (updatedInfo) => {
      this.setState({ userInfo: updatedInfo });
  }

}

const styles = StyleSheet.create({
  mainContentViewStyle: {
    backgroundColor: ColorConst.THEME_COLOR_WHITE,
    width: "80%",
    borderColor: ColorConst.THEME_COLOR_LIGHT_GRAY,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: ColorConst.THEME_COLOR_GRAY,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
    alignSelf: "center",
    margin: 20
  },
  indicatorIconsStyle: {
    height: 15,
    width: 15
  },
  blackMediumTextStyle: {
    fontSize: 14,
    ...Font.FONT_MEDIUM,
    color: ColorConst.THEME_COLOR_BLACK,
    marginLeft: 20
  },
  graySmallTextStyle: {
    fontSize: 14,
    ...Font.FONT_REGULAR,
    color: ColorConst.THEME_COLOR_GRAY,
    marginLeft: 8
  },
  selectedStarImageStyle: {
    width: 15,
    height: 15,
    resizeMode: "cover",
    margin: 4,
    tintColor: ColorConst.THEME_COLOR_BLUE
  },
  unselecetdStarImageStyle: {
    width: 15,
    height: 15,
    resizeMode: "cover",
    margin: 4,
    tintColor: ColorConst.THEME_COLOR_GRAY
  },
  imageNameViewStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 30
  },
  placeHolderTextStyle: {
    marginStart: 10,
    fontSize: 14,
    ...Font.FONT_REGULAR,
    color: ColorConst.THEME_COLOR_GRAY
  },
  placeHolderValueTextStyle: {
    marginStart: 55,
    marginTop: 5,
    fontSize: 16,
    ...Font.FONT_REGULAR,
    color: ColorConst.THEME_COLOR_BLACK
  },
  ratingViewStyle : {
    flexDirection: "row", 
    width: "70%", 
    alignSelf: "center", 
    marginBottom: 20
  },
  averageRatingTextStyle : {
    marginStart: 55, 
    fontSize: 14, 
    ...Font.FONT_REGULAR, 
    color: ColorConst.THEME_COLOR_GRAY, 
    marginTop: 20
  },
  greenViewStyle : {
    height: 15, 
    width: 15, 
    backgroundColor: ColorConst.THEME_COLOR_GREEN, 
    borderRadius: 10
  }
});
