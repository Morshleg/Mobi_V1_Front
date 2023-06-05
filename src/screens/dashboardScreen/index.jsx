import React from 'react';
import { Box } from '@mui/material';
import Header from 'components/Header';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const token = Cookies.get('jwt');

  console.log(token);
  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='DASHBOARD' subtitle='Dashboard MobiOne' />
    </Box>
  );
};

export default Dashboard;
