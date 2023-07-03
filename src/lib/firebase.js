// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE,
  authDomain: "m1gp-e55d6.firebaseapp.com",
  projectId: "m1gp-e55d6",
  storageBucket: "m1gp-e55d6.appspot.com",
  messagingSenderId: "473772223724",
  appId: "1:473772223724:web:45962ace732c652c2ec9c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
