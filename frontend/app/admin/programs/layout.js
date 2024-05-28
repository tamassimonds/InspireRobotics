"use client"

import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link'

import SideBarLayout from "../../../components/layout/innerSidebar.js"

const Sidebar = styled(Box)(({ theme }) => ({
  flex: '0 0 240px',
  padding: 0,
  margin: 0,
}));

const MainContent = styled(Box)({
    padding: 0,
    margin: 0,
  });
  
  const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
    '&.Mui-selected': {
    },
    '&:hover': {
    },
  }));
  
  export default function DashboardLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
  
    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };
  
    return (
      <Box sx={{ display: 'flex', marginLeft: 0 }}>
        <SideBarLayout 
        menuOptions={[
            { label: 'School Programs', route: '/admin/programs/overview' },
            { label: 'Private Programs', route: '/admin/programs/holidayPrograms' },
            { label: 'Calendar', route: '/admin/programs/calendar' },
            { label: 'Add Program', route: '/admin/programs/addProgram' },
            
            
           
            
        ]}
        >
        {/* Your main content here */}
        </SideBarLayout>

        <MainContent sc={{width:"100%"}}>
          {children}
        </MainContent>
      </Box>
    );
  }