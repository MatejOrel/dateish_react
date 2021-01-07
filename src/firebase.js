import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDpad5gjpgQ5DeMyN6J_C77K4E-bRR3548",
    authDomain: "dateish-clone.firebaseapp.com",
    projectId: "dateish-clone",
    storageBucket: "dateish-clone.appspot.com",
    messagingSenderId: "902900527017",
    appId: "1:902900527017:web:dc6591f0f4290c49b91eb8",
    measurementId: "G-BCYP5EEE93"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const database = firebaseApp.firestore();

  export default database;