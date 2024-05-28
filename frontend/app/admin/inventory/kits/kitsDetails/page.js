"use client"
import Card from '@mui/joy/Card';
import Table from '/components/table/Table.js';
import ImageTable from '/components/table/ImageTable.js';
import ItemsDropDown from '/components/dropDown/specific/ItemsDropDown.js';
import Grid   from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/joy/Button';
import { useState, useEffect} from 'react';
import NumberInput from '/components/inputs/NumberInput.js';
import { useSearchParams } from 'next/navigation'
import {addItemToKit, getKitItemsWithDetails, deleteItemFromKit, getKitDetails, getAllUnitsInKit} from '/lib/firebase/inventoryFirebaseLogic';

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  // State to hold the selected item from the dropdown
  const [selectedItem, setSelectedItem] = useState(null);
  // State to hold the quantity of the selected item
  const [quantity, setQuantity] = useState(1);
  // State to hold all items and quantities added to the kit
  const [kitItems, setKitItems] = useState([]);

  const [totalCost, setTotalCost] = useState(0); // This will be a number
  const [kitDetails, setKitDetails] = useState([]); // This will be an array of objects with the shape: [{id: string, name: string}

  const searchParams = useSearchParams()
  
  const kitID = searchParams.get('kitID')

  useEffect(() => {
    getKitItemsWithDetails(kitID).then((items) => {
      if (!items) {
        return
      }
      const itemsWithTotalCost = items.map(item => ({
        ...item,
        totalCost: Number(item.quantity) * Number(item.cost) // Calculate total cost
      }));
      setKitItems(itemsWithTotalCost);
     
      console.log(itemsWithTotalCost);
    });

    getKitDetails(kitID).then((data) => {
      setKitDetails(data);
    })
    

  }, [kitID]);

  useEffect(() => {
    // Calculate the total cost every time the kitItems state changes
    const newTotalCost = kitItems.reduce((total, item) => {
      return total + Number(item.quantity) * Number(item.cost);
    }, 0);
    setTotalCost(newTotalCost);
  }, [kitItems]);
  

  const handleDelete = (id) => {
    // Call the function that removes the item from the kit in Firebase
    // Remove the item from the kitItems state

    setKitItems(kitItems => kitItems.filter(item => item.id !== id));
    deleteItemFromKit(kitID, id);
    
  }


  const itemsFields = [
    { id: 'imageUrl', numeric: false, disablePadding: true, label: '' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'quantity', numeric: false, disablePadding: true, label: 'Quantity' },
    { id: 'totalCost', numeric: false, disablePadding: true, label: 'Total Cost' },
    { id: 'delete', numeric: false, disablePadding: true, label: '' },
  ];

  const [kitUnits, setKitUnits] = useState([]);

  useEffect(() => {
    getAllUnitsInKit(kitID).then(units => {
      console.log(units)
        const flattenedUnits = units.map(unit => ({
            id: unit.id,
            programName: unit.programName? unit.programName : "Unassigned",
            kitName: unit.kit?.name,
            kitId: unit.kit?.id,
            ownerName: unit.unitOwner?.name,
            ownerId: unit.unitOwner?.id,
        }));
        setKitUnits(flattenedUnits);
    }).catch(error => {
        console.error("Error fetching units:", error);
    });
}, [kitID]);

  const unitFields = [
    { id: 'id', numeric: false, disablePadding: true, label: 'Unit ID' },
    
    { id: 'ownerName', numeric: false, disablePadding: true, label: 'Owner Name' },
    { id: 'programName', numeric: false, disablePadding: true, label: 'Program' },

];
  // Function to handle click event of the Add button
  const addItemClicked = () => {
    const numericQuantity = Number(quantity); // Convert quantity to a number to avoid string concatenation
    if (selectedItem && numericQuantity > 0) {
      setKitItems(prevItems => {
        // Check if the item already exists in the kit
        const existingItemIndex = prevItems.findIndex(item => item.id === selectedItem.id);
        if (existingItemIndex >= 0) {
          // If the item exists, update its quantity and total cost
          const updatedItems = [...prevItems];
          const updatedQuantity = Number(updatedItems[existingItemIndex].quantity) +  Number(numericQuantity);
          
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedQuantity,
            totalCost: updatedQuantity * Number(updatedItems[existingItemIndex].cost), // Calculate new total cost
          };
          return updatedItems;
        } else {
          // If the item does not exist, add it to the kit with quantity and total cost
         
          return [
            ...prevItems,
            {
              ...selectedItem,
              quantity: numericQuantity,
              totalCost: numericQuantity * Number(selectedItem.cost), // Calculate total cost
            },
          ];
        }
      });
  
      // Call the function that adds the item to the kit in Firebase
      addItemToKit(kitID, selectedItem.id, numericQuantity);
      
      // Optionally clear the selected item and reset quantity if needed
  
    
    }
  };

  const editPressed = () => {
    router.push(`/admin/inventory/kits/addKits?id=${kitID}`);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        This is the Kits details
      </Typography>
      <Card sx={{ position: 'relative' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>Kit Details</Typography>
            <Typography variant="body1"><strong>Name:</strong> {kitDetails?.name}</Typography>
            <Typography variant="body1"><strong>Description:</strong> {kitDetails?.description}</Typography>
            <Button onClick={editPressed}>Edit</Button>
            {/* Add additional details here */}
          </Grid>
          {/* If there is an image associated with the kit, add an img tag here */}
        </Grid>
      </Card>

      <Card>
                <h1>Kit Units</h1>
                <Table fields={unitFields} data={kitUnits} />
            </Card>
      <Card>
        <h1>Kit Items</h1>
        <ItemsDropDown valueUpdated={(value) => setSelectedItem(value)} />
        <NumberInput value={quantity} valueUpdated={(value) => setQuantity(value)} />
        <Button color="success" onClick={addItemClicked} >Add</Button>
        <ImageTable data={kitItems} fields={itemsFields} handleDelete={handleDelete} />
        <p>Total Cost: {totalCost}</p>
      </Card>
    </div>
  );
}