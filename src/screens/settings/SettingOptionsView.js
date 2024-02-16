import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as Font from "../../assets/fonts/Fonts";
import ColorConst from "../../styles/colors/ColorConst";


export const SettingOptionsView = ({ index, item, onPress }) => (
    <View >
        <TouchableOpacity
            key={index}
            style={{ marginTop: index == 0 ? 10 : 0, flexDirection: "row", justifyContent: "space-between", elevation: 1, paddingStart: 10, paddingEnd: 10, alignItems: "center" }}
            onPress={onPress}>
            <Text style={{ ...Font.FONT_REGULAR, marginLeft: 10 }}>{item}</Text>
            <Image
                style={{ height: 15, width: 15 }}
                resizeMode={"contain"}
                source={require("../../assets/icons/next.png")} />

        </TouchableOpacity>
        <View style={{ width: "100%", height: 1, backgroundColor: ColorConst.THEME_COLOR_LIGHT_GRAY, marginVertical: 10 }} />
    </View>

);

