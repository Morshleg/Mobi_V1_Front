import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { themeSettings } from './theme';
import LoginScreen from 'screens/loginScreen';
import PrivateRoute from 'components/PrivateRoute';
import Layout from 'screens/layout';
import DashboardScreen from 'screens/dashboardScreen';
import Products from 'screens/products';
import Admin from 'screens/admin';
// import Repairs from 'screens/repairs';

const App = () => {
  const mode = useSelector((state) => state.auth.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={<LoginScreen />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path='/dashboard' element={<DashboardScreen />} />
                <Route path='/stock' element={<Products />} />
                {/* <Route path='/réparations' element={<Repairs />} /> */}
                <Route path='/utilisateurs' element={<Admin />} />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
