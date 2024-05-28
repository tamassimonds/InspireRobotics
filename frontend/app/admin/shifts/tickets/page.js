"use client"
import { useEffect, useState } from "react"
import Table from "/components/table/Table.js"
import Card from '@mui/joy/Card';
import moment from "moment"
import {getAllTickets} from "/lib/firebase/employeeFirebaseLogic"
import {useRouter} from "next/navigation"
import NumberInput from '/components/inputs/NumberInput';
import TeacherDropDown from '/components/dropDown/specific/TeacherDropDown';
import DateInput from '/components/inputs/DateInput';
export default function Home() {
  
  const router = useRouter()

  const handleRowSelected = ((row)=>{
    router.push('/admin/shifts/tickets/ticketProfile?id='+row.id);
  })
  
  const fields = [
    { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'Name' },
    { id: 'subject', numeric: false, disablePadding: true, label: 'Subject' },
    { id: 'employeeName', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'dateFormatted', date: true, numeric: true, disablePadding: false, label: 'Date' },
    { id: 'description', date: true, numeric: true, disablePadding: false, label: 'Description' },
    { id: 'type', date: true, numeric: true, disablePadding: false, label: 'Type' },
    { id: 'numMinutes', date: true, numeric: true, disablePadding: false, label: 'Duration' },    

 
  ];
  const [teacherInput, setTeacherInput] = useState("");
  const [numWeeks, setNumWeeks] = useState(1);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(Date.now());
  const [pendingTickets, setPendingTickets] = useState([]);
  const [approvedTickets, setApprovedTickets] = useState([]);
  const [rejectedTickets, setRejectedTickets] = useState([]);
  const [payedTickets, setPayedTickets] = useState([]);
  
  // Handler for updating the search term
  const updateSearch = (event) => {
    setSearchTerm(event);
  }

  useEffect(() => {
    getAllTickets().then((tickets) => {
      if (tickets) {
        console.log(startDate, endDate)
        console.log(tickets[0].dateOccurred, tickets[0].dateOccurred >= startDate, tickets[0].dateOccurred <= endDate, tickets[0].dateOccurred >= startDate && tickets[0].dateOccurred <= endDate)
        let filteredTickets = tickets.filter(ticket => {
          const matchesTeacher = teacherInput ? ticket.employeeName.toLowerCase().includes(teacherInput.toLowerCase()) : true;
          const withinStartDate = startDate ? ticket.dateOccurred >= startDate : true;
          const withinEndDate = endDate ? ticket.dateOccurred <= endDate : true;
  
          return matchesTeacher && withinStartDate && withinEndDate;
        });

        // Reset states
        setPendingTickets([]);
        setApprovedTickets([]);
        setRejectedTickets([]);

        filteredTickets.forEach((ticket) => {
          ticket["dateFormatted"] = moment(ticket.dateOccurred).format("DD/MM/YYYY");
          if(ticket.payed){
            setPayedTickets(prev => [...prev, ticket]);
          } else if (ticket.accepted) {
            setApprovedTickets(prev => [...prev, ticket]);
          } else if (ticket.rejected) {
            setRejectedTickets(prev => [...prev, ticket]);
          } else {
            setPendingTickets(prev => [...prev, ticket]);
          }
        });
      }
    });
  }, [teacherInput, startDate, endDate]);

  return (
    <div>
      <Card>
       
          <label >Teacher</label> 
          <TeacherDropDown valueUpdated={(value)=>setTeacherInput(value?.name)}/>
          <label >Start Date</label> 
          <DateInput valueUpdated={(value)=>setStartDate(value)}/>
          <label >End Date</label> 
          <DateInput value={endDate} valueUpdated={(value)=>setEndDate(value)}/>
        </Card>
        <Card>
          <h1>Pending Review</h1>
          <Table data={pendingTickets} handleRowSelected= {handleRowSelected} fields={fields}></Table>
        </Card>
        <Card>
          <h1>Approved</h1>
          <Table data={approvedTickets} handleRowSelected= {handleRowSelected} fields={fields}></Table>
        </Card>
        <Card>
          <h1>Rejected</h1>
          <Table data={rejectedTickets} handleRowSelected= {handleRowSelected} fields={fields}></Table>
        </Card>

        <Card>
          <h1>Payed</h1>
          <Table data={payedTickets} handleRowSelected= {handleRowSelected} fields={fields}></Table>
        </Card>
        
      </div>

      
     
    )
  }
  