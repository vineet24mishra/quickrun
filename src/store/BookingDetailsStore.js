import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";

export default class BookingDetailsStore {
  static instance = BookingDetailsStore.instance || new BookingDetailsStore();
  isBookingCompleted = false;
  currentBookingId = "";
  isBooking = false;

  setIsBookingCompleted(isBookingCompleted){
    this.isBookingCompleted = isBookingCompleted;
  }
  setCurrentBookingId(bookingId){
    this.currentBookingId = bookingId;
  }
  setIsBookingAvaiable(currentBooking) {
    console.log(currentBooking);
    this.isBooking = currentBooking;
  }

  getIsBookingCompleted(){
    return this.isBookingCompleted;
  }
  getBookingId(){
    return this.currentBookingId;
  }
  getIsBookingAvailabel() {
    return this.isBooking;
  }

  persistBookedRunnerDetails = async(runnersDetails) => {
    this.storeDetails(Constants.BOOKING_DETAILS_RUNNERS, runnersDetails);
  }

  persistBookingId = (bookingId) => {
    this.storeDetails(Constants.BOOKING_ID, bookingId);
   }

   persistBookingStartTime = (time) => {
    this.storeDetails(Constants.SERVICE_START_TIME, time);
   }

   persistBookingAcceptTime = (time) => {
    this.storeDetails(Constants.SERVICE_ACCEPT_TIME, time);
   }

   persistBookingDeliveredTime = (time) => {
    this.storeDetails(Constants.SERVICE_END_TIME, time);
   }

   persistCurrentBookinData = (data) => {
     this.storeDetails(Constants.CURRENT_BOOKING_STATUS, data)
   }

  storeDetails = async(key, value) => {
    if (key == Constants.BOOKING_DETAILS_RUNNERS) {
      try {
        var bookingDetails = await AsyncStorage.setItem(key, JSON.stringify(value));
        return bookingDetails;
      } catch (error) { }
    } else if (key == Constants.BOOKING_ID) {
      try {
        const bookingId = await AsyncStorage.setItem(key, value);
        return bookingId;
      } catch (error) { }
    }else if (key == Constants.SERVICE_ACCEPT_TIME) {
      try {
        const serviceAcceptTime = await AsyncStorage.setItem(key, JSON.stringify(value));
        return serviceAcceptTime;
      } catch (error) { }
    } 
    else if (key == Constants.SERVICE_START_TIME) {
      try {
        const serviceStartTime = await AsyncStorage.setItem(key, JSON.stringify(value));
        return serviceStartTime;
      } catch (error) { }
    }else if (key == Constants.SERVICE_END_TIME) {
      try {
        const serviceEndTime = await AsyncStorage.setItem(key, JSON.stringify(value));
        return serviceEndTime;
      } catch (error) { }
    } else if(Constants.CURRENT_BOOKING_STATUS) {
      try {
        const currentBooking = await AsyncStorage.setItem(key, JSON.stringify(value));
        console.log(currentBooking);
        return currentBooking;
      } catch (error) { }
    }
  }

  retrieveBookedRunnerDetails = async() => {
    try {
      const value = await AsyncStorage.getItem(Constants.BOOKING_DETAILS_RUNNERS);
      const runnersDetails = JSON.parse(value);
      if (runnersDetails !== null) {
        return runnersDetails;
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  retrieveCurrentBookingDetail = async() => {
    try {
      const value = await AsyncStorage.getItem(Constants.CURRENT_BOOKING_STATUS);
      const currentData = JSON.parse(value);
      if (currentData !== null) {
        return currentData;
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  retrieveBookingId = async() => {
    try {
        const bookingId = await AsyncStorage.getItem(Constants.BOOKING_ID);
        return bookingId;
      } catch (error) {
        // Error retrieving data
      }
  }

  retrieveAcceptTime = async() => {
    try {
      const acceptTime = await AsyncStorage.getItem(Constants.SERVICE_ACCEPT_TIME);
      const acceptTimeInfo = JSON.parse(acceptTime);
      if (acceptTimeInfo !== null) {
        return acceptTimeInfo;
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  retrieveStartTime = async() => {
    try {
      const startTime = await AsyncStorage.getItem(Constants.SERVICE_START_TIME);
      const startTimeInfo = JSON.parse(startTime);
      if (startTimeInfo !== null) {
        return startTimeInfo;
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  retrieveServiceEndTime = async() => {
    try {
        const endTime = await AsyncStorage.getItem(Constants.SERVICE_END_TIME);
        const endTimeInfo = JSON.parse(endTime);
      if (endTimeInfo !== null) {
        return endTimeInfo;
      }
      } catch (error) {
        // Error retrieving data
      }
  }


  deleteBookedRunnerDetails = async() => {
    try {
      await AsyncStorage.removeItem(Constants.BOOKING_DETAILS_RUNNERS);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  deleteBookingId = async() => {
    try {
      await AsyncStorage.removeItem(Constants.BOOKING_ID);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  deleteAcceptTime = async() => {
    try {
      await AsyncStorage.removeItem(Constants.SERVICE_ACCEPT_TIME);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  deleteStartTime = async() => {
    try {
      await AsyncStorage.removeItem(Constants.SERVICE_START_TIME);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  deleteEndTime = async() => {
    try {
      await AsyncStorage.removeItem(Constants.SERVICE_END_TIME);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  deleteCurrentBookingData = async() => {
    try {
      await AsyncStorage.removeItem(Constants.CURRENT_BOOKING_STATUS);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  deleteAllDetails = () => {
    this.deleteBookedRunnerDetails();
    this.deleteBookingId();
    this.deleteAcceptTime();
    this.deleteStartTime();
    this.deleteEndTime();
    this.deleteCurrentBookingData();
  }

}
