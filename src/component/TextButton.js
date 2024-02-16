import React from "react";
import { StyleSheet, Text } from "react-native";
import ColorConst from "../styles/colors/ColorConst";
import * as Font from "../assets/fonts/Fonts";
import {TouchableOpacityDoubleClick} from "../component/PreventDoubleClick";

export const TextButton = ({
   buttonTitle, additionalStyle, onButtonPress, newTextStyle
}) => (
    <TouchableOpacityDoubleClick style = {[styles.textStyleButton, additionalStyle]} onPress = {() => { onButtonPress(); }} >
        <Text style = {[styles.textStyle, newTextStyle]}>{buttonTitle}</Text>
    </TouchableOpacityDoubleClick>
);


const styles = StyleSheet.create({
    textStyleButton : {
        width : "100%",
        justifyContent : "center",
        backgroundColor : ColorConst.THEME_COLOR_BLUE,
        padding: 10,
        borderRadius : 25,
        borderColor : ColorConst.THEME_COLOR_BLUE
    },
    textStyle : {
        fontSize : 18,
        color : ColorConst.THEME_COLOR_WHITE,
        textAlign : "center",
        ...Font.FONT_BOLD
    }
});
