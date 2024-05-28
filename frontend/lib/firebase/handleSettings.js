

import { use } from 'react';
import {
    db,
    auth
} from '../firebase/initFirebase'

import { collection, query, where, getDocs } from 'firebase/firestore';





export const getConfigurations = async () => {
    const configurationsRef = collection(db, 'configurations'); // Reference to the configurations collection
    try {
        const querySnapshot = await getDocs(configurationsRef);
        const configurations = {};

        querySnapshot.forEach((doc) => {
            // Use the document ID as the key and the document data as the value
            configurations[doc.id] = doc.data();
        });

        console.log("Configurations:", configurations);
        return configurations;
    } catch (error) {
        console.error("Error fetching configurations:", error);
        return null;
    }
};