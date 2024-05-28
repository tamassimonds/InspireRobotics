"use client"


import React, { useState, useEffect } from 'react';
import MoneyInput from "/components/inputs/MoneyInput.js";
import Button from '@mui/joy/Button';
import Link from 'next/link';
import Table from '/components/table/Table.js';
import ImageTable from '/components/table/ImageTable.js';
import Card from '@mui/joy/Card';
import {getAllCoupons} from "/library/lib/coupons/services/fetchCoupons" 

import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()
  const [inventoryCoupons, setInventoryCoupons] = useState([
  ]);

  const [count, setCount] = useState(0);
  const fields = [
    { id: 'id', numeric: false, disablePadding: true, label: '' },
    { id: 'codeID', numeric: false, disablePadding: true, label: '' },
    { id: 'amount', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'valid', numeric: false, disablePadding: true, label: 'Valid' },
    
    

   
  ];

  const handleRowSelected = (row) => {
    
    router.push('/admin/privatePrograms/coupons/addCoupons?id='+row.id);
  }

  function ButtonPressed() {
    setInventoryCoupons([...inventoryCoupons, { name: `Coupon 4 ${count}` }]);
    setCount(count + 1);
  }


  useEffect(() => {
      getAllCoupons().then((coupons) => {
        setInventoryCoupons(coupons)
        coupons.map((coupon) => { coupon.valid = coupon.valid ? "Yes" : "No" })
       
      }
      )
  }, []);

  return (
    <div>
      <h1>Coupons</h1>
      <Card>
        <Table handleRowSelected={handleRowSelected} data={inventoryCoupons} fields={fields}></Table>
      </Card>
      <br />
      <Link href="./coupons/addCoupons"><Button color="success">Add Coupons</Button></Link>
      <br />
      {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {inventoryCoupons.map((coupon, index) => (
          <div style={{ flex: '1 1 auto', minWidth: '320px', margin: '8px' }} key={index}>
            <InventoryCard editable={true} name={coupon.name} />
            
          </div>
        ))}
      </div> */}
      
    </div>
  );
}