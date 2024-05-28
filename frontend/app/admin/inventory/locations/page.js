"use client"


import React, { useState, useEffect } from 'react';
import MoneyInput from "/components/inputs/MoneyInput.js";
import InventoryCard from "/components/card/inventoryItem.js";
import Button from '@mui/joy/Button';
import Link from 'next/link';
import ItemSearch from '/components/search/itemSearch.js';
import Table from '/components/table/SearchableTable.js';

import {getAllInventoryLocations} from "lib/firebase/inventoryFirebaseLogic" 

import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()
  const [inventoryItems, setInventoryItems] = useState([
  ]);

  const [count, setCount] = useState(0);
  const fields = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'address', numeric: false, disablePadding: true, label: 'Address' },
    
    

   
  ];

  const handleRowSelected = (row) => {
    
    router.push('/admin/inventory/locations/details?locationID='+row.id);
  }

  function ButtonPressed() {
    setInventoryItems([...inventoryItems, { name: `Item 4 ${count}` }]);
    setCount(count + 1);
  }


  useEffect(() => {
    getAllInventoryLocations().then((items) => {
        setInventoryItems(items)
        console.log(items)
      }
      )
  }, []);

  return (
    <div>
      <Table handleRowSelected={handleRowSelected} data={inventoryItems} fields={fields}></Table>

      <br />
      <Link href="./locations/addLocation"><Button color="success">Add Location</Button></Link>
      <br />
      {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {inventoryItems.map((item, index) => (
          <div style={{ flex: '1 1 auto', minWidth: '320px', margin: '8px' }} key={index}>
            <InventoryCard editable={true} name={item.name} />
            
          </div>
        ))}
      </div> */}
      
    </div>
  );
}