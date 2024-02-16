import SocketIO from "socket.io-client";
import { SOCKET_CONNECTION_URL } from "../network/Server";
import {store} from "../redux/store/Store";
import { updateRunnersLocation, newMessageAction, isNewMessageAvailable }  from "../redux/actions/Action";
// import Keys from "../utils/Keys";

var socket = null;

export default class SocketManager {
    static instance = SocketManager.instance || new SocketManager();

    initSocket(userId) {
        socket = new SocketIO(SOCKET_CONNECTION_URL, { query: { "userId": userId } });
        socket.on("connect", () => {
            // Event called when 'someEvent' it emitted by server
            socket.on("connected ----", (data) => {
                console.log("SOCKET_CONNECTION_DATA --->>>", data);
            });
        });
        socket.on("update_user_location_response", (data) => {
            // console.log("SOCKET_CONNECTION_DATA_UPDATE_RUNNER_RESPONSE --->>>", data);
            // store.dispatch(updateRunnersLocation(data.data));
        });

        socket.on("new_message", (data) => {
            console.log("newMessage --->>>", data);
            store.dispatch(newMessageAction(data.data));
            store.dispatch(isNewMessageAvailable(true));

        });
        
        socket.on("send_message_response", (data) => {
            store.dispatch(newMessageAction(data.data));
            console.log("newMessageSentResponse --->>>", data);
        });

        socket.on("runner_location_changed", (data) => {
            console.log("SOCKET_CONNECTION_DATA_UPDATE_RUNNER_RESPONSE --->>>", data);
            store.dispatch(updateRunnersLocation(data.data));
        });
        socket.on("connectionFailed", (data) => { });
    }

    emitSendMessage(bookingId, message, userId) {
        console.log("Socket emit for message--->", bookingId, message, userId);
        socket.emit("send_message", { "bookingId": bookingId, "message": message, "messageBy" : userId });
    }
}

