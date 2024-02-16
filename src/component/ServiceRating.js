import React from "react";
import { View, Image, StyleSheet } from "react-native";
import ColorConst from "../styles/colors/ColorConst";

function showStars(rating, maxRating) {
    const starRatingBar = [];
    for (var i = 1; i <= maxRating; i++) {
        starRatingBar.push(
            <View>
                <Image
                    style={i <= rating
                        ? styles.selectedStarImageStyle
                        : styles.unselecetdStarImageStyle}
                    source={
                        i <= rating
                            ? require("../assets/icons/selectedStar.png")
                            : require("../assets/icons/unSelectedStar.png")
                    }
                />
            </View>
        );
    }
    return (
        <View style={{ flexDirection: "row", width: "70%"}}>
            {starRatingBar}
        </View>
    );
}

export const ShowStarRating = ({ rating, maxRating }) => (
        <>
            {showStars(rating, maxRating)}
        </>
    );

const styles = StyleSheet.create({
    selectedStarImageStyle: {
        width: 10,
        height: 10,
        resizeMode: "cover",
        margin: 4,
        tintColor: ColorConst.THEME_COLOR_BLUE
    },
    unselecetdStarImageStyle: {
        width: 10,
        height: 10,
        resizeMode: "cover",
        margin: 4,
        tintColor: ColorConst.THEME_COLOR_GRAY
    }
});
