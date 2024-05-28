"use client"
import Card from '@mui/joy/Card';
import StartEndTimeInput from '/components/inputs/StartEndTimeInput.js'
import WeekSelect from '/components/search/weekSelect.js';
import {useState, useEffect} from 'react'
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import Table from '/components/table/Table.js'
import Button from '@mui/joy/Button';
import AccordionDetails, {
  accordionDetailsClasses,
} from '@mui/joy/AccordionDetails';
import AccordionSummary, {
  accordionSummaryClasses,
} from '@mui/joy/AccordionSummary';
import moment from 'moment'
import { calculateTotalPayForAllEmployees, markAsPayed} from '/lib/firebase/handlePayCalculation.js'
import Typography from '@mui/material/Typography';
import ConfirmModal from '/components/modal/ConfirmModal.js'

export default function Home() {  

    const shiftsField = [
      { id: 'totalShiftPay', numeric: false, disablePadding: true, label: 'Amount' },
      { id: 'hours', numeric: false, disablePadding: true, label: 'Hours'},
      { id: 'programName', numeric: false, disablePadding: true, label: 'program' },
      { id: 'date', numeric: false, disablePadding: true, label: 'Day' },
      { id: 'shiftsStartTime', numeric: false, disablePadding: true, label: 'Start' },
      { id: 'shiftsEndTime', numeric: false, disablePadding: true, label: 'End' },
      { id: 'id', numeric: false, hidden:true, disablePadding: true, label: 'id' },
    ];
    const ticketsField = [
      { id: 'pay', numeric: false, disablePadding: true, label: 'Amount' },
      { id: 'numHours', numeric: false, disablePadding: true, label: 'Hours' },
      { id: 'type', numeric: false, disablePadding: true, label: 'type' },
      
      { id: 'dateOccurred', numeric: false, disablePadding: true, label: 'Day' },
    ];
    
    const [startTimeStamp, setStartTimeStamp] = useState(
      moment().startOf('week').valueOf()
    );
    const [endTimeStamp, setEndTimeStamp] = useState(
      moment().endOf('week').valueOf()
    );
    const [isLoading, setIsLoading] = useState(true)
    const [payData, setPayData] = useState([])
    const [totalPay, setTotalPay] = useState(0)
    const [ticketData, setTicketData] = useState([])
    const updateInputTime = (time) => {

      setTotalPay(0)

      // Start and End time is set to start and end of week
      const startOfWeek = moment(time).startOf('week').valueOf(); // .valueOf() will convert the moment object to a timestamp
      const endOfWeek = moment(time).endOf('week').valueOf(); // .valueOf() will convert the moment object to a timestamp

  
      setStartTimeStamp(startOfWeek)
      setEndTimeStamp(endOfWeek)
    }
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogLoading, setIsDialogLoading] = useState(false);


    const handleDialogOpen = () => {
      setIsDialogOpen(true);
    };
    
    const handleDialogClose = () => {
      setIsDialogOpen(false);
     
    };

   
    
    const handleConfirmMarkAsPayed = async () => {
      // Add your logic for what happens when the user confirms
      // setIsLoading(true)
      setIsDialogLoading(true);
      const ticketIDs = ticketData.map(ticket => ticket.id)
      
      const simplePayData = simplifyPayData(payData)
      
      await markAsPayed(startTimeStamp, endTimeStamp, ticketIDs, simplePayData)
      setIsDialogLoading(false);
      handleDialogClose();
    };

    function simplifyPayData(data) {
      const result = {};
  
      // Iterate over each key in the data dictionary
      for (const key in data) {
          const employeeData = data[key];
          const payData = employeeData.payData;
  
          // Initialize sums for each employee
          let totalShiftPay = 0;
          let totalTicketPay = 0;
  
          // Calculate total shift pay
          if (payData.shifts && Array.isArray(payData.shifts)) {
              totalShiftPay = payData.shifts.reduce((sum, shift) => {
                  return sum + parseFloat(shift.totalShiftPay || 0);
              }, 0);
          }
  
          // Calculate total ticket pay
          if (payData.tickets && Array.isArray(payData.tickets)) {
              totalTicketPay = payData.tickets.reduce((sum, ticket) => {
                  return sum + parseFloat(ticket.pay || 0);
              }, 0);
          }
  
          // Assign calculated values to the result object
          result[key] = {
              totalPay: parseFloat(payData.totalPay || 0),
              shiftPay: totalShiftPay,
              ticketPay: totalTicketPay
          };
      }
  
      return result;
  }


    function convertDictToArray(dict) {
      // Check if the totalShiftPay is 0 and return an empty array
      
  
      return Object.entries(dict)
          .filter(([key, _]) => key !== "totalShiftPay") // Exclude the 'totalShiftPay' key
          .map(([key, value]) => {
              return {
                  ...value,
                  id: key
              };
          });
  }
    const formatPayData = (rawData) => {
      setTotalPay(0)
      let formattedData = Object.entries(rawData)
          .filter(([key, value]) => value.payData.totalPay > 0)
          .reduce((obj, [key, value]) => {
             
              setTotalPay(prev => prev + value.payData.totalPay)
              Object.entries(value).forEach(([key, item]) => {
                if (item.programData && item.programData.name) {
                    value[key].programName = item.programData.name;
                }
            });
          
              // Format shifts data
            
           
              const shiftsArray =convertDictToArray(value.payData.shifts)
              
            
              let formattedShifts = shiftsArray.filter(shifts => (shifts.totalShiftPay)).map(shift => ({
                
                
                    ...shift,
                    totalShiftPay: shift.totalShiftPay?.toFixed(2) ?? '0.00',
                    programName: shift?.programData?.name ?? 'Default Program Name',
                    
              
              }));
              
              // Format tickets data
              
              const formattedTickets = value.payData.tickets.map(ticket => ({
                  ...ticket,
                  dateOccurred: moment(ticket.dateOccurred).format('DD/MM/YYYY'),
                  pay: ticket.pay?.toFixed(2) ?? '0.00',
                  numHours: (ticket?.numMinutes/60).toFixed(2) ?? '0.00',
                  // Add other timestamp fields here if needed
              }));
              setTicketData(formattedTickets)
              // Reconstruct the dictionary with formatted entries
              obj[key] = {
                  ...value,
                  payData: {
                      ...value.payData,
                      
                      shifts: formattedShifts,
                      tickets: formattedTickets
                  }
              };
              return obj;
          }, {});
  

      return formattedData;
  }


    useEffect(() => {
      setIsLoading(true)
      calculateTotalPayForAllEmployees( startTimeStamp,endTimeStamp).then((data) => {
        console.log("total pay data", data)
        const formattedData = formatPayData(data)
        
        console.log(formattedData)
        setPayData(formattedData)
        setIsLoading(false)
      })
      
    }, [startTimeStamp])

     return (
    <div>
      <h1>Pay</h1>
      <Card>
        <WeekSelect valueUpdated={updateInputTime} value={startTimeStamp} />
        {isLoading && <h1>Loading...</h1>}
        <Card>
          <h1>Total Pay: {totalPay.toFixed(2)}</h1>
          <AccordionGroup variant="outlined" transition="0.2s">
            {Object.entries(payData).map(([employeeId, employeeInfo]) => (
              <Accordion key={employeeId} defaultExpanded>
                <AccordionSummary>
                  <h3>{`${employeeInfo.name}: $${employeeInfo.payData.totalPay.toFixed(2)}`}</h3>
                </AccordionSummary>
                <AccordionDetails variant="soft">
                  <h3>Shifts</h3>
                  <Table fields={shiftsField} data={employeeInfo.payData.shifts} />
                  <h3>Tickets</h3>
                  <Table fields={ticketsField} data={employeeInfo.payData.tickets} />
                  
                  <div>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 0.5 }}>
                    Hours Summary
                  </Typography>
                  <Typography variant="body1" sx={{ my: 0 }}>
                    Total:  {employeeInfo.payData.totalHours.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" sx={{ my: 0 }}>
                    In class Hrs: {employeeInfo.payData.inClassHours.toFixed(2)} 
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0, mb: 1 }}>
                    Transport Hrs: {employeeInfo.payData.transportHours.toFixed(2)} 
                  </Typography>
                </div>
                  
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionGroup>
        </Card>
    <Button color="success" onClick={handleDialogOpen}>Mark as Payed</Button>
      <ConfirmModal
            open={isDialogOpen}
            onClose={handleDialogClose}
            onConfirm={handleConfirmMarkAsPayed}
            title="Confirm Payment"
            content="Are you sure you want to mark these payments as paid?"
            loading={isDialogLoading}

          />
      </Card>
    </div>
  );
}
  