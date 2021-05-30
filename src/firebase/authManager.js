import { auth, db } from './firebase.js'

export function createNewUser(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password)
            await db.collection("users").doc(userCredential.user.uid).set({email});
            resolve({status: "success", user: userCredential.user})
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            reject({status: "error", errorCode, errorMessage})
        }
    })
}

export function signUserIn(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password)
            resolve({status: "success", user: userCredential.user})
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            reject({status: "error", errorCode, errorMessage})
        }
    })
}