"use client"
import Card from '@mui/joy/Card';
import Table from '/components/table/Table.js';
import ImageTable from '/components/table/ImageTable.js';
import ItemsDropDown from '/components/dropDown/specific/ItemsDropDown.js';
import Button from '@mui/joy/Button';
import { useState, useEffect} from 'react';
import NumberInput from '/components/inputs/NumberInput.js';
import { useSearchParams } from 'next/navigation'
import {addItemToKit, getKitItemsWithDetails} from '/lib/firebase/inventoryFirebaseLogic';
export default function Home() {
  
  const searchParams = useSearchParams()
  
  

  useEffect(() => {
    getKitItemsWithDetails().then((items) => {
      const itemsWithTotalCost = items.map(item => ({
        ...item,
        totalCost: Number(item.quantity) * Number(item.cost) // Calculate total cost
      }));
      setKitItems(itemsWithTotalCost);
      console.log(itemsWithTotalCost);
    });
  }, [kitID]);

  // State to hold the selected item from the dropdown
  const [selectedItem, setSelectedItem] = useState(null);
  // State to hold the quantity of the selected item
  const [quantity, setQuantity] = useState(1);
  // State to hold all items and quantities added to the kit
  const [kitItems, setKitItems] = useState([]);

  const itemsFields = [
    { id: 'imageUrl', numeric: false, disablePadding: true, label: '' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'quantity', numeric: false, disablePadding: true, label: 'Quantity' },
    { id: 'totalCost', numeric: false, disablePadding: true, label: 'Total Cost' },
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
  return (
    <div>
      <h1>This is the Kits details</h1>
      <Card>
        <h1>Kit Units</h1>
        <Table>
          {/* Render kit units here */}
        </Table>
      </Card>
      <Card>
        <h1>Kit Items</h1>
        <ItemsDropDown valueUpdated={(value) => setSelectedItem(value)} />
        <NumberInput value={quantity} valueUpdated={(value) => setQuantity(value)} />
        <Button color="success" onClick={addItemClicked}>Add</Button>
        <ImageTable data={kitItems} fields={itemsFields} />
      </Card>
    </div>
  );
}