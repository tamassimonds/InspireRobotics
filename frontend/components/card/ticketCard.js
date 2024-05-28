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

export default function TicketCard() {
    return (
      <Card>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }}>
          {/* Avatar and Employee Name */}
          <Avatar />
          <Typography level="title-lg">Employee Name</Typography>
          
          {/* Fill available space */}
          <Box flexGrow={1} />
          
          {/* Chip elements */}
          <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip variant="soft" startDecorator={<Sun />}>
                Today is sunny
            </Chip>
            <Chip variant="soft" startDecorator={<Cloud />}>
                Tomorrow is cloudy
            </Chip>
          </Box>
        </Stack>
        
        <Typography level="title-lg">School Name</Typography>
        <Typography variant="body2" sx={{ px: 2 }}>Content</Typography>
        
        {/* Approve buttons */}
        <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
          <Button  color="success">Approve</Button>
          <Button  color="danger">Reject</Button>
        </Box>
      </Card>
    );
  }