
/*

EXAMPLE DATA INPUT 

const classesDataStructure = [
  {
    class: 'Class Name 1',
    startTime: '09:00',
    endTime: 123,
    carbs: 123,
    protein: 4,
    price: 3.99,
    subField: [
      {
        session: 'asd',
        date: '2/3/2004',
        startTime: '7:15',
        endTime: "9:15",
      },
     
    ],
  },
 
];



const classesTableStructure = {
  mainFields: [
    { name: 'class', label: 'Class', a`li`gnRight: false },
    { name: 'numSessions', label: 'Num Session', alignRight: false },
   
    // ... add more fields as needed
  ],
  subFields: [
    { name: 'session', label: 'Session', alignRight: false },
    { name: 'date', label: 'Date', alignRight: false },
    { name: 'startTime', label: 'Start Time', alignRight: false },
    { name: 'endTime', label: 'End Time', alignRight: false },
    { name: 'teacher1', label: 'Lecturer', alignRight: false },
    { name: 'teacher2', label: 'Facilitator', alignRight: false },
  ],
};

*/

import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/joy/IconButton';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/joy/Button';
import TablePlain from "/components/table/Table.js"
import TeacherDropDown from "/components/dropDown/specific/TeacherDropDown.js"

import {functions} from "/lib/firebase/initFirebase.ts"

import {formatTimeDateString} from "library/utils/dates/parseDateToTimestamp"


function Row({ row, structure, onEditPressed, onTeacherSelectedChange, cellRenderer }) {
  const [open, setOpen] = React.useState(false);
  const renderCellContent = (cellData, field, rowData, subField, isSubField =false) => {
    // Check if this is a teacher field and render a button
    if (field.name === 'teacher1' || field.name === 'teacher2') {
      const fieldName = field.name
      let data = cellData 
      if(isSubField){
        
        data = subField[field.name]
      } 

    
      const startTimeTimestamp = formatTimeDateString(rowData.startTime, rowData.date)
      const endTimeTimestamp = formatTimeDateString(rowData.endTime, rowData.date)

      return (
        <TeacherDropDown value={data} width={"100%"} startTimeTimestamp={startTimeTimestamp} endTimeTimestamp={endTimeTimestamp} valueUpdated={(value) => onTeacherSelectedChange({rowData, value, fieldName, cellData, subField, isSubField })}>
          {cellData || 'Assign'}
        </TeacherDropDown>
      );  
    } else if(field.name === 'shiftID' || field.name === 'sessionID') {
      return null
    }else {
      // Default rendering for other fields
      if(isSubField){
        
        return subField[field.name]
      } 
     
      return cellData;
    }
  };

  return (
    <React.Fragment>
      <tr>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
       
{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>
       
        {structure.mainFields.map((field) => (
          <td key={field.name} style={{ textAlign: field.alignRight ? 'right' : 'left' }}>
            {renderCellContent(row[field.name], field, row)}
          </td>
        ))}
        
          

       
      </tr>
      {open && (
        <tr>
          <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={structure.mainFields.length + 1}>
            
            <Sheet
              variant="soft"
              sx={{ p: 1, pl: 6, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)' }}
            >
              {/* <Typography level="body-lg" component="div">
                subField
              </Typography> */}
              <Table
                borderAxis="bothBetween"
                size="sm"
                aria-label="purchases"
                sx={{
                  '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
                    { textAlign: 'right' },
                  '--TableCell-paddingX': '0.5rem',
                }}
              >
                <thead>
                  <tr>
                    {structure.subFields.map((field) => (
                      <th key={field.name} style={{ textAlign: field.alignRight ? 'right' : 'left' }}>
                        {field.label}
                        
                      </th>
                      
                      
                    ))}
                 
                  </tr>
                </thead>
                <tbody>
                  {row.subField.map((subFieldRow, index) => (
                    <tr key={index}>
                      {structure.subFields.map((field) => (
                        <td key={field.name} style={{ textAlign: field.alignRight ? 'right' : 'left' }}>
                          {renderCellContent(row[field.name], field, row, subFieldRow, true)}
                        </td>
                      ))}
                      
                    </tr>
                    
                  ))}
                </tbody>
              </Table>
            </Sheet>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}



export default function EditableShiftsAllocationTable({ onTeacherSelectedChange, data, structure, onEditPressed , cellRenderer   }) {  
  
  
  
  if (data == undefined) {
    return (
      <div>
        <p>No Data In Table</p>
        <TablePlain></TablePlain>
      </div>
    )
  }
  
  
  return (
    <Sheet>
      <Table
        aria-label="collapsible table"
        sx={{
          '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
            { textAlign: 'right' },
          '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
            {
              borderBottom: 0,
            },
        }}
      >
       <thead>
          <tr>
            <th style={{ width: 40 }} aria-label="empty" />
            {structure.mainFields.map((field) => (
              <th
                key={field.name}
                style={{  textAlign: field.alignRight ? 'right' : 'left' }}
              >
                {field.label}
              </th>
            ))}
            
          </tr>
        </thead>
        <tbody>
          {data.map((rowData) => (
            <Row onTeacherSelectedChange={onTeacherSelectedChange} key={rowData.class} row={rowData} structure={structure} onEditPressed={onEditPressed} cellRenderer={cellRenderer}/>
          ))}
          
        </tbody>
      </Table>
    </Sheet>
  );
}

EditableShiftsAllocationTable.propTypes = {
  data: PropTypes.array.isRequired,
  structure: PropTypes.object.isRequired,
};