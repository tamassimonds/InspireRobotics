import * as React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';

export default function CustomCard({ Icon, label, value, color }) {
  return (
    <Card variant="solid" color={color} sx={{ '--joy-palette-primary': color, '--joy-palette-primary-muted': color }} invertedColors>
      <CardContent orientation="horizontal">
        <CircularProgress size="lg" value={75} variant="determinate" sx={{ color }}>
          <SvgIcon sx={{ fontSize: 40 }}>{Icon}</SvgIcon> {/* Adjust fontSize as needed */}
        </CircularProgress>
        <CardContent>
          <Typography level="body-md" sx={{ color: 'text.primary' }}>{label}</Typography>
          <Typography level="h2" sx={{ color: 'text.primary' }}>{value}</Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
}