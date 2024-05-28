"use client"

import React from 'react';
import Card from '@mui/joy/Card';
import { Typography, Button } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';

export default function ThankYouPage() {
  const theme = useTheme(); // This hook is used to get the current theme

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: '50px' }}>
      <Card variant="outlined" sx={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: theme.palette.success.main }} />
        <Typography component="h1" variant="h4" gutterBottom sx={{ marginTop: '20px' }}>
          Thank You!
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
          Your submission has been received.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We really appreciate your input and will review your suggestion soon!
        </Typography>
      </Card>
    </div>
  );
}