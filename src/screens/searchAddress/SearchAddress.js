import React from "react";
import { SafeAreaView, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "../../utils/Constants";
import ColorConst from "../../styles/colors/ColorConst";
import { CustomHeader } from "../../component/CustomHeader";
import stringFile from "../../locale/StringEn";

const palasia = { description: "Palasia test", geometry: { location: { lat: 22.7244, lng: 75.8839 } }, formatted_address: "Palasia test" };
const vijayNagar = { description: "Vijay Nagar test", geometry: { location: { lat: 22.7533, lng: 75.8937 } }, formatted_address: "Vijay Nagar test" };

export default function SearchAddress({ navigation, route }) {
    const [predefinedPlaces] = React.useState([palasia, vijayNagar]);

    function addressPicked(address) {
        route.params && route.params.pickAddressFromGoogle(address);
        navigation.goBack();
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG }}>
            <View style={{ flex: 1 }}>
                <CustomHeader title={stringFile.SEARCH_ADDRESS}
                    onPress={() => { navigation.goBack(); }}
                    showBackButton={true}
                />
                <GooglePlacesAutocomplete
                    placeholder={stringFile.ENTER_LOCATION}
                    minLength={2}
                    autoFocus={false}
                    returnKeyType={"default"}
                    fetchDetails={true}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    listViewDisplayed={true}
                    debounce={0}
                    query={{
                        key: Constants.GOOGLE_API_KEY,
                        language: "en",
                        types: "geocode"
                        // components: "country:in"
                    }}
                    predefinedPlaces={predefinedPlaces}
                    onPress={(data, details = null) => {
                        addressPicked(details);
                    }}
                    styles={{
                        container: {
                            flex: 1,
                            height: 40, backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG, marginTop: 10
                        },
                        textInputContainer: {
                            backgroundColor: "white",
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            marginLeft: 10, marginRight: 10
                        },
                        textInput: {
                            marginLeft: 0,
                            marginRight: 0,
                            height: 38,
                            color: "#5d5d5d",
                            fontSize: 16
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    );

}
