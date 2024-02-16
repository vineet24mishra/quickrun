import ActionTypes from "../types/ActionTypes";

export const updateRunnersLocation = (runnerUpdatedData) => ({ type: ActionTypes.UPDATE_RUNNER_LOCATION_SUCCESS, payload: runnerUpdatedData });

export const acceptedBookignAction = (acceptedBookingData) => ({ type: ActionTypes.ACCEPTED_BOOKING, payload: acceptedBookingData });

export const newMessageAction = (newMessageData) => ({ type: ActionTypes.NEW_MESSAGE, payload: newMessageData });

export const isNewMessageAvailable = (isAvailable) => ({ type: ActionTypes.NEW_MESSAGE_AVAILABLE, payload: isAvailable });

export const networkStateAction = (isConnection) => ({ type: ActionTypes.NETWORK_STATE, payload: isConnection });

export const logoutAction = () => ({ type: ActionTypes.LOGOUT });
 