"use client"


import React, { useState, useEffect } from 'react';
import MoneyInput from "/components/inputs/MoneyInput.js";
import InventoryCard from "/components/card/inventoryItem.js";
import Button from '@mui/joy/Button';
import Link from 'next/link';
import ItemSearch from '/components/search/itemSearch.js';
import ImageTable from '/components/table/ImageTable.js';
import Card from '@mui/joy/Card';
import {getAllItems} from "lib/firebase/inventoryFirebaseLogic" 

import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()
  const [inventoryItems, setInventoryItems] = useState([
  ]);

  const [count, setCount] = useState(0);
  const fields = [
    { id: 'imageUrl', numeric: false, disablePadding: true, label: '' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'quantity', numeric: false, disablePadding: true, label: 'Quantity' },
    { id: 'cost', numeric: false, disablePadding: true, label: 'Cost' },
    
    

   
  ];

  const handleRowSelected = (row) => {
    
    router.push('/admin/inventory/items/itemDetails?itemID='+row.id);
  }

  function ButtonPressed() {
    setInventoryItems([...inventoryItems, { name: `Item 4 ${count}` }]);
    setCount(count + 1);
  }


  useEffect(() => {
      getAllItems().then((items) => {
        setInventoryItems(items)
        console.log(items)
      }
      )
  }, []);

  return (
    <div>
      <ItemSearch></ItemSearch>
      <Card>
        <ImageTable handleRowSelected={handleRowSelected} data={inventoryItems} fields={fields}></ImageTable>
      </Card>
      <br />
      <Link href="./items/addItems"><Button color="success">Add Items</Button></Link>
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