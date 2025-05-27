// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyDmba1FF3ZkiIIPLNXkwE9T0P-c8IpWCTY",
    authDomain: "bhiruds-record-management.firebaseapp.com",
    projectId: "bhiruds-record-management",
    storageBucket: "bhiruds-record-management.appspot.com",
    messagingSenderId: "1033416769777",
    appId: "1:1033416769777:web:c9947d51780f60fb3a2950"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
