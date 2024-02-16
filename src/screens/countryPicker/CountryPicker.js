import React from "react";
import { StyleSheet, SafeAreaView, View, Text, FlatList, TouchableOpacity } from "react-native";
import Country from "../../utils/Country.json";
import { CustomHeader } from "../../component/CustomHeader";
import stringFile from "../../locale/StringEn";
import { TextStyles } from "../../styles/componentStyle/TextStyles";
import { SearchBar } from "../../component/SearchBar";

export default function CountryPicker({ navigation, route }) {
    const [countryList, setCountryList] = React.useState(Country.country);

    function onChangeText(text) {
        if (text.length > 0) {
            const newData = Country.country.filter(function(item) {
                const itemData = item.name.toUpperCase();
                const textData = text.toUpperCase();
                let isAvailable = itemData.indexOf(textData) > -1;
                if (!isAvailable) {
                    const itemData = item.code ? item.code : "";
                    isAvailable = itemData.indexOf(text) > -1;
                }
                return isAvailable;
            });
            setCountryList(newData);
        }
    }

    function renderCountryDialCodeList({ item }) {
        return (
            <TouchableOpacity
                onPress={() => { onItemTap(item); }}
                style={styles.container}>
                <View style={styles.itemParentView}>
                    <Text style={[TextStyles.textStyleDefault, { padding: 20 }]}>{item.name}{"  "}{item.code}</Text>

                </View>
                <View style={styles.separatorView} />
            </TouchableOpacity>
        );
    }

    function onItemTap(item) {
        route.params && route.params.pickCountryCode(item);
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <CustomHeader title={stringFile.COUNTRY_PICKER_TITLE}
                    onPress={() => { navigation.goBack(); }}
                    showBackButton={true}
                />
                <SearchBar
                    onChangeText={onChangeText}
                    placeholder={stringFile.SEARCH_BAR_PLACEHOLDER}
                />
                <FlatList
                    style={styles.flatListStyle}
                    data={countryList}
                    renderItem={renderCountryDialCodeList}
                    keyExtractor={(item, index) => index.toString()}
                    keyboardShouldPersistTaps='handled'
                    disableVirtualization={true} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flatListStyle: {
        width: "100%",
        marginTop: 5
    },
    itemParentView: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "white"
    },
    tickIconViewStyle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        position: "absolute",
        right: 20
    },
    separatorView: {
        width: "100%",
        height: 1
    }
});
