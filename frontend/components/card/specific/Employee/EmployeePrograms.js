import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Card } from '@mui/joy';
import CircularProgress from '@mui/joy/CircularProgress';
import { getProgramsTeacherAssigned } from "/lib/firebase/employeeFirebaseLogic";
import ProgramCard from '/components/card/programCard.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the ExpandMoreIcon
import AccordionGroup from '@mui/joy/AccordionGroup';
import ProgramsTeacherAssigned from '/components/table/specific/ProgramsTeacherAssigned.js'
const TeacherProgramsCard = ({ employeeID, handleRowSelected }) => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (employeeID) {
            setLoading(true);
            const fetchPrograms = async () => {
                const fetchedPrograms = await getProgramsTeacherAssigned(employeeID);
                setPrograms(fetchedPrograms || []);
                setLoading(false);
            };
            fetchPrograms();
        }
    }, [employeeID]);

    const currentDate = new Date().getTime();
    const upcomingPrograms = programs.filter(program => program.endDateTimeStamp >= currentDate);
    const completedPrograms = programs.filter(program => program.endDateTimeStamp < currentDate);

    return (
        <Card >
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
            ) : (
                <>
                <AccordionGroup variant="outlined" transition="0.2s">

                    <Accordion variant="outlined">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography level="h2"  sx={{ fontWeight: 600 }}>
                                Upcoming Programs ({upcomingPrograms.length})
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 2 }}>
                          <ProgramsTeacherAssigned upcoming={true} employeeID={employeeID} handleRowSelected={handleRowSelected}/>

                        </AccordionDetails>
                    </Accordion>

                    <Accordion variant="outlined">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography level="h2"  sx={{ fontWeight: 600 }}>
                                Completed Programs ({completedPrograms.length})
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 2 }}>
                            <ProgramsTeacherAssigned complete={true} employeeID={employeeID} handleRowSelected={handleRowSelected}/>
                        </AccordionDetails>
                    </Accordion>
                    </AccordionGroup>
                </>
            )}
        </Card>
    );
};

export default TeacherProgramsCard;