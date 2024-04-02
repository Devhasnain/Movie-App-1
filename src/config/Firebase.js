import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr-YEf1DHH6HKJxO1f0jR4M1br0OiYOSo",
  authDomain: "my-movies-and-tvs-show-list.firebaseapp.com",
  projectId: "my-movies-and-tvs-show-list",
  storageBucket: "my-movies-and-tvs-show-list.appspot.com",
  messagingSenderId: "923340593876",
  appId: "1:923340593876:web:eb8032a56aba40118e3941",
  measurementId: "G-SFG7D38BXS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
