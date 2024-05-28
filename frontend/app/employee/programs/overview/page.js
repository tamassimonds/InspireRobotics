"use client"
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import ProgramSearch from '/components/search/ProgramSearch.js';
import ProgramCard from '/components/card/programCard.js';
import { getProgramsTeacherAssigned } from "/lib/firebase/employeeFirebaseLogic";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import ProgramsTeacherAssigned from '/components/table/specific/ProgramsTeacherAssigned.js'

import EmployeeProgramCard from '/components/card/specific/Employee/EmployeePrograms.js'

export default function Home() {
    const [programs, setPrograms] = useState([]);
    const userData = useSelector(state => state.user.userData);
    const [employeeID, setEmployeeID] = useState()
    const router = useRouter()
    useEffect(() => {
        console.log("userData", userData)
        if (userData && userData.id) {
            setEmployeeID(userData.id)
          console.log(userData)
            const fetchPrograms = async () => {
                const fetchedPrograms = await getProgramsTeacherAssigned(userData.id);
                setPrograms(fetchedPrograms);
                console.log("fetchedPrograms",fetchedPrograms)

            };

            fetchPrograms();
        }
    }, [userData]);

    const handleRowSelected = (row) => {
       
        router.push('./overview/programDetails?programID='+row.id)
    };

    return (
        <div>   
            
            {/* <ProgramSearch/> */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            
                {/* <ProgramsTeacherAssigned handleRowSelected={handleRowSelected}/> */}
                <EmployeeProgramCard employeeID={employeeID} handleRowSelected={handleRowSelected}/>
                {/* {programs.map(program => (
                    <ProgramCard 
                        key={program.id} // Assuming each program has a unique ID
                        programData={program}
                        seeMoreDetailsPressed={seeMoreDetailsPressed}
                    />
                ))} */}
            </div>
        </div>
    );
}