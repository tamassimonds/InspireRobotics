
'use client'
import Table from "/components/table/Table.js"
import Button from '@mui/joy/Button';
import TeamMemberTable from "/components/table/specific/TeamMembersTable.js"
import BioCardShort from "/components/card/bioCardShort.js"

import Card from "@mui/joy/Card"
import Stack from '@mui/material/Stack';
import { useRouter } from "next/navigation";

import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";

import {getAllFeedbackTicketsToBeCompletedForStaff} from "/library/lib/feedback/services/fetchTickets"
import {getProgramWithID} from "lib/firebase/library"


import moment from 'moment';

export default function Page() {
  const userData = useSelector(state => state.user.userData);

  const [shiftsData, setShiftsData] = useState([]); 
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter()

  const fields = [
    { id: 'programName', numeric: false, disablePadding: true, label: 'Program' },
    
    { id: 'date', numeric: false, disablePadding: true, label: 'Date' },

   
  ];

  const handleRowSelected = (row) => {
   
    router.push('./shiftReview/giveFeedback?id='+row.id)
  };



  async function transformToTable(data) {
    const tableData = await Promise.all(data.map(async (row) => {
        const program = await getProgramWithID(row.programID);
     
     
        return {
            id: row.id,
            programName: program[0].name,
            date: moment(row.date).format('DD/MM/YYYY'),
        }
    }));

    return tableData;
}



useEffect(() => {
    if (userData && userData.id) {
        getAllFeedbackTicketsToBeCompletedForStaff(userData.id, 0).then((feedbackTickets) => {
            console.log("Feedback Tickets", feedbackTickets);
            transformToTable(feedbackTickets).then((tableData) => {
                setTableData(tableData);
                setLoading(false);
            }).catch(error => {
                console.error('Error transforming table data:', error);
                setLoading(false);
            });
        }).catch(error => {
            console.error('Error fetching feedback tickets:', error);
            setLoading(false);
        });
    }
}, [userData]);

  return (
    <div>
      
      <Card>
      <Stack direction="horizontal" justifyContent="space-between">
        <h1>Shift Feedback</h1>
        </Stack>
        {loading ? <p>Loading...</p> : <Table handleRowSelected={handleRowSelected} fields={fields} data={tableData}/>
          }

        
       
      </Card>
    </div>
  );
}