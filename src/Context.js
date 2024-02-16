import * as React from "react";
import { Platform } from "react-native";
import Constants from "./utils/Constants";

export const AuthContext = React.createContext();

export const deviceOs = Platform.OS == Constants.PLATFORM_ANDROID ? Constants.PLATFORM_ANDROID : Constants.PLATFORM_IOS;
