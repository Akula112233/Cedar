import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCkDGMomPAL6VycFfTtCcDqMiVe5Ej8Y-0",
    authDomain: "cedar-b2b1f.firebaseapp.com",
    projectId: "cedar-b2b1f",
    storageBucket: "cedar-b2b1f.appspot.com",
    messagingSenderId: "536191681198",
    appId: "1:536191681198:web:f3530d37bd25e04790633f"
};

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()
