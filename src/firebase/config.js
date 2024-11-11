// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-XD2XQFfKPUwgKjU-Lsa0aLcff_CGxIw",
  authDomain: "trusty-art-431605-m2.firebaseapp.com",
  projectId: "trusty-art-431605-m2",
  storageBucket: "trusty-art-431605-m2.firebasestorage.app",
  messagingSenderId: "393491337714",
  appId: "1:393491337714:web:35c7c95e0566a6962bdb6b",
  measurementId: "G-LLWR9Z289Q",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");
export { auth, facebookProvider, signInWithPopup };
