import "firebase/compat/firestore";
import "firebase/compat/storage"; // Import the storage module
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyBhqkXJCVfqfqqdK1Ec3LFSLbjlrRt2X2g",
  authDomain: "rooms-9205e.firebaseapp.com",
  projectId: "rooms-9205e",
  storageBucket: "rooms-9205e.appspot.com",
  messagingSenderId: "482504027885",
  appId: "1:482504027885:web:a3a3e4d70ee3dda269e6e4",
  measurementId: "G-C6R4VXRTE5",
};

firebase.initializeApp(firebaseConfig);
const store = firebase.firestore();
const storage = firebase.storage(); // Initialize the storage object

export { store, storage };
