const BASE_URL = "http://3.12.244.11:3030/api/v1";
export const SOCKET_CONNECTION_URL = "http://3.12.244.11:3030/users";

// const BASE_URL = "http://192.168.1.171:3030/api/v1";
// export const SOCKET_CONNECTION_URL = "http://192.168.1.171:3030/users";

export const Server = {
  SIGN_UP_URL_STEP_ONE: `${BASE_URL}/auth/user-registration-step-1`,
  SIGN_UP_URL_STEP_TWO: `${BASE_URL}/auth/user-registration-step-2`,
  LOGIN_URL: `${BASE_URL}/auth/user-login`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/user-forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/auth/user-reset-password`,
  ESTIMATED_AMOUNT: `${BASE_URL}/user/estimated-amount?`,
  CONFIRM_PICKUP_REQUEST : `${BASE_URL}/booking/search-runner`,
  RESEND_OTP: `${BASE_URL}/auth/send-phone-verify-otp`,
  SEND_USER_OTP: `${BASE_URL}/auth/user-send-otp`,
  GET_ITEM_LIST : `${BASE_URL}/item`,
  RUNNERS_DETAILS : `${BASE_URL}/booking/current-booking/`,
  CANCEL_REQUEST : `${BASE_URL}/booking/cancel-by-user/`,
  UPDATE_DEVICE_TOKEN : `${BASE_URL}/user/device-token`,
  DELETE_TOKEN : `${BASE_URL}/user/device-token`,
  GET_BOOKING_LIST : `${BASE_URL}/booking/user-booking-history?page=`,
  GET_BOOKING_DETAILS : `${BASE_URL}/booking/user-running-booking`,
  GET_BOOKING_CHAT_LIST : `${BASE_URL}/booking/user-chat-list/`,
  EDIT_PROFILE : `${BASE_URL}/user/`
};

