"use client"


import React, { useState, useEffect } from 'react';
import MoneyInput from "/components/inputs/MoneyInput.js";
import InventoryCard from "/components/card/inventoryItem.js";
import Button from '@mui/joy/Button';
import Link from 'next/link';
import ItemSearch from '/components/search/itemSearch.js';
import ImageTable from '/components/table/ImageTable.js';
import Table from '/components/table/Table.js'

import {getAllKits} from "lib/firebase/inventoryFirebaseLogic" 

import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()
  const [kits, setKits] = useState([
  ]);

  const [count, setCount] = useState(0);
  const fields = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
    
   
  ];

  const handleRowSelected = (row) => {
    
    router.push('/admin/inventory/kits/kitsDetails?kitID='+row.id);
  }

  function ButtonPressed() {
    setKits([...kits, { name: `Item 4 ${count}` }]);
    setCount(count + 1);
  }


  useEffect(() => {
    getAllKits().then((items) => {
        setKits(items)
        console.log(items)
      }
      )
  }, []);

  return (
    <div>
      <ItemSearch></ItemSearch>
      <Table handleRowSelected={handleRowSelected} data={kits} fields={fields}></Table>

      <br />
      <Link href="./kits/addKits"><Button color="success">Add Kit</Button></Link>
      <br />
      {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {Kits.map((item, index) => (
          <div style={{ flex: '1 1 auto', minWidth: '320px', margin: '8px' }} key={index}>
            <InventoryCard editable={true} name={item.name} />
            
          </div>
        ))}
      </div> */}
      
    </div>
  );
}