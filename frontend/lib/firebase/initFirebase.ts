

import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator   } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import { getFunctions, connectFunctionsEmulator, httpsCallable  } from 'firebase/functions';

import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { Storage } from 'firebase/storage';
import { Functions } from 'firebase/functions';


// ... other firebase imports

const firebaseApp = initializeApp(firebaseConfig)
export const db: Firestore = getFirestore(firebaseApp);
// connectFirestoreEmulator(db, '127.0.0.1', 8080);

export const auth: Auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);

export const functions  = getFunctions(firebaseApp);
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);
