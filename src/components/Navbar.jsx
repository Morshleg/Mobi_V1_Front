import React, { useState } from 'react';
import {
  LightModeOutlined,
  DarkModeOutlined,
  ArrowDropDownOutlined,
} from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from 'slices/globalSlice';

import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from 'slices/usersApiSlice';
import { logout } from 'slices/globalSlice';
import { useSelector } from 'react-redux';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state) => state.auth.userInfo);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBar
      sx={{
        position: 'static',
        background: 'none',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* LEFT SIDE */}

        <FlexBetween>
          {/* Rajouter par emple un texte deroulant avec des news locales ici */}         
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap='1.5rem'>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlined sx={{ fontSize: '25px' }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: '25px' }} />
            )}
          </IconButton>

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textTransform: 'none',
                gap: '1rem',
              }}
            >
             
              <Box textAlign='left'>
                <Typography
                  fontWeight='bold'
                  fontSize='0.85rem'
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.Pseudo}
                </Typography>
                <Typography
                  fontSize='0.75rem'
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.Role}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: '25px' }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
