/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import RootNavigation from "./src/navigation/RootNavigation";
import { deviceOs } from "./src/Context";
import Constants from "./src/utils/Constants";
import ConnectionHandler from "./src/utils/ConnectionHandler";
console.disableYellowBox = true;

export default () => {
  return (
    <>
      <StatusBar barStyle={deviceOs === Constants.PLATFORM_ANDROID ? "light-content" : "dark-content"} />
      <ConnectionHandler/>
      <RootNavigation />
    </>
  );
};
