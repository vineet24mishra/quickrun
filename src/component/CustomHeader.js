import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import ColorConst from "../styles/colors/ColorConst";
import * as Font from "../assets/fonts/Fonts";
import { TouchableOpacityDoubleClick } from "../component/PreventDoubleClick";

export const CustomHeader = ({ title, onPress, showBackButton
}) => (
        <>
            <View style={styles.headerStyle}>
                {showBackButton && <TouchableOpacityDoubleClick
                    onPress={onPress}>
                    <Image
                        style={styles.backIconStyle}
                        source={require("../assets/icons/arrow.png")} />
                </TouchableOpacityDoubleClick>}
                <Text style={styles.titleStyle}>{title}</Text>
                <View></View>
            </View>
            <View style={styles.bottomLineStyle}></View>
        </>
    );

const styles = StyleSheet.create({
    headerStyle: {
        width: "100%",
        height: 60,
        backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG,
        flexDirection: "row",
        alignItems: "center"
    },
    titleStyle: {
        flex: 1,
        marginHorizontal: 20,
        fontSize: 18,
        ...Font.FONT_REGULAR,
        textAlign: "center",
        marginRight: 40
    },
    backIconStyle: {
        width: 25,
        height: 25,
        marginLeft: 15
    },
    bottomLineStyle: {
        width: "100%",
        height: 0.5,
        backgroundColor: ColorConst.HEADER_BOTTOM_LINE_COLOR
    }
});
