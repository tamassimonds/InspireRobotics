import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton'; // Import IconButton
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';

export default function RowCard({ name, editable = false, kitView = false }) {
  return (
    <Box position="relative"> {/* Wrap in a Box */}
      <Card orientation="horizontal" variant="outlined" sx={{ width: 320 }}>
        <CardOverflow>
          <AspectRatio ratio="1" sx={{ width: 90 }}>
            <img
              src="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90"
              srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
              loading="lazy"
              alt=""
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography fontWeight="md" textColor="success.plainColor">
            {name}
            <Chip variant="soft">
                Finite
            </Chip>
          </Typography>
          <Typography level="body-sm">Description</Typography>
          <Typography level="body-sm">$22.13</Typography>
          <Typography level="body-sm">Kits Using</Typography>
          <Typography level="body-sm">Quantity</Typography>
        </CardContent>
      </Card>
      {/* Conditionally render IconButton */}
      {editable && (
        <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
          <EditIcon />
        </IconButton>
      )}
    </Box>
  );
}
