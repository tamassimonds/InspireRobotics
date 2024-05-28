
"use client"

import Button from '@mui/joy/Button';
import TeamMemberTable from "/components/table/specific/TeamMembersTable.js"
import BioCardShort from "/components/card/bioCardShort.js"
import Table from "/components/table/Table.js"
import Calendar from "/components/calendar/PlainCalendar.js"
import Card from '@mui/joy/Card';
import ShiftSearch from "/components/search/ShiftSearch.js"
import {getAllSessionsForTeacher} from "/lib/firebase/employeeFirebaseLogic"
import { useSelector } from 'react-redux';
import { useEffect , useState} from 'react';
import moment from 'moment';
import {getColorFromProgramID} from "/lib/utils"
import EmployeeShiftsCalendar from "/components/calendar/specific/EmployeeShiftsCalendar.js"
import EmployeeShifts from "/components/table/specific/EmployeeShifts.js"

export default function TeamMembers() {
  const userData = useSelector(state => state.user.userData);

  const [employeeID, setEmployeeID] = useState(null);






useEffect(() => {
  if (userData && userData.id) {
    setEmployeeID(userData.id);
    
  }
}, [userData]);

  return (
    <div>
        
        <EmployeeShifts employeeID= {employeeID} shiftUpcoming={true}></EmployeeShifts>
      
         <br />
         <Card>
         <EmployeeShiftsCalendar employeeID={employeeID}></EmployeeShiftsCalendar>
         </Card>
    </div>
  );
}
    