import {
    db,
    auth
} from './initFirebase'
import {
    collection,
    doc,
    getDocs,
    updateDoc,
    deleteDoc,
    getCountFromServer,
    where,
    query,
    QuerySnapshot,
    setDoc,
    addDoc,
    getDoc
} from "firebase/firestore";



export const dbref = db;




export const addItemToItemsCollection = async (itemData) => {
    try {
        // Create a new document reference for an item in the 'items' collection
        const itemRef = doc(collection(db, "items"));

        // Set the document with the provided item data
        await setDoc(itemRef, itemData);

        console.log("Item added with ID:", itemRef.id);
        return itemRef.id; // Optionally, return the newly created document ID
    } catch (error) {
        console.error("Error adding item:", error);
        throw error; // Optional: throw the error to handle it in the calling function
    }
};

export const getAllKits = async () => {
  try {
      // Reference to the 'kits' collection
      const kitsCollectionRef = collection(db, "kits");

      // Create a query against the collection
      const q = query(kitsCollectionRef);

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Extract the data from each document
      const kits = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      }));

      console.log("Kits fetched successfully");
      return kits; // Returns an array of kit objects
  } catch (error) {
      console.error("Error fetching kits:", error);
      throw error; // Optional: throw the error to handle it in the calling function
  }
};


export const getAllItems = async () => {
    try {
      // Reference to the 'items' collection
      const itemsCollectionRef = collection(db, "items");
  
      // Create a query against the collection
      const q = query(itemsCollectionRef);
  
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Extract the data from each document
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      console.log("Items fetched successfully");
      return items; // Returns an array of item objects
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error; // Optional: throw the error to handle it in the calling function
    }
  };
  
  export const getAllUnits = async () => {
    try {
        // Reference to the 'units' collection
        const unitsCollectionRef = collection(db, "units");

        // Create a query against the collection
        const q = query(unitsCollectionRef);

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Extract the data from each document
        const units = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Units fetched successfully");
        return units; // Returns an array of unit objects
    } catch (error) {
        console.error("Error fetching units:", error);
        throw error; // Optional: throw the error to handle it in the calling function
    }
};


export const addKitToKitsCollection = async (kitData) => {
    try {
        // Create a new document reference for a kit in the 'kits' collection
        const kitRef = doc(collection(db, "kits"));

        // Set the document with the provided kit data
        await setDoc(kitRef, kitData);

        console.log("Kit added with ID:", kitRef.id);
        return kitRef.id; // Optionally, return the newly created document ID
    } catch (error) {
        console.error("Error adding kit:", error);
        throw error; // Optional: throw the error to handle it in the calling function
    }
};

export const addOrUpdateUnit = async (unitData) => {
    try {
        // Reference to the 'units' collection
        const unitsCollectionRef = collection(db, "units");

        // Create a query to find an existing unit with the matching 'id' field
        const q = query(unitsCollectionRef, where("id", "==", unitData.id));

        // Execute the query
        const querySnapshot = await getDocs(q);

        let unitRef;

        if (!querySnapshot.empty) {
            // If a unit with the same id exists, use its document reference
            unitRef = querySnapshot.docs[0].ref;
            console.log(`Updating existing unit with ID: ${unitData.id}`);
        } else {
            // If no such unit exists, create a new document reference
            unitRef = doc(collection(db, "units"));
            console.log(`Adding new unit with ID: ${unitData.id}`);
        }

        // Set or update the document with the provided unit data
        await setDoc(unitRef, unitData);

        return unitRef.id; // Return the document ID
    } catch (error) {
        console.error("Error adding or updating unit:", error);
        throw error;
    }
};

export const addItemToKit = async (kitID, itemID, quantity) => {
    try {
        // Query for the specific kit document in the 'kits' collection where 'id' field matches kitID
        const kitsCollectionRef = collection(db, "kits");
        const querySnapshot = await getDocs(query(kitsCollectionRef, where("id", "==", kitID)));

        // Check if the kit exists
        if (querySnapshot.empty) {
            console.log(`Kit with ID ${kitID} does not exist.`);
            return;
        }

        // Assuming there's only one kit with the given id
        const kitDocRef = querySnapshot.docs[0].ref;
        const kitData = querySnapshot.docs[0].data();

        // Update the items array - add new item or update quantity if it already exists
        const updatedItems = kitData.items || [];
        const existingItemIndex = updatedItems.findIndex(item => item.itemID === itemID);
        
        if (existingItemIndex >= 0) {
            // Update quantity of existing item
            updatedItems[existingItemIndex].quantity = Number(updatedItems[existingItemIndex].quantity) + Number(quantity);
        } else {
            // Add new item
            updatedItems.push({ itemID, quantity });
        }

        // Save the updated kit data back to Firestore
        await updateDoc(kitDocRef, { items: updatedItems });

        console.log(`Item ${itemID} added to kit ${kitID} successfully.`);
    } catch (error) {
        console.error("Error adding item to kit:", error);
        throw error;
    }
};
export const deleteItemFromKit = async (kitID, itemID) => {
    try {
         // Reference to the 'kits' collection
         const kitsCollectionRef = collection(db, "kits");

         // Create a query to find the kit with the matching 'id' field
         const q = query(kitsCollectionRef, where("id", "==", kitID));
 
         // Execute the query
         const querySnapshot = await getDocs(q);
 
         // Check if the kit exists
         if (querySnapshot.empty) {
             console.log(`Kit with ID ${kitID} does not exist.`);
             return;
         }
 
         // Assuming there's only one kit with the given id
         const kitDocRef = querySnapshot.docs[0].ref;
         const kitData = querySnapshot.docs[0].data();

        // Check if the kit contains the item and remove it
        const updatedItems = kitData.items || [];
        const itemIndex = updatedItems.findIndex(item => item.itemID === itemID);
        
        if (itemIndex >= 0) {
            // Remove the item
            updatedItems.splice(itemIndex, 1);
        } else {
            console.log(`Item with ID ${itemID} not found in kit ${kitID}.`);
            return;
        }

        // Save the updated kit data back to Firestore
        await updateDoc(kitDocRef, { items: updatedItems });

        console.log(`Item ${itemID} deleted from kit ${kitID} successfully.`);
    } catch (error) {
        console.error("Error deleting item from kit:", error);
        throw error;
    }
};

export const getKitItemsWithDetails = async (kitID) => {
    try {
        // Reference to the specific kit document in the 'kits' collection
        const kitsCollectionRef = collection(db, "kits");
        const kitQuerySnapshot = await getDocs(query(kitsCollectionRef, where("id", "==", kitID)));

        // Check if the kit exists
        if (kitQuerySnapshot.empty) {
            console.log(`Kit with ID ${kitID} does not exist.`);
            return;
        }

        // Assuming there's only one kit with the given id
        const kitData = kitQuerySnapshot.docs[0].data();

        // Check if the kit contains any items
        if (!kitData.items || kitData.items.length === 0) {
            console.log(`Kit with ID ${kitID} does not contain any items.`);
            return;
        }
        // Fetch details for each item in the kit
        const itemsCollectionRef = collection(db, "items");
        const itemsDetails = [];

        for (const item of kitData.items) {
            const q = query(itemsCollectionRef, where("id", "==", item.itemID));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                itemsDetails.push({ 
                    id: doc.id, 
                    quantity: item.quantity, 
                    ...doc.data() 
                });
            });
        }

        console.log(`Items details for kit ${kitID} fetched successfully.`);
        return itemsDetails; // Returns an array of item details with quantity
    } catch (error) {
        console.error("Error getting items details from kit:", error);
        throw error;
    }
};

export const getKitDetails = async (kitID) => {
    if (!kitID) {
        console.error("Kit ID is required");
        return null;
    }

    try {
        // Create a query to find the kit document by the 'id' field
        const kitsCollectionRef = collection(db, "kits");
        const kitQuery = query(kitsCollectionRef, where("id", "==", kitID));

        // Execute the query
        const querySnapshot = await getDocs(kitQuery);
        if (querySnapshot.empty) {
            console.log(`Kit with ID ${kitID} does not exist.`);
            return null;
        }

        // Assuming only one document will match, as 'id' should be unique
        const kitDocSnapshot = querySnapshot.docs[0];
        const kitData = kitDocSnapshot.data();

        // Check if the kit contains any items
        if (!kitData.items || kitData.items.length === 0) {
            console.log(`Kit with ID ${kitID} does not contain any items.`);
            return { ...kitData, itemsDetails: [] };
        }

        // Fetch details for each item in the kit
        const itemsDetails = [];

        for (const itemRef of kitData.items) {
            const itemDocRef = doc(db, "items", itemRef.itemID);
            const itemDocSnapshot = await getDoc(itemDocRef);

            if (itemDocSnapshot.exists()) {
                itemsDetails.push({
                    id: itemDocSnapshot.id,
                    ...itemDocSnapshot.data(),
                    quantity: itemRef.quantity
                });
            }
        }

        console.log(`Kit details for ID ${kitID} fetched successfully.`);
        return { ...kitData, itemsDetails }; // Returns kit details including array of item details with quantity
    } catch (error) {
        console.error("Error getting kit details:", error);
        throw error;
    }
};
export const getItemWithID = async (itemID) => {
    if (!itemID) {
        console.error("Item ID is required");
        return null;
    }

    try {
        // Reference to the 'items' collection
        const itemsCollectionRef = collection(db, "items");

        // Create a query to find the item with the matching 'id' field
        const q = query(itemsCollectionRef, where("id", "==", itemID));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Assuming 'id' is unique, there should be only one document
            const itemDoc = querySnapshot.docs[0];
            console.log(`Item with ID ${itemID} fetched successfully.`);
            return { docId: itemDoc.id, ...itemDoc.data() }; // docId is the Firestore document ID
        } else {
            console.log(`Item with ID ${itemID} does not exist.`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching item with ID:", error);
        throw error;
    }
};

export const getUnitWithID = async (unitID) => {
    if (!unitID) {
        console.error("No unit ID provided");
        return null;
    }

    try {
        // Reference to the 'units' collection
        const unitsCollectionRef = collection(db, "units");

        // Create a query to find the unit with the matching 'id' field
        const q = query(unitsCollectionRef, where("id", "==", unitID));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const unitDoc = querySnapshot.docs[0]; // Assuming 'id' is unique and there's only one match
            console.log(`Unit with ID ${unitID} fetched successfully.`);
            return { docId: unitDoc.id, ...unitDoc.data() }; // docId is the Firestore document ID
        } else {
            console.log(`Unit with ID ${unitID} does not exist.`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching unit with ID:", error);
        throw error;
    }
};

export const getAllInventoryLocations = async () => {
    try {
        // Reference to the 'inventoryLocations' collection
        const inventoryLocationsCollectionRef = collection(db, "inventoryLocations");

        // Create a query against the collection
        const q = query(inventoryLocationsCollectionRef);

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Extract the data from each document
        const inventoryLocations = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Inventory Locations fetched successfully");
        return inventoryLocations; // Returns an array of inventory location objects
    } catch (error) {
        console.error("Error fetching inventory locations:", error);
        throw error; // Optional: throw the error to handle it in the calling function
    }
};

export const getLocationDetails = async (locationID) => {
    if (!locationID) {
        console.error("Location ID is required");
        return null;
    }

    try {
        // Reference to the 'inventoryLocations' collection
        const locationsCollectionRef = collection(db, "inventoryLocations");

        // Create a query against the collection where 'locationID' matches the given ID
        const q = query(locationsCollectionRef, where("id", "==", locationID));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Assuming there is only one document per location ID
            const locationDoc = querySnapshot.docs[0];
            console.log(`Location details for ID ${locationID} fetched successfully.`);
            return { id: locationDoc.id, ...locationDoc.data() };
        } else {
            console.log(`Location with ID ${locationID} does not exist.`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching location details:", error);
        throw error;
    }
};

interface InventoryData {
    items: string[];
    // Include other properties of the inventory document if there are any
}


export const addItemsToInventoryLocation = async (locationID: string, itemIDs: string[]): Promise<void> => {
    if (!locationID || !Array.isArray(itemIDs) || itemIDs.length === 0) {
        console.error("Invalid parameters: locationID and itemIDs are required");
        return;
    }

    try {
        // Reference to the specific inventory document in the 'inventory' collection
        const inventoryDocRef = doc(db, "inventory", locationID);

        // Check if the document already exists
        const docSnapshot = await getDoc(inventoryDocRef);

        // Initialize inventoryData with a default structure
        let inventoryData: InventoryData = { items: [] };

        if (docSnapshot.exists()) {
            // Assert the type of the data
            const data = docSnapshot.data();
            if (typeof data === 'object' && data !== null && 'items' in data) {
                inventoryData = data as InventoryData;
            }
        }

        // Update the items array - add new items
        const updatedItems = new Set([...inventoryData.items, ...itemIDs]);
        inventoryData.items = Array.from(updatedItems);

        // Save the updated inventory data back to Firestore
        await setDoc(inventoryDocRef, inventoryData);

        console.log(`Items added to inventory at location ${locationID} successfully.`);
    } catch (error) {
        console.error("Error adding items to inventory:", error);
        throw error;
    }
};

export const getAllUnitsInKit = async (kitID) => {
    try {
        // Reference to the 'units' collection
        const unitsCollectionRef = collection(db, "units");

        // Create a query to find units with the matching 'kit.id' field
        const q = query(unitsCollectionRef, where("kit.id", "==", kitID));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Extract the data from each document
        const units = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`Units for kit ${kitID} fetched successfully.`);
        return units; // Returns an array of unit objects
    } catch (error) {
        console.error(`Error fetching units for kit ${kitID}:`, error);
        throw error;
    }
};

export const getAllOwners = async () => {
    try {
        // Reference to the 'teachers' collection
        const teachersCollectionRef = collection(db, "employees");

        // Create a query against the 'teachers' collection
        const teachersQuery = query(teachersCollectionRef);

        // Execute the query for teachers
        const teachersSnapshot = await getDocs(teachersQuery);

        // Extract the data from each document in the teachers collection
        const teachers = teachersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Reference to the 'locations' collection
        const locationsCollectionRef = collection(db, "inventoryLocations");

        // Create a query against the 'locations' collection
        const locationsQuery = query(locationsCollectionRef);

        // Execute the query for locations
        const locationsSnapshot = await getDocs(locationsQuery);

        // Extract the data from each document in the locations collection
        const locations = locationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Combine teachers and locations into a single array
        const owners = [...teachers, ...locations];

        console.log("Teachers and Locations fetched successfully");
        return owners; // Returns an object containing arrays of teachers and locations
    } catch (error) {
        console.error("Error fetching owners (teachers and locations):", error);
        throw error;
    }
};


export const getUnitWithProgramID = async (programID) => {
    if (!programID) {
        console.error("Program ID is required");
        return null;
    }

    try {
        // Reference to the 'units' collection
        const unitsCollectionRef = collection(db, "units");

        // Create a query to find units with the matching 'programID' field
        const q = query(unitsCollectionRef, where("programID", "==", programID));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Assuming 'programID' is unique, there should be only one document
            const unitDoc = querySnapshot.docs[0];
            console.log(`Unit with Program ID ${programID} fetched successfully.`);
            return { docId: unitDoc.id, ...unitDoc.data() }; // docId is the Firestore document ID
        } else {
            console.log(`Unit with Program ID ${programID} does not exist.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching unit with Program ID ${programID}:`, error);
        throw error;
    }
};