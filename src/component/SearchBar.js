import React from "react";
import { StyleSheet, View, TextInput, Image, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
import { TouchableOpacityDoubleClick } from "../component/PreventDoubleClick";
import { Loader } from "../component/Loader";

export const SearchBar = ({
	inputValue, onChangeText, placeholder, additionalStyle, searchAction, isLoading,
	onSubmitEditing, placeHolderStyle, setImage, imageStyle, inputRef
}) => (
		<View style={[styles.searchParentView, additionalStyle]}>
			<View style={styles.textInputViewStyle}>
				<TextInput
					style={[styles.textInputStyle, placeHolderStyle]}
					underlineColorAndroid='transparent'
					placeholder={placeholder}
					value={inputValue}
					ref={inputRef}
					keyboardShouldPersistTaps={true}
					returnKeyType='search'
					// clearButtonMode={setImage ? "never" : "while-editing"} // Can be used in future
					onChangeText={onChangeText}
					autoCorrect={false}
					autoCapitalize={"none"}
					onSubmitEditing={onSubmitEditing}
					placeholderTextColor={"#929292"}
					fontSize={14}
				/>
				<TouchableOpacityDoubleClick style={styles.searchIconTouchStyle} onPress={searchAction}>
					{!isLoading ? <Image style={[styles.searchIconStyle, imageStyle]} source={setImage ? setImage : require("../assets/icons/search.png")} />
						: <Loader isLoading={true} />}
				</TouchableOpacityDoubleClick>
			</View>

		</View>
	);


const styles = StyleSheet.create({
	searchParentView: {
		flexDirection: "row",
		height: 45,
		backgroundColor: "transparent"
	},
	searchBarDeleteTextStyle: {
		position: "absolute",
		height: 35,
		width: width - 17,
		left: 0,
		right: 0,
		top: 2
	},
	textInputViewStyle: {
		flex: 1,
		flexDirection: "row",
		paddingLeft: 10,
		paddingRight: 0,
		backgroundColor: "#fff",
		borderColor: "#EDEEED",
		borderWidth: 0.3,
		borderRadius: 1
	},
	textInputStyle: {
		flex: 1,
		height: 30,
		alignSelf: "center",
		color: "gray",
		paddingTop: 0,
		paddingBottom: 0,
		paddingRight: 0
	},
	searchIconTouchStyle: {
		alignSelf: "center",
		height: 35,
		width: 50,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center"
	},
	searchIconStyle: {
		height: 12,
		width: 12,
		alignSelf: "center"
	}
});
