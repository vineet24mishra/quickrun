import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, Image, SafeAreaView } from "react-native";
import { TextButton } from "../../component/TextButton";
import stringFile from "../../locale/StringEn";
import ColorConst from "../../styles/colors/ColorConst";
import { TextStyles } from "../../styles/componentStyle/TextStyles";
import { CustomHeader } from "../../component/CustomHeader";
import { TouchableOpacityDoubleClick } from "../../component/PreventDoubleClick";
import ApiRequest from "../../network/ApiRequest";
import { Server } from "../../network/Server";
import { Loader } from "../../component/Loader";
import SaveProductItem from "../../store/SaveProductItem";

export default function ProductList({ navigation, route }) {
    const [isLoading, setLoader] = React.useState(false);
    const [isItemCheckedList, setIsItemCheckedList] = React.useState(route.params && route.params.selectedProductList || []);
    const [productListData, setProductListData] = React.useState([]);
    const [check, setCheck] = React.useState(false);

    React.useEffect(() => {
     getProductItemList();
    });

    function renderProductList({item, index}) {
        var isCheck = check;
        isCheck = isItemCheckedList.indexOf(item.name) !== -1;
        return (
            <TouchableOpacityDoubleClick
                style={{ flex: 1 }}
                 key = {index}
                onPress={() => { onItemTap(item.name); }}
                >
                <View style={styles.itemParentView}>
                    <Text style={[TextStyles.textStyleDefault, { padding: 20 }]}>{item.name}</Text>
                    <View style={[styles.tickIconViewStyle, { backgroundColor: isCheck ? ColorConst.THEME_COLOR_GREEN
                        : ColorConst.THEME_UNSELECTED_ITEM }]}>
                        <Image
                        style={{ tintColor: ColorConst.THEME_COLOR_WHITE, height: 15, width: 15}}
                            source={require("../../assets/icons/tick.png")} />
                    </View>
                </View>
                <View style={{ width: "100%", height: 2 }} />
            </TouchableOpacityDoubleClick>
        );

    }

    function getProductItemList() {
        SaveProductItem.instance.getProductList().then((data) => {
            if (data) {
                setProductListData(data);
            } else {
               getItemList();
            }
        });
    }

    function onItemPick() {
        if (route.params &&route.params.selectedProduct) {
            route.params.selectedProduct(isItemCheckedList);
        }
       navigation.goBack();
    }

    function onItemTap(item) {
        if (isItemCheckedList == 0) {
            var checkedArray = [...isItemCheckedList, item];
           setIsItemCheckedList(checkedArray);
        } else {
           handleCheck(item);
        }
    }

    function handleCheck(val) {
        if (isItemCheckedList.indexOf(val) !== -1) {
            const array = isItemCheckedList.filter(item => item !== val);
            setIsItemCheckedList(array);
        } else {
            var checkedArray = [...isItemCheckedList, val];
            setIsItemCheckedList(checkedArray);
        }
    }

    function getItemList() {
        setLoader(true);
        ApiRequest.getMethodApiCall(Server.GET_ITEM_LIST, (response, error) => {
            if (response) {
              setLoader(false);
                if (response.success) {
                    console.log("Response--->", response);
                    SaveProductItem.instance.persistProductList(response.items);
                    setProductListData(response.items);
                } else {
                    console.log(response.error);
                }
            } else {
                console.log(error);
            }
        });
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CustomHeader
                title={stringFile.SELECT_PRODUCT_SCREEN_TITLE}
                onPress={() => { navigation.goBack(); }}
                showBackButton={true}
            />
            <View style={styles.container}>
                <FlatList
                    style={{ width: "100%" }}
                    data={productListData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderProductList}
                />
                <TextButton additionalStyle={{ width: "70%", marginTop: 10, marginBottom: 10 }}
                    buttonTitle={stringFile.PICK_PRODUCT}
                    onButtonPress={() => { onItemPick(); }} />
            </View>
            {isLoading ? (
                <Loader isLoading={true} />
            ) : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ColorConst.THEME_COLOR_WHITE
    },
    itemParentView: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: ColorConst.THEME_COLOR_GRAY_HOME_BG
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
    }
});