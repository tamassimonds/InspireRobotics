"use client"


import Card from '@mui/joy/Card';

import TextInput from "/components/inputs/TextInput.js"


import MoneyInput from "/components/inputs/MoneyInput.js"
import CheckBox from "/components/inputs/CheckBox.js"
import DateInput from "/components/inputs/DateInput.js"
import TimeInput from "/components/inputs/TimeInput.js"
import SchoolDropDown from "/components/dropDown/specific/SchoolDropDown.js"
import CourseDropDown from "/components/dropDown/specific/CourseDropDown.js"
import Button from '@mui/joy/Button';
import TeacherDropDown from "/components/dropDown/specific/TeacherDropDown.js"
import { useSearchParams } from 'next/navigation'

import Stack from "@mui/joy/Stack"
import EditableTable from '/components/table/EditableTable';
import NumberInput from '/components/inputs/NumberInput';
import StartEndTimeInput from '/components/inputs/StartEndTimeInput';
import AgeInput from '/components/inputs/AgeInput';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid function
import moment from 'moment';
import { updateSessionsForClass, createNewClass,getAllSessionsWithClassID ,deleteClassAndSessions, getClassWithID} from '/lib/firebase/library';

import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter()
    const [classID, setClassID] = useState()
    const [editClassText, setEditClassText] = useState("")
    const [saveButtonText, setSaveButtonText] = useState("Save")
    const [savingStatus, setSavingStatus] = useState(false) // idle, saving, saved, error
    const [errors, setErrors] = useState({});
    const [tableData, setTableData] = useState([]); // State to store table data
    const [addClass, setAddClass] = useState(false)
    const [numStudents, setNumStudents] = useState(25)
    const [formData, setFormData] = useState({
    
    }) 
    const [ageInput, setAgeInput] = useState([])
    const searchParams = useSearchParams()
    const programID = searchParams.get('programID')
    const addClassParam = searchParams.get('page')
    const classIDParam = searchParams.get('classID')

    const formatSessionData = (formData) => {
        
        setFormData({ ...formData, "yearLevel": formData.yearLevel });
        const sessionDates = formData.sessionDates || [];
        const formattedSessions = sessionDates.map(session => {
            // console.log(session)
            return {
                classID: classID,
                date: session.startDate, // Assuming this is the date format you need
                endTime: session.endTime,
               
                endTimeTimestamp: new Date(session.endTimeTimeStamp).getTime(), // Convert to timestamp
                sessionID: uuidv4(), // Generate new UUID for each session
                startTime: session.startTime,
                startTimeTimestamp: new Date(session.startTimeTimeStamp).getTime(), // Convert to timestamp
                teacherNames: [],
                teacherIDs: [],
                sessionID: uuidv4(), // Generate new UUID for each session
                programID: programID,
            };
        });
    
        return formattedSessions;
    };

    const validateFormData = () => {
        let isValid = true;
        let newErrors = {};
      
        // Example validation: Ensure year level is not empty and is a number
        if (!formData.yearLevel) {
          isValid = false;
          newErrors.yearLevel = 'Year level must be input';
        }
    
        // Add more validations as needed...
    
        setErrors(newErrors);
        return isValid;
      };

      const formatSessionsForTable = (sessions) => {
        
        return sessions.map(session => {
          return {
            startDate: moment(session.startTimeTimestamp).format('DD/MM/YYYY'),
            startTime: moment(session.startTimeTimestamp).format('hh:mm A'),
            endTime: moment(session.endTimeTimestamp).format('hh:mm A'),
            startDayTimeStamp: session.startTimeTimestamp,
            startTimeTimeStamp: session.startTimeTimestamp,
            endTimeTimeStamp: session.endTimeTimestamp,
            uniqueId: session.sessionID, // or use uuidv4() if you need to generate a new one
          };
        });
      };

    const savePressed = async () => {
        // Save class logic
        setErrors({});

        // Perform validation
        if (!validateFormData()) {
        return; // Do not proceed if validation fails
        }

        if(!savingStatus){
            setSavingStatus(true)
            setSaveButtonText("loading....")
            const formattedSessions = formatSessionData(formData)
            
            if(addClassParam){
                await createNewClass({
                    programID: programID,
                    classID: classID,
                    yearLevel: formData.yearLevel,
                    numStudents: numStudents,
                })
            }

            console.log(formattedSessions, classID)
            await updateSessionsForClass(classID, formattedSessions)
            console.log("DONE")
            router.push(`/admin/programs/overview/programDetails?programID=${programID}`)
        }

    }
    const deletePressed = async () => {
        await deleteClassAndSessions(classID)
        router.push(`/admin/programs/overview/programDetails?programID=${programID}`)
    }

    const dateAdded = (value) => {
        console.log(value)
        handleInputChange("sessionDates")(value)
      }

    const handleInputChange = (field) => (value) => {
        setFormData({ ...formData, [field]: value });
       
      };

    useEffect(() => {
        if (addClassParam === "add") {
            // Add class logic
            setEditClassText("Add Class")
            setAddClass(true)
        } else {
            // Edit class logic
            setEditClassText("Edit Class")
            setAddClass(false)
            
            getClassWithID(classIDParam).then((classData) => {
                console.log(classData.yearLevel)
                setFormData({
                    ...formData,
                    yearLevel: classData.yearLevel,
                    numStudents: classData.numStudents,
                })
                setAgeInput(classData.yearLevel)
            })

            getAllSessionsWithClassID(classIDParam).then((sessions) => {
                console.log(sessions)
                const sessionDates = sessions.map(session => {
                    return {
                        startDate: session.date, // Assuming this is the date format you need
                        endTime: session.endTime,
                        endTimeTimeStamp: session.endTimeTimestamp, // Convert to timestamp
                        startTime: session.startTime,
                        startTimeTimeStamp: session.startTimeTimestamp, // Convert to timestamp
                        uniqueId: session.sessionID, // or use uuidv4() if you need to generate a new one
                    };
                });
                setTableData(
                   
                    sessionDates
                )
            })
        }

        if (classIDParam === null) {
            setClassID(uuidv4()); // Set a new UUID if classID is undefined
        } else {
            setClassID(classIDParam); // Use the existing classIDParam
        }
    }, []);
    
    useEffect(() => {
   
      
        if (classIDParam) {
          getAllSessionsWithClassID(classIDParam).then((sessions) => {
            const formattedSessions = formatSessionsForTable(sessions);
            console.log(formattedSessions)
            setFormData({
              // ... other form data ...
              sessionDates: formattedSessions,
            });
          });
        }
      
        
      }, [classIDParam]);
    
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Card>
            
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
            <h1>{editClassText}</h1>
            <Button color="danger" onClick={deletePressed}>Delete</Button>
            </Stack>
            <label htmlFor="">Year Level Input</label>
            <AgeInput valueUpdated={handleInputChange("yearLevel")} value={ageInput}> </AgeInput>
            <label htmlFor="">Num Students</label>
            <NumberInput valueUpdated={handleInputChange("numStudents")} value={numStudents}></NumberInput>
            <StartEndTimeInput valueUpdated={dateAdded} value={tableData} />
            <p style={{ color: 'red' }}>{errors.yearLevel }</p>
            <Button color="success" onClick={savePressed}>{saveButtonText}</Button>
        </Card>
      </div>
    )
}