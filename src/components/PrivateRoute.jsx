import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// A component representing a private route that requires authentication
const PrivateRoute = () => {
  // Retrieve the user information from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // If the user is authenticated (userInfo exists), render the nested routes (Outlet)
  // Otherwise, redirect the user to the home page ("/") using the Navigate component
  return userInfo ? <Outlet /> : <Navigate to='/' replace />;
};

export default PrivateRoute;
