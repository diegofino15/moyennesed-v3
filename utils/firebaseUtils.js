import firebase from "firebase/compat";

const firebaseConfig = {
  apiKey: "AIzaSyAoUUXCKt6xvBfcCyV3bIz9AF-UKGJ-LOo",
  authDomain: "moyennesed-v3.firebaseapp.com",
  projectId: "moyennesed-v3",
  storageBucket: "moyennesed-v3.appspot.com",
  messagingSenderId: "580869240703",
  appId: "1:580869240703:web:d941b6d8db5094739c0c4a",
  measurementId: "G-NG2QE34NTX"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };