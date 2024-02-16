import React, { Component } from "react";
import { View, Text, SafeAreaView } from "react-native";
import ColorConst from "../../styles/colors/ColorConst";
export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG
      }}>
       <Text>Under development</Text>
      </SafeAreaView>
    );
  }
}
