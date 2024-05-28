
'use client'
import Table from "/components/table/EditableTable.js"
import Button from '@mui/joy/Button';
import TeamMemberTable from "/components/table/specific/TeamMembersTable.js"
import BioCardShort from "/components/card/bioCardShort.js"

import Card from "@mui/joy/Card"
import Stack from '@mui/material/Stack';
import { useRouter } from "next/navigation";

import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getTicketsByEmployeeID} from "/lib/firebase/employeeFirebaseLogic"
export default function Page() {
  const userData = useSelector(state => state.user.userData);

  const [pendingTickets, setPendingTickets] = useState([]); 
  const [resolvedTickets, setResolvedTickets] = useState([]); 


  const router = useRouter()

  const fields = [
    { id: 'subject', numeric: false, disablePadding: true, label: 'subject' },

    { id: 'type', numeric: false, disablePadding: true, label: 'type' },
    { id: 'numMinutes', numeric: false, disablePadding: true, label: 'Minutes' },
    { id: 'status', numeric: false, disablePadding: true, label: 'status' },
    { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'ID' },
  ];

  const handleEditButtonClick = (row) => {
    router.push('./tickets/addTicket?id='+row.id)
  };


  const addTicketPressed = () =>{
    router.push(`/employee/shifts/tickets/addTicket`)
  }

  useEffect(() => {
    if (userData) {
      getTicketsByEmployeeID(userData.id).then((data) => {
        console.log("tickets", data);
        const pendingTicketsRef = data.filter((ticket) => ticket.status === "pending");
        const resolvedTicketsRef = data.filter((ticket) => ticket.status != "pending");
        setResolvedTickets(resolvedTicketsRef);
        setPendingTickets(pendingTicketsRef);
      });
    }
  }, [userData]);

  return (
    <div>
      
      <Card>
      <Stack direction="horizontal" justifyContent="space-between">
        <h1>Pending Tickets</h1>
        <Button onClick={addTicketPressed}> Add Ticket</Button>
        </Stack>
        <Table handleEditButtonClick={handleEditButtonClick} fields={fields} data={pendingTickets}/>
          
       
      </Card>
      <Card>
        <h1>Resolved Tickets</h1>
        <Table fields={fields} data={resolvedTickets}/>

      </Card>
    </div>
  );
}