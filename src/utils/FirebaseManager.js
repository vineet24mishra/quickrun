import auth from "@react-native-firebase/auth";

export const FirebaseManager = {

  signInWithPhoneNumber: async function(phoneNumber, onSuccess, onError) {
    console.log("phoneNumber ---->>>", phoneNumber);
    
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      onSuccess(confirmation);
    } catch (error) {
      onError(error);
    }
  },
  signOut: function() {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"))
      .catch((error) => console.log("signout", error));
  }

};
