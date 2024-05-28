"use client"


import React, { useState, useEffect } from 'react';
import MoneyInput from "/components/inputs/MoneyInput.js";
import InventoryCard from "/components/card/inventoryItem.js";
import Button from '@mui/joy/Button';
import Link from 'next/link';
import ItemSearch from '/components/search/itemSearch.js';
import ImageTable from '/components/table/ImageTable.js';

import {getAllCustomQuestions} from "lib/firebase/handleFeedback.ts" 
import Table from '/components/table/Table.js';
import { useRouter } from 'next/navigation';
import ProgramSearch from '/components/search/ProgramSearch';
import { useSearchParams } from 'next/navigation'


export default function Home() {
  const router = useRouter()
  const [inventoryItems, setInventoryItems] = useState([
  ]);
  const searchParams = useSearchParams();

  const questionID = searchParams.get('id');

  const [count, setCount] = useState(0);
  const fields = [
   
    { id: 'question', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'course', numeric: false, disablePadding: true, label: 'Course' },
    { id: 'program', numeric: false, disablePadding: true, label: 'Program' },
    { id: 'id', numeric: false, hidden: true, disablePadding: true, label: 'id' },
    

   
  ];

  const handleRowSelected = (row) => {
    
    router.push('/admin/feedback/customQuestion/questionResponses?itemID='+row.id);
  }

  function ButtonPressed() {
    setInventoryItems([...inventoryItems, { name: `Item 4 ${count}` }]);
    setCount(count + 1);
  }


  useEffect(() => {
    getAllCustomQuestions().then((items) => {
        setInventoryItems(items)
        console.log(items)
      }
      )
  }, []);

  return (
    <div>
      <Link href={`./addQuestion?id=${questionID}`}>
      <Button color="primary">Edit Question</Button>
    </Link>
      
      <Table  handleRowSelected={handleRowSelected} data={inventoryItems} fields={fields}></Table>

      <br />
      <br />
      
      
    </div>
  );
}