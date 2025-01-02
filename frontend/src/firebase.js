import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMbR5rMpr2fVjd7s4rEaauQMt-r7f4ISo",
  authDomain: "studybuddy-a6111.firebaseapp.com",
  projectId: "studybuddy-a6111",
  storageBucket: "studybuddy-a6111.appspot.com",
  messagingSenderId: "997772462483",
  appId: "1:997772462483:web:313fea796626ad0e49c066",
  measurementId: "G-BV2FQN8RDC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;