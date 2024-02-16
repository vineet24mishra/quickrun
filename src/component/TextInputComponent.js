import React from "react";
import { StyleSheet, TextInput } from "react-native";
import ColorConst from "../styles/colors/ColorConst";
import * as Font from "../assets/fonts/Fonts";

export const TextInputComponent = ({
    placeHolderText, additionalStyle, textChange, passwordType, keyboardType,
    keyType, onSubmitEditing, refrence, setValue, multiline
}) => (
        <>
        <TextInput
            ref={refrence}
            style={[styles.textInputParent, additionalStyle]}
            placeholder={placeHolderText}
            onChangeText={textChange}
            placeholderTextColor={ColorConst.THEME_COLOR_BLACK}
            secureTextEntry={passwordType}
            selectionColor={ColorConst.THEME_COLOR_GRAY}
            keyboardType={keyboardType}
            returnKeyType={keyType}
            onSubmitEditing={onSubmitEditing}
            value={setValue}
            autoCorrect={false}
            multiline={multiline}
        />
        </>
    );

const styles = StyleSheet.create({
    textInputParent: {
        width: "100%",
        borderColor: ColorConst.THEME_COLOR_GRAY,
        borderRadius: 35,
        color: ColorConst.THEME_COLOR_BLACK,
        borderWidth: 1,
        padding: 5,
        paddingHorizontal: 20,
        ...Font.FONT_REGULAR
    }
});

