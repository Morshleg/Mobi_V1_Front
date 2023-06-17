import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// A component representing a private route that requires authentication
const PrivateRoute = () => {
  useEffect(() => {
    fetchToken();
  }, []);

  axios.defaults.baseURL = 'http://localhost:5000';

  async function fetchToken() {
    try {
      const response = await axios.get('/api/token');

      const { tokenExpired } = response.data;

      if (tokenExpired) {
        console.error('Token has expired');

        localStorage.clear();
        window.location.href = '/';
      } else {
        console.log('Authorized');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.tokenExpired
      ) {
        console.error('Token has expired');

        localStorage.clear();
        window.location.href = '/';
      } else {
        console.error(error);
      }
    }
  }

  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Outlet /> : <Navigate to='/' replace />;
};

export default PrivateRoute;
