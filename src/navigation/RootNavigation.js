import "react-native-gesture-handler";
import * as React from "react";
import { View, Text, Image } from "react-native";
import Login from "../screens/login/Login";
import Signup from "../screens/signUp/Signup";
import MobileVerification from "../screens/mobileVerification/MobileVerification";
import AccessTokenStore from "../store/AccessTokenStore";
import stringFile from "../locale/StringEn";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home/Home";
import ProductList from "../screens/productList/ProductList";
import PickAddress from "../screens/pickAddress/PickAddress";
import SearchAddress from "../screens/searchAddress/SearchAddress";
import Setting from "../screens/settings/Setting";
import Account from "../screens/account/Account";
import Profile from "../screens/profile/Profile";
import ChatScreen from "../screens/chat/ChatScreen";
import EditProfile from "../screens/editProfile/EditProfile";
import ColorConst from "../styles/colors/ColorConst";
import { AuthContext } from "../Context";
import ActionTypes from "../redux/types/ActionTypes";
import NotificationReceiver from "../utils/NotificationReceiver";
import CountryPicker from "../screens/countryPicker/CountryPicker";
import appConfig from "../../app.json";
import { Provider } from "react-redux";
import { store } from "../redux/store/Store";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import { acceptedBookignAction, isNewMessageAvailable } from "../redux/actions/Action";
import ServiceHistoryList from "../screens/service/ServiceHistoryList";
import ServiceDetails from "../screens/service/ServiceDetails";
import { deviceOs } from "../Context";
import BookingDetailsStore from "../store/BookingDetailsStore";
import HelpSupport from "../screens/helpSupport/HelpSupport";
import TestClass from "../screens/mobileVerification/TestClass";
import {
  notificationReceivedWhenActiveApp,
  notificationReceivedWhenAppIsInBackground, notificationWhenIosAppInBg, notificationWhenBgTapOnNotification
} from "../utils/FirebaseNotification";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case ActionTypes.RESTORE_TOKEN_KEY:
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false
          };
        case ActionTypes.SIGN_IN_KEY:
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token
          };
        case ActionTypes.SIGN_OUT_KEY:
          return {
            ...prevState,
            isSignout: true,
            userToken: null
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async() => {
      let userToken;
      try {
        userToken = await AccessTokenStore.instance.getToken();
        AccessTokenStore.instance.setAccessToken(userToken);
      } catch (e) {
        // Restoring token failed
      }
      dispatch({ type: ActionTypes.RESTORE_TOKEN_KEY, token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: token => dispatch({ type: ActionTypes.SIGN_IN_KEY, token }),
      signOut: () => dispatch({ type: ActionTypes.SIGN_OUT_KEY }),
      signUp: token => dispatch({ type: ActionTypes.SIGN_IN_KEY, token })
    }), []);

  return (
    <AuthContext.Provider value={authContext}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="loggedInNavigation" headerMode="none">
            {
              state.isLoading ? (
                <Stack.Screen name="RootLoadingNavigation" component={RootLoadingNavigation} />
              ) : state.userToken ? (
                <Stack.Screen name="loggedInNavigation" component={loggedInNavigation} />)
                  : (<Stack.Screen name="authStack" component={authStack} />)
            }
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </AuthContext.Provider>
  );
}

class RootLoadingNavigation extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      senderId: appConfig.senderID
    };
    notificationReceivedWhenActiveApp(this.props);
    notificationWhenBgTapOnNotification();
    // notificationReceivedWhenAppIsInBackground();
    notificationReceivedWhenAppIsInBackground(this.props);
    // this.notif = new NotificationReceiver(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  // onRegister(token) {
  //   console.log("token ---->>>>", token);
  //   AsyncStorage.setItem(Constants.DEVICE_TOKEN, token.token);
  //   AccessTokenStore.instance.setDeviceToken(token.token);
  // }

  // onNotif(notification) {
  //   console.log("notification----->>>>", notification);
  //   if (deviceOs == Constants.PLATFORM_ANDROID && notification.foreground) {
  //     this.notif.cancelAll();
  //   }
  //   if (notification.type == Constants.MESSAGE_TYPE_NOTIFICATION) {
  //     store.dispatch(isNewMessageAvailable(true));
  //   } else {
  //     if (notification.data.status == Constants.BOOKING_STATUS_COMPLETED) {
  //       BookingDetailsStore.instance.setIsBookingCompleted(true);
  //       BookingDetailsStore.instance.setCurrentBookingId(notification.data.bookingId);
  //     }
  //     store.dispatch(acceptedBookignAction(notification));
  //   }
  //   if (notification.foreground && notification.type != Constants.MESSAGE_TYPE_NOTIFICATION) {
  //     setTimeout(() => {
  //       this.props.navigation.navigate("HomeScreen");
  //     }, 100);
  //   }else if (!notification.foreground) {
  //     setTimeout(() => {
  //       this.props.navigation.navigate("HomeScreen");
  //     }, 100);
  //   }
    
  // }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
        <Text> {stringFile.APP_NAME} </Text>
      </View>
    );
  }
}

function loggedInNavigation() {
  return (
    <MyTabs />
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: ColorConst.THEME_COLOR_ACTIVE_TAB,
        inactiveTintColor: ColorConst.THEME_COLOR_GRAY,
        showLabel: false,
        keyboardHidesTabBar : true
      }}
    >
      <Tab.Screen
        name="Home"
        component={homeStack}
        options={{
          tabBarIcon: (focused) => {
            const tintColor = focused.focused ? ColorConst.THEME_COLOR_ACTIVE_TAB : ColorConst.THEME_COLOR_GRAY;
            return (
              <View>
                <Image
                  style={{ height: 20, width: 20, alignSelf: "center", tintColor: tintColor }}
                  source={require("../assets/icons/home.png")} />
                <View style={{
                  width: 40, height: 2, backgroundColor: focused.focused
                    ? ColorConst.THEME_COLOR_ACTIVE_TAB : ColorConst.THEME_COLOR_WHITE, marginTop: 5
                }} />
              </View>
            );
          }
        }}
      />
      <Tab.Screen
        name="Account"
        component={accountScreen}
        options={{
          tabBarIcon: (focused) => {
            const tintColor = focused.focused ? ColorConst.THEME_COLOR_ACTIVE_TAB : ColorConst.THEME_COLOR_GRAY;
            return (
              <View>
                <Image
                  style={{ height: 20, width: 20, alignSelf: "center", tintColor: tintColor }}
                  source={require("../assets/icons/account.png")} />
                <View style={{
                  width: 40, height: 2, backgroundColor: focused.focused
                    ? ColorConst.THEME_COLOR_ACTIVE_TAB : ColorConst.THEME_COLOR_WHITE, marginTop: 5
                }} />
              </View>
            );
          }
        }}
      />
      <Tab.Screen
        name="Settings"
        component={settingsScreen}
        options={{
          tabBarIcon: (focused) => {
            const tintColor = focused.focused ? ColorConst.THEME_COLOR_ACTIVE_TAB : ColorConst.THEME_COLOR_GRAY;
            return (
              <View>
                <Image
                  style={{ height: 20, width: 20, alignSelf: "center", tintColor: tintColor }}
                  source={require("../assets/icons/settings.png")} />
                <View style={{
                  width: 40, height: 2, backgroundColor: focused.focused
                    ? ColorConst.THEME_COLOR_ACTIVE_TAB : ColorConst.THEME_COLOR_WHITE, marginTop: 5
                }} />
              </View>
            );
          }
        }}
      />
    </Tab.Navigator>
  );
}
function authStack() {
  return (
    <Stack.Navigator headerMode="none" >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="TestClass" component={TestClass} />
      <Stack.Screen name="MobileVerification" component={MobileVerification} />
      <Stack.Screen name="CountryPicker" component={CountryPicker} />
    </Stack.Navigator>
  );
}

function homeStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="PickAddress" component={PickAddress} />
      <Stack.Screen name="SearchAddress" component={SearchAddress} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
    </Stack.Navigator>
  );
}

function accountScreen() {
  return (
    <Stack.Navigator
      headerMode="none"
    >
      <Stack.Screen name="Account" component={Account} />
    </Stack.Navigator>
  );
}

function settingsScreen() {
  return (
    <Stack.Navigator
      headerMode="none"
    >
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ServiceHistoryList" component={ServiceHistoryList} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="CountryPicker" component={CountryPicker} />
    </Stack.Navigator>
  );
}
