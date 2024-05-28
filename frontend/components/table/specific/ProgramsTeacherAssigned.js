import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchableTable from "/components/table/SearchableTable.js"
import { getProgramsTeacherAssigned } from "/lib/firebase/employeeFirebaseLogic";

export default function Home({ employeeID, complete, upcoming, handleRowSelected }) {
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [isMobile, setIsMobile] = useState(false); // State to track if the device is mobile
    const router = useRouter();
    const currentDate = new Date().getTime();

    // Define fields outside of useEffect
    let fields = [
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'schoolName', numeric: false, disablePadding: true, label: 'School' },
        { id: 'startDate', numeric: false, disablePadding: true, label: 'Start Date' },
        { id: 'endDate', numeric: false, disablePadding: true, label: 'End Date' },
        { id: 'id', numeric: false, hidden: true, disablePadding: true, label: 'ID' },
    ];

    // Check window width to determine if it's a mobile device
    const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (employeeID) {
            const fetchPrograms = async () => {
                
                const fetchedPrograms = await getProgramsTeacherAssigned(employeeID);
                console.log(fetchedPrograms);
                setPrograms(fetchedPrograms);
                const filteredProgramsRef = fetchedPrograms.filter(program => {
                    const programDate = program.endDateTimeStamp;
                    if (upcoming && programDate >= currentDate) {
                        return true;
                    }
                    if (complete && programDate < currentDate) {
                        return true;
                    }
                    return false;
                });
                setFilteredPrograms(filteredProgramsRef);
            };
            fetchPrograms();
        }
    }, [employeeID, currentDate, complete, upcoming]);

    // Adjust fields based on whether it's mobile or not
    if (isMobile) {
        fields = fields.filter(field => field.id === 'name');
    }

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center'
        }}>                
            <SearchableTable fields={fields} data={filteredPrograms} handleRowSelected={handleRowSelected}/>
        </div>
    );
}