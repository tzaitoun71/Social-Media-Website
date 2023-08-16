// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
//const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence); // Use browserSessionPersistence
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };