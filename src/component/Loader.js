import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { UIActivityIndicator } from "react-native-indicators";
const { width, height } = Dimensions.get("window");
import ColorConst from "../styles/colors/ColorConst";

export const Loader = ({isLoading, extraStyle}) => (
	<View style={[styles.container, extraStyle]}>
		{isLoading && <UIActivityIndicator size={35} count={12} color={ColorConst.LOADER_COLOR_GRAY} />}
	</View>
);


const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "absolute",
		height: height,
		width: width,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "transparent"
	}
});
