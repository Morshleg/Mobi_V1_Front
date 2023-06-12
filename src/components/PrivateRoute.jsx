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

      // Traitez la réponse de l'API
      const { tokenExpired } = response.data;

      if (tokenExpired) {
        // Le token du cookie a expiré
        console.error('Token has expired');

        // Videz le local storage
        localStorage.clear();
        window.location.href = '/';
      } else {
        console.log('Authorized');
      }
    } catch (error) {
      // Gérez les erreurs
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.tokenExpired
      ) {
        // Le token du cookie a expiré
        console.error('Token has expired');

        // Videz le local storage
        localStorage.clear();
        window.location.href = '/';
      } else {
        console.error(error);
      }
    }
  }
  // Retrieve the user information from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // If the user is authenticated (userInfo exists), render the nested routes (Outlet)
  // Otherwise, redirect the user to the home page ("/") using the Navigate component
  return userInfo ? <Outlet /> : <Navigate to='/' replace />;
};

export default PrivateRoute;
