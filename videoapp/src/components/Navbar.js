import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#7469B6' }}> {/* MUI color */}
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, marginLeft:'300px' }}> {/* Reduced margin */}
          Video Upload App
        </Typography>
        <Button 
          color="inherit" 
          component={Link} 
          to="/" 
          sx={{ 
            '&:hover': { 
              backgroundColor: '#AD88C6',
            },
            borderRadius: '5px',
            margin: '0 5px', 
          }}
        >
          Upload Video
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/videos" 
          sx={{ 
            '&:hover': { 
              backgroundColor: '#AD88C6', // Darker shade on hover
            },
            borderRadius: '5px', 
            marginRight:'300px' 
          }}
        >
          Videos
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
