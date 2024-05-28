"use client"

import * as React from 'react';
import {useState, useEffect} from 'react'
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
import TextInput from "/components/inputs/TextInput.js"
import Button from '@mui/joy/Button';

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux';

import {getEmployeeWithID} from "/lib/firebase/employeeFirebaseLogic"

export default function BasicGrid() {
  const router = useRouter()

  const userData = useSelector(state => state.user.userData);
  const [employeeData, setEmployeeData] = useState()
  const changeInfoPressed = () => {
    router.push(`/employee/profile/edit?id=${userData.id}`)
  }

  const fetchEmployeeData = async () => {
    const fetchedEmployeeData = await getEmployeeWithID(userData.id);
    setEmployeeData(fetchedEmployeeData)
    console.log("fetchedEmployeeData",fetchedEmployeeData)
  }

  useEffect(() => {
    if (!userData) return;
    fetchEmployeeData();
  }, [userData]);

  return (
    <Box style={{ flexGrow: 1, width: '100%' }}>  {/* Set width to 100% */}
      <Grid container spacing={2} style={{ flexGrow: 1, width: '100%' }}>  {/* Set width to 100% */}
        <Grid item xs={3}  >  {/* Add 'item' attribute */}
            
            <BioCard employeeID={userData?.id ?? ""}></BioCard>
            <Card>
            <Typography level="title-lg">Programs Trained In</Typography>
            
            </Card>
           
        </Grid>
        <Grid xs={9}>
          <Card sx={{ p: 2 }}>
            <Typography component="h1" variant="h5">
              Employee Information
            </Typography>
        
                <Typography>
                  <strong>Name:</strong> {employeeData?.name ?? ''}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {employeeData?.email ?? ''}
                </Typography>
                <Typography>
                  <strong>Phone Number:</strong> {employeeData?.phoneNumber ?? ''}
                </Typography>
                <Typography>
                  <strong>Uni Course:</strong> {employeeData?.universityCourse ?? ''}
                </Typography>
                <Typography>
                  <strong>WWC Number:</strong> {employeeData?.WWCNumber ?? ''}
                </Typography>
                <Typography>
                <strong>Access To Car:</strong> {employeeData?.accessToCar ? "true" : "false"}
                </Typography>
                
           
              
            <Button onClick={changeInfoPressed} sx={{ mt: 2 }}>
              Change Info
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}