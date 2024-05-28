"use client"
import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import NumberInput from "/components/inputs/NumberInput.js";
import Button from '@mui/joy/Button';
import CheckBox from '/components/inputs/CheckBox.js';
import Chip from '@mui/joy/Chip';
import Cloud from '@mui/icons-material/Cloud';
import Sun from '@mui/icons-material/LightMode';
import Box from '@mui/joy/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/joy/IconButton'; 
import EditIcon from '@mui/icons-material/Edit';


export default function KitCard({kitID}) {
    return (
      <Card>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }}>
          <Typography level="title-lg">Kit Name</Typography>
         
          
          {/* Fill available space */}
          <Box flexGrow={1} />
          
          {/* Chip elements */}
          <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton  sx={{ position: 'absolute', top: 8, right: 8 }}>
            
            <EditIcon />
          </IconButton>
          </Box>
        </Stack>
        <Typography variant="body2" sx={{ px: 2 }}>Description</Typography>
        <Typography variant="body2" sx={{ px: 2 }}>Quantity: 10</Typography>

       
      </Card>
    );
  }