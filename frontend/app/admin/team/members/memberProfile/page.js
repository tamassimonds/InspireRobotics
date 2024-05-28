"use client"

import * as React from 'react';
import {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Card from "@mui/joy/Card"
import Container from '@mui/material/Container';

import Avatar from '@mui/joy/Avatar';
import Stack from "@mui/joy/Stack"
import Typography from '@mui/joy/Typography';
import BioCard from "/components/card/bioCard.js" 

import EmployeeCalendar from "/components/calendar/specific/EmployeeCalendar.js"
import { useSearchParams } from 'next/navigation';
import Button  from '@mui/joy/Button';

import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import {useRouter} from 'next/navigation';

import { getEmployeeByID} from "/lib/firebase/employeeFirebaseLogic"


export default function BasicGrid() {

  const searchParams = useSearchParams();
  const memberID = searchParams.get('memberID');
  const router = useRouter();

  const [employeeData, setEmployeeData] = useState({})

  useEffect(() => {
    if (memberID) {
      getEmployeeByID(memberID).then((employee) => {
        console.log(employee)
        setEmployeeData(employee)
      })
    }
  }, [memberID])
  return (
    <Box style={{ flexGrow: 1, width: '100%' }}>  {/* Set width to 100% */}
      <Grid container spacing={2} style={{ flexGrow: 1, width: '100%' }}>  {/* Set width to 100% */}
        <Grid item xs={3}  >  {/* Add 'item' attribute */}
            
            < BioCard employeeID={memberID}></BioCard>
            <Card>
            <Typography level="title-lg">Programs Trained In</Typography>
            
            </Card>
           
        </Grid>
        <Grid item xs={9} >  {/* Add 'item' attribute */}
        <Card>
              <AccordionGroup sx={{}}>
              <Accordion>
                
                <AccordionSummary>Info</AccordionSummary>
                <AccordionDetails>
                <p>Name: {employeeData.name}</p>
                <p>Address: {employeeData.address}</p>
                <p>Number: {employeeData.phoneNumber} </p>
                <p>Email: {employeeData.email} </p>
                <p>WWC: {employeeData.WWCNumber} </p>
                <p>Active Teacher: { employeeData.activeTeacher ? 'Yes' : 'No' }</p>


                <Button onClick={ () => {router.push("./memberProfile/editInfo?memberID="+ memberID)}}>Info</Button>

                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>Feedback</AccordionSummary>
                <AccordionDetails>
                  {/* Feedback */}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary>Availability</AccordionSummary>
                <AccordionDetails>
                <EmployeeCalendar employeeID={memberID}></EmployeeCalendar>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary>Pay Rates</AccordionSummary>
                <AccordionDetails>
                  <p>Standard Pay Rate: {employeeData.standardPayRate}</p>
                  <p>RnD Rate: {employeeData.rndPayRate}</p>
                  <p>Transportation pay start: {employeeData.transportationPayStart} hr</p>
                  <Button onClick={ () => {router.push("./memberProfile/editPay?memberID="+ memberID)}}>Edit</Button>
                </AccordionDetails>
              </Accordion>
          </AccordionGroup>
          </Card>
            
            
        </Grid>
      </Grid>
    </Box>
  );
}