"use client"


import Card from '@mui/joy/Card';

import TextInput from "/components/inputs/TextInput.js"

import NumberInput from "/components/inputs/NumberInput.js"
import MoneyInput from "/components/inputs/MoneyInput.js"
import CheckBox from "/components/inputs/CheckBox.js"
import DateINput from "/components/inputs/DateInput.js"
import SchoolDropDown from "/components/dropDown/specific/SchoolDropDown.js"
import CourseDropDown from "/components/dropDown/specific/CourseDropDown.js"
import Button from '@mui/joy/Button';
import {useState} from "react"
import EditableTable from "/components/table/EditableTable.js"
import Table from '/components/table/Table.js'
import Stack from '@mui/material/Stack';
import TimeInput from "/components/inputs/TimeInput.js"
import { setDoc ,addDoc, collection  } from "firebase/firestore"; 
import {dbref, timestampToDate} from '/lib/firebase/library';
import AgeInput from "/components/inputs/AgeInput.js"
import StartEndTimeInput from "/components/inputs/StartEndTimeInput.js"
import { v4 as uuidv4 } from 'uuid'; // Importing uuid function
import {useRouter} from 'next/navigation';
import HolidayProgramModuleDropDown from "/components/dropDown/specific/HolidayProgramModuleDropDown.js"
export default function Home() {
  const router = useRouter()
  const [isHolidayProgram, setIsHolidayProgram] = useState(false);
  const [tableData, setTableData] = useState([]); // State to store table data
  const [startTime, setStartTime] = useState([]);
  const [endTime, setEndTime] = useState([]);
  const [startDate, setStartDate] = useState([]);
  
  const [programData, setProgramData] = useState({
    id: uuidv4(),
    publishToWebsite: false,
    openToPublic: false,
    isHolidayProgram: false,
    name: '',
    school: '',
    course: '',
    revenue: '',
    startDate: '',
    endDate: '',
    locationName: '',
    locationAddress: '',
    maxCapacity: '',
    holidayProgramModule: '',
    holidayProgramDates: [],
    otherNotes: '',
    parentEvent: false,
    programConfirmed: false,
    onlyStudentsAtSchool: false,

   
  });


  const dateAdded = (value) => {
    console.log(value)
    handleInputChange("holidayProgramDates")(value)
  }
  const rowDeleted = (row) => {
    console.log("row",row)
    const newTableData = tableData.filter((day) => day.startDayTimeStamp !== row.startDayTimeStamp);
    setTableData(newTableData);
  };
  
  const handleCheckboxChange = (field) => (checkedValues) => {
    console.log(checkedValues)
    const isChecked = checkedValues.length > 0;
    setProgramData({ ...programData, [field]: isChecked });

    // Specific logic for isHolidayProgram, if needed
    if (field === 'isHolidayProgram') {
      setIsHolidayProgram(!isHolidayProgram);
    }
  };

  const handleInputChange = (field) => (value) => {
    setProgramData({ ...programData, [field]: value });
   
  };



  const addProgramPressed = async () => {
    
    if(isHolidayProgram){
      const docRef = await addDoc(collection(dbref, "programs"), {
        // console.log({
         id: programData.id,
          holidayProgramModuleID: programData.holidayProgramModule?.id || '',
          courseName: programData.holidayProgramModule?.course?.name  || '',
          courseID: programData.holidayProgramModule?.course?.id || '',
          dates: programData.holidayProgramDates || [],
          maxCapacity: programData.maxCapacity || '',
          name: programData.name || '',
          openToPublic: programData.openToPublic || false,
          otherNotes: programData.otherNotes || '',
          publishToWebsite: programData.publishToWebsite || false,
          locationName: programData.locationName || '',
          locationAddress: programData.locationAddress || '',
          isHolidayProgram: true,
          isSchoolProgram: false,
          schoolName: programData.school.name || '',
          schoolID: programData.school.id || '',

        });
        console.log("Document written with ID: ", docRef.id);
        router.push('/admin/programs/overview');
    }


    if(!isHolidayProgram){
      const docRef = await addDoc(collection(dbref, "programs"), {
     
        id: programData.id,
        courseName: programData.course?.name  || '',
        courseID: programData.course?.id || '',
        endDate: timestampToDate(programData.endDate) || '',
        endDateTimeStamp: programData.endDate || '',
        startDate: timestampToDate(programData.startDate) || '',
        startDateTimeStamp: programData.startDate || '',
        endOfProgramEvent: programData.parentEvent || false,
        name: programData.name || '',
        schoolName: programData.school.name || '',
        schoolID: programData.school.id || '',
        otherNotes: programData.otherNotes || '',
        programConfirmed: programData.programConfirmed || false,
        revenue: programData.revenue || '',
        isSchoolProgram: true,
        isHolidayProgram: false,
        yearLevel: programData.yearLevel || '',
        numStudents: programData.numStudents || '',

      });
      console.log("Document written with ID: ", docRef.id);
      router.push('/admin/programs/overview');


    }
  }

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Card>

        <label htmlFor="">Program Name</label>
        <TextInput valueUpdated={handleInputChange("name")} />

       


        <label htmlFor="">Private Program</label>
        <CheckBox 
          options={[{ label: "Private Program" }]} 
          valueUpdated={handleCheckboxChange("isHolidayProgram")}
        />

      {isHolidayProgram && (
          <>
           
         
            <label htmlFor="">Holiday Program Module</label>
            <HolidayProgramModuleDropDown valueUpdated={handleInputChange("holidayProgramModule")}/>
            <hr />
            <CheckBox 
              options={[{ label: "Open to Public?" }]} 
              valueUpdated={handleCheckboxChange("openToPublic")} 
            />
            <CheckBox 
              options={[{ label: "Publish to website now?" }]} 
              valueUpdated={handleCheckboxChange("publishToWebsite")} 
            />
          
            <CheckBox 
              options={[{ label: "Only allow students at school?" }]} 
              valueUpdated={handleCheckboxChange("onlyStudentsAtSchool")} 
            />
              {programData.onlyStudentsAtSchool && (
                <>
                <label htmlFor="">School</label>
                <SchoolDropDown valueUpdated={handleInputChange("school")}/>
                </>
              )}
            <hr />
            <label htmlFor="">Location Name</label>
            <TextInput valueUpdated={handleInputChange("locationName")}/>

            <label htmlFor="">Location Address</label>
            <TextInput valueUpdated={handleInputChange("locationAddress")}/>

            <label htmlFor="">Max Capacity</label>
            <NumberInput valueUpdated={handleInputChange("maxCapacity")}/>
          
            <StartEndTimeInput valueUpdated={dateAdded}/>

            
            
          </>
        )}
        
        
        

        {!isHolidayProgram && (
          <>
            <label htmlFor="">School</label>
            <SchoolDropDown valueUpdated={handleInputChange("school")}/>
            
            <label htmlFor="">Course</label>
            <CourseDropDown valueUpdated={handleInputChange("course")}/>

            <label htmlFor="">Revenue</label>
            <MoneyInput valueUpdated={handleInputChange("revenue")}/>

            <label htmlFor="">Start Date</label>
            <DateINput valueUpdated={handleInputChange("startDate")}/>

            <label htmlFor=""> End Date</label>
            <DateINput valueUpdated={handleInputChange("endDate")}/>
            
            <CheckBox 
              options={[{ label: "End of Program Event" }]} 
              valueUpdated={handleCheckboxChange("parentEvent")} 
            />
            <CheckBox 
              options={[{ label: "Program Confirmed" }]} 
              valueUpdated={handleCheckboxChange("programConfirmed")} 
            />
             <label htmlFor="">Year Level</label>
            <AgeInput valueUpdated={handleInputChange("yearLevel")}/>

            <label htmlFor="">*Num Students (Approx if not exactly known - needed for equipment)</label>
            <NumberInput valueUpdated={handleInputChange("numStudents")}/>

          </>
        )}

       
        <label htmlFor="">Additional Notes</label>
        <TextInput valueUpdated={handleInputChange("otherNotes")}/>
          
        

        <Button onClick={addProgramPressed}>Add Program</Button>



        </Card>
      </div>
    )
}