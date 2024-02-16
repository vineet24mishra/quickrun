/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import { View, StyleSheet, Image, Text } from 'react-native';
import React, { useState } from "react";
import ColorConst from "../styles/colors/ColorConst";
import { FONT_REGULAR } from '../assets/fonts/Fonts';
import stringFile from '../locale/StringEn';
import Modal from 'react-native-modal';
import AccessTokenStore from '../store/AccessTokenStore';
import { store } from '../redux/store/Store';
import {networkStateAction} from "../redux/actions/Action";
function ConnectionHandler() {
    const [isConnection, setConnection ] = useState(true)
    
    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setConnection(state.isConnected);
            store.dispatch(networkStateAction(state.isConnected))
        });
        return () => {
            unsubscribe();
        };
    });
    return (
        <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            isVisible={!isConnection}
            backdropOpacity={0.3}>
            <View style={styles.modalView}>
                <Image
                    style={{ width: 80, height: 80 }}
                    source={require("../assets/icons/offline.png")}
                />
                <Text style={styles.networkTextStyle}>{stringFile.NO_CONNECTION}</Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    networkTextStyle: {
        fontSize: 18,
        color: ColorConst.THEME_COLOR_GRAY,
        ...FONT_REGULAR,
        textAlign: "center",
        marginTop: 40
    }
});

export default ConnectionHandler;
