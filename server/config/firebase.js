import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAMpeDEUisFVOnVog6jyeQlAKccb_kn9b8",
    authDomain: "paper-f4198.firebaseapp.com",
    projectId: "paper-f4198",
    storageBucket: "paper-f4198.firebasestorage.app",
    messagingSenderId: "619998441166",
    appId: "1:619998441166:web:55c0eaff2f3eab2cb26a9f",
    measurementId: "G-F7JMZJT1X7"
  };


const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

export const initializeFirebase = () => {
  return { storage, db };
};

export { storage, db };
