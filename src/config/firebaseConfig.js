import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyDf3XfB2Ppxnc-1AxD86EkkDgBlFK-mSd4",
    authDomain: "finalproj-fa14d.firebaseapp.com",
    databaseURL: "https://finalproj-fa14d.firebaseio.com",
    projectId: "finalproj-fa14d",
    storageBucket: "finalproj-fa14d.appspot.com",
    messagingSenderId: "385520367094",
    appId: "1:385520367094:web:a4663e1f33d91ff7b7c3d7",
    measurementId: "G-CRGD4BLSTK"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;