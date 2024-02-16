import { combineReducers } from "redux";
import   ActionTypes  from "../types/ActionTypes";

const initialState = {
    runnerLocation: {},
    acceptedBookingData : {},
    newMessageData : {},
    isNewMessageAvailable : false,
    isConnectionAvailabel: true
};

const runnerLocationUpdateReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_RUNNER_LOCATION_SUCCESS:
            return {
                ...state,
                runnerLocation: action.payload
            };
        default:
            return state;
    }
};

const acceptedBookingReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.ACCEPTED_BOOKING:
            return {
                ...state,
                acceptedBookingData: action.payload
            };
        default:
            return state;
    }
};

const newMessageDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.NEW_MESSAGE:
            return {
                ...state,
                newMessageData: action.payload
            };
        default:
            return state;
    }
};

const isNewUserMessageAvialableReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.NEW_MESSAGE_AVAILABLE:
            return {
                ...state,
                isNewMessageAvailable: action.payload
            };
        default:
            return state;
    }
};

const isNetworkStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.NETWORK_STATE:
            return {
                ...state,
                isConnectionAvailabel: action.payload
            };
        default:
            return state;
    }
};


const appReducer = combineReducers({
    updateRunnersLocation : runnerLocationUpdateReducer,
    acceptedBookignAction : acceptedBookingReducer,
    newMessageAction : newMessageDataReducer,
    isNewMessageAvailable : isNewUserMessageAvialableReducer,
    networkStateAction : isNetworkStateReducer
});

export const rootReducer = (state, action) => {
	if (action.type == ActionTypes.LOGOUT) {
		state = undefined;
	}
	return appReducer(state, action);
};
