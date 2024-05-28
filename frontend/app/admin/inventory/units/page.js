"use client"


import React, { useState, useEffect } from 'react';
import MoneyInput from "/components/inputs/MoneyInput.js";

import Button from '@mui/joy/Button';
import Link from 'next/link';

import ImageTable from '/components/table/ImageTable.js';

import {getAllUnits} from "lib/firebase/inventoryFirebaseLogic" 

import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()
  const [inventoryUnits, setInventoryUnits] = useState([
  ]);

  const [count, setCount] = useState(0);
  const fields = [
    { id: 'id', numeric: false, disablePadding: true, label: 'id' },
    { id: 'kitName', numeric: false, disablePadding: true, label: 'Kit Name' },
    { id: 'owner', numeric: false, disablePadding: true, label: 'Owner' },
    { id: 'programName', numeric: false, disablePadding: true, label: 'Program' },

    
    

   
  ];

  const handleRowSelected = (row) => {
    
    router.push('/admin/inventory/units/details?unitID='+row.id);
  }

  function ButtonPressed() {
    setInventoryUnits([...inventoryUnits, { name: `Unit 4 ${count}` }]);
    setCount(count + 1);
  }


  useEffect(() => {
    getAllUnits().then((units) => {
      // Transforming each unit into the expected structure
      const transformedUnits = units.map(unit => ({
        id: unit.id,
        kitName: unit.kit?.name || 'No Kit', // Assuming 'kit' might not be present
        owner: unit.unitOwner?.name || 'No Owner', // Assuming 'unitOwner' might not be present
        programName: unit.programName || 'Unassigned' // Assuming 'program' might not be present
      }));
      
      setInventoryUnits(transformedUnits);
      console.log(transformedUnits);
    });
  }, []);

  return (
    <div>
   
      <ImageTable handleRowSelected={handleRowSelected} data={inventoryUnits} fields={fields}></ImageTable>

      <br />
      <Link href="./units/addUnit"><Button color="success">Add Unit</Button></Link>
      <br />
      {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {inventoryUnits.map((item, index) => (
          <div style={{ flex: '1 1 auto', minWidth: '320px', margin: '8px' }} key={index}>
            <InventoryCard editable={true} name={item.name} />
            
          </div>
        ))}
      </div> */}
      
    </div>
  );
}