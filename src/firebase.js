import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDpvwxb1lV668c_j0NFD_Fk_fhc_rGWM6g",
  authDomain: "dateish-5d381.firebaseapp.com",
  databaseURL: "https://dateish-5d381.firebaseio.com",
  projectId: "dateish-5d381",
  storageBucket: "dateish-5d381.appspot.com",
  messagingSenderId: "489283104479",
  appId: "1:489283104479:web:c779f5778b34533c16436a",
  measurementId: "G-NCL6JW5FWE"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();

export { database, firebaseApp };