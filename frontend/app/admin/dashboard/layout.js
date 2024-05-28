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
            { label: 'Overall', route: '/admin/dashboard/main' },
            { label: 'Sales', route: '/admin/dashboard/option2' },
            { label: 'Students', route: '/admin/dashboard/option3' },
        ]}
        >
        {/* Your main content here */}
        </SideBarLayout>

        <MainContent>
          {children}
        </MainContent>
      </Box>
    );
  }