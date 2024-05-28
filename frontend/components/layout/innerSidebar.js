import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, IconButton, Drawer, useTheme, useMediaQuery, Chip } from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

const Sidebar = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    flex: '0 0 150px',
    minWidth: '150px',

  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const MobileSidebar = styled(Drawer)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const MainContent = styled(Box)({
  padding: 0,
  margin: 0,
});

export default function DashboardLayout({ children, menuOptions }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <List component="nav">
      {menuOptions.map(({ label, route }, index) => (
        <ListItem key={label} disablePadding>
          <Link href={route} passHref>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </Link>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile ? (
       <IconButton
       color="inherit"
       aria-label="open drawer"
       edge="start"
       onClick={handleDrawerToggle}
       sx={{ 
         position: 'absolute', // Added to take the button out of the normal document flow
         top: '64px', // Adjust this value to move the button below the blue bar
         left: theme.spacing(12), // Adjust this value to move the button right of the navbar
         display: { md: 'none' },
         alignSelf: 'flex-start' // Align to the top
       }}
     >
       <Chip 
         icon={<MenuIcon />} 
         onClick={handleDrawerToggle} // Ensure the Chip is clickable
         variant="outlined" // Optional, for styling
         sx={{
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)' // Apply the same drop shadow to the Chip if necessary
        }}
       />
     </IconButton>
     
      ) : null}
      <Sidebar>{drawer}</Sidebar>
      <MobileSidebar
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </MobileSidebar>
      <MainContent sx={{ flexGrow: 1 }}>{children}</MainContent>
    </Box>
  );
}