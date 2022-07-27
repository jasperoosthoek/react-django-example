import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Root from './Root';
import localizationStrings from './localization/strings';
import { LocalizationProvider } from './components/shared/ReactToolbox';
import { Login } from './components/shared/Login';
import AuthenticatedRoute from './components/login/AuthenticatedRoute';
import Dashboard from './components/dashboard/Dashboard';

const App = () => {
  return (
    <Root>
      <LocalizationProvider lang='nl' strings={localizationStrings}>
        <ToastContainer hideProgressBar={true} newestOnTop={true} />
        <Routes>
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            exact
            path='/'
            element={<AuthenticatedRoute component={Dashboard} />}
          />
        </Routes>
      </LocalizationProvider>
    </Root>
  );
};

export default App;