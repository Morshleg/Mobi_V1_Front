import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { themeSettings } from './theme';
import LoginScreen from 'screens/loginScreen';
import PrivateRoute from 'components/PrivateRoute.jsx';
import Layout from 'screens/layout';
import DashboardScreen from 'screens/dashboardScreen';
import Products from 'screens/products';

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
            <Route path='' element={<PrivateRoute />}>
              <Route path='' element={<Layout />}>
                <Route path='/dashboard' element={<DashboardScreen />} />
                <Route path='/stock' element={<Products />} />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
